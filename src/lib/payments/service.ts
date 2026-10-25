import "server-only";
import type { Payment } from "@prisma/client";
import type { CurrentUser } from "@/lib/auth/session";
import { loadViewerAccess } from "@/lib/access";
import { db } from "@/lib/db";
import {
  mapProviderStatus,
  matchesExpected,
  productAmount,
  productDescription,
  productFromPayment,
  productMetadata,
  productPurpose,
  toProviderPhone,
  type Product,
} from "@/lib/domain/checkout";
import { canViewSolution } from "@/lib/domain/entitlements";
import { hasActiveSubscription } from "@/lib/domain/subscription";
import { site } from "@/lib/site";
import { getPaymentProvider } from "./campay";
import { grantPurchase } from "./grant";

/** A pending payment for the same product this recent is reused instead of prompting twice. */
const REUSE_PENDING_MS = 2 * 60 * 1000;
/** Pending payments CamPay has no record of after this long are marked failed. */
const ABANDON_UNKNOWN_MS = 30 * 60 * 1000;

export type CheckoutResult =
  | { ok: true; paymentId: string }
  | {
      ok: false;
      reason:
        | "UNAVAILABLE"
        | "NOT_FOUND"
        | "ALREADY_OWNED"
        | "SUBJECT_CLOSED"
        | "MEMBERSHIP_REQUIRED"
        | "PROVIDER_ERROR";
      message?: string;
    };

/** Checks that the product exists and is worth buying for this student. */
async function validateProduct(product: Product, user: CurrentUser) {
  const now = new Date();
  if (product.kind === "SUBSCRIPTION" || product.kind === "COMPETITION_ENTRY") {
    // A competition subject must exist at the product's level and be open.
    if (!product.subjectId) return { ok: false as const, reason: "NOT_FOUND" as const };
    const subject = await db.subject.findUnique({
      where: { id: product.subjectId },
      select: { level: true, competitionOpen: true },
    });
    if (!subject || subject.level !== product.level) {
      return { ok: false as const, reason: "NOT_FOUND" as const };
    }
    if (!subject.competitionOpen) return { ok: false as const, reason: "SUBJECT_CLOSED" as const };
    if (product.kind === "COMPETITION_ENTRY") {
      const access = await loadViewerAccess(user);
      if (!hasActiveSubscription(access.subscriptions, product.level, now)) {
        return { ok: false as const, reason: "MEMBERSHIP_REQUIRED" as const };
      }
    }
    return { ok: true as const };
  }

  const access = await loadViewerAccess(user);

  if (product.kind === "QUESTION_SOLUTION") {
    const q = await db.question.findUnique({
      where: { id: product.questionId },
      select: {
        id: true,
        status: true,
        solution: true,
        pastPaperId: true,
        subject: { select: { level: true } },
      },
    });
    if (!q || q.status !== "PUBLISHED" || !q.solution)
      return { ok: false as const, reason: "NOT_FOUND" as const };
    const owned = canViewSolution(
      access,
      { questionId: q.id, pastPaperId: q.pastPaperId, level: q.subject.level },
      now,
    );
    return owned ? { ok: false as const, reason: "ALREADY_OWNED" as const } : { ok: true as const };
  }

  const paper = await db.pastPaper.findUnique({
    where: { id: product.pastPaperId },
    select: { id: true, status: true, subject: { select: { level: true } } },
  });
  if (!paper || paper.status !== "PUBLISHED")
    return { ok: false as const, reason: "NOT_FOUND" as const };
  const owned =
    access.unlockedPaperIds.has(paper.id) ||
    user.role !== "STUDENT" ||
    hasActiveSubscription(access.subscriptions, paper.subject.level, now);
  return owned ? { ok: false as const, reason: "ALREADY_OWNED" as const } : { ok: true as const };
}

/**
 * Starts a Mobile Money payment: records it, then asks CamPay to send the
 * payment prompt to the student's phone.
 */
export async function startCheckout(
  user: CurrentUser,
  product: Product,
  phoneE164: string,
): Promise<CheckoutResult> {
  const provider = getPaymentProvider();
  if (!provider) return { ok: false, reason: "UNAVAILABLE" };

  const valid = await validateProduct(product, user);
  if (!valid.ok) return { ok: false, reason: valid.reason };

  const purpose = productPurpose(product);
  const metadata = productMetadata(product);
  const amount = productAmount(product);

  // A double tap or quick retry returns the payment already waiting on the phone.
  const recent = await db.payment.findFirst({
    where: {
      userId: user.id,
      purpose,
      status: "PENDING",
      payerPhone: phoneE164,
      createdAt: { gt: new Date(Date.now() - REUSE_PENDING_MS) },
    },
    orderBy: { createdAt: "desc" },
  });
  // Compare what was bought, not the extra details saved after CamPay replied.
  const sameProduct =
    recent &&
    JSON.stringify(productFromPayment(recent.purpose, recent.metadata)) === JSON.stringify(product);
  if (recent && sameProduct && recent.providerReference) {
    return { ok: true, paymentId: recent.id };
  }

  const payment = await db.payment.create({
    data: {
      userId: user.id,
      purpose,
      amount,
      provider: provider.name,
      payerPhone: phoneE164,
      metadata,
    },
  });

  let result;
  try {
    result = await provider.collect({
      amount,
      from: toProviderPhone(phoneE164),
      description: productDescription(product, site.gcePrep.name),
      externalReference: payment.id,
    });
  } catch (err) {
    console.error("CamPay collect failed", err);
    result = {
      ok: false as const,
      message: "Could not reach the payment service. Please try again.",
    };
  }

  if (!result.ok) {
    await db.payment.update({
      where: { id: payment.id },
      data: { status: "FAILED", failureReason: result.message, completedAt: new Date() },
    });
    return { ok: false, reason: "PROVIDER_ERROR", message: result.message };
  }

  await db.payment.update({
    where: { id: payment.id },
    data: {
      providerReference: result.reference,
      metadata: { ...metadata, ussdCode: result.ussdCode, operator: result.operator },
    },
  });
  return { ok: true, paymentId: payment.id };
}

/**
 * Grants what was paid for. Safe to call more than once: only the call that
 * moves the payment out of PENDING grants anything.
 */
async function fulfil(payment: Payment, now: Date): Promise<void> {
  const product = productFromPayment(payment.purpose, payment.metadata);
  await db.$transaction(async (tx) => {
    const claimed = await tx.payment.updateMany({
      where: { id: payment.id, status: "PENDING" },
      data: { status: "SUCCESSFUL", completedAt: now },
    });
    if (claimed.count === 0 || !product) return;

    await grantPurchase(tx, payment, product, now);
  });
}

async function markFailed(paymentId: string, reason: string) {
  await db.payment.updateMany({
    where: { id: paymentId, status: "PENDING" },
    data: { status: "FAILED", failureReason: reason, completedAt: new Date() },
  });
}

/**
 * Asks CamPay for the payment's real status and applies it. This is the only
 * path that grants access: notifications from CamPay just trigger it.
 */
export async function refreshPayment(paymentId: string): Promise<Payment | null> {
  const payment = await db.payment.findUnique({ where: { id: paymentId } });
  if (!payment || payment.status !== "PENDING" || !payment.providerReference) return payment;
  const provider = getPaymentProvider();
  if (!provider) return payment;

  const transaction = await provider.getTransaction(payment.providerReference);
  const now = new Date();

  if (!transaction) {
    if (now.getTime() - payment.createdAt.getTime() > ABANDON_UNKNOWN_MS) {
      await markFailed(payment.id, "The payment service has no record of this payment.");
    }
  } else {
    const status = mapProviderStatus(transaction.status);
    if (status === "SUCCESSFUL") {
      if (matchesExpected(payment, transaction)) {
        await fulfil(payment, now);
      } else {
        console.error("CamPay amount mismatch", { paymentId, reported: transaction.amount });
        await markFailed(
          payment.id,
          `Paid amount (${String(transaction.amount)} ${transaction.currency}) did not match the price. Contact support.`,
        );
      }
    } else if (status === "FAILED") {
      await markFailed(payment.id, "The payment was declined or cancelled.");
    }
  }
  return db.payment.findUnique({ where: { id: paymentId } });
}

/** Finds the payment a CamPay notification refers to. */
export async function findPaymentForNotification(
  reference: string | null,
  externalReference: string | null,
) {
  if (reference) {
    const byReference = await db.payment.findUnique({ where: { providerReference: reference } });
    if (byReference) return byReference;
  }
  return externalReference ? db.payment.findUnique({ where: { id: externalReference } }) : null;
}
