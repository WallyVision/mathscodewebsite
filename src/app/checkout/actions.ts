"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { requireUser } from "@/lib/auth/session";
import type { Product } from "@/lib/domain/checkout";
import { isCameroonMobile, normalizeCameroonPhone } from "@/lib/domain/phone";
import { refreshPayment, startCheckout } from "@/lib/payments/service";
import { db } from "@/lib/db";
import { consumeAll, LIMITS, retryMessage } from "@/lib/rate-limit";
import { safeReturnPath } from "@/lib/domain/checkout";

export interface CheckoutFormState {
  message?: string;
  phoneError?: string;
  phone?: string;
}

const productSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("SUBSCRIPTION"), level: z.enum(["O_LEVEL", "A_LEVEL"]) }),
  z.object({ kind: z.literal("QUESTION_SOLUTION"), questionId: z.string().min(1).max(64) }),
  z.object({ kind: z.literal("PAPER_SOLUTIONS"), pastPaperId: z.string().min(1).max(64) }),
]);

const MESSAGES = {
  UNAVAILABLE: "Online payment is not available yet. Please try again later.",
  NOT_FOUND: "This item is no longer available.",
  ALREADY_OWNED: "You already have access to this.",
} as const;

export async function startCheckoutAction(
  _prev: CheckoutFormState,
  formData: FormData,
): Promise<CheckoutFormState> {
  const user = await requireUser();
  const phoneInput = String(formData.get("phone") ?? "");
  const phone = normalizeCameroonPhone(phoneInput);
  if (!phone || !isCameroonMobile(phone)) {
    return {
      phoneError: "Enter an MTN or Orange mobile number, e.g. 677 12 34 56",
      phone: phoneInput,
    };
  }

  const parsed = productSchema.safeParse({
    kind: formData.get("kind"),
    level: formData.get("level") ?? undefined,
    questionId: formData.get("questionId") ?? undefined,
    pastPaperId: formData.get("pastPaperId") ?? undefined,
  });
  if (!parsed.success) return { message: MESSAGES.NOT_FOUND, phone: phoneInput };

  const limited = await consumeAll([
    [`checkout:user:${user.id}`, LIMITS.checkoutPerUser],
    [`checkout:phone:${phone}`, LIMITS.checkoutPerPhone],
  ]);
  if (!limited.allowed)
    return { message: retryMessage(limited.retryAfterSeconds), phone: phoneInput };

  const result = await startCheckout(user, parsed.data as Product, phone);
  if (!result.ok) {
    const message =
      result.reason === "PROVIDER_ERROR"
        ? `The payment could not be started: ${result.message ?? "unknown error"}`
        : MESSAGES[result.reason];
    return { message, phone: phoneInput };
  }

  const returnTo = safeReturnPath(String(formData.get("returnTo") ?? ""));
  if (returnTo) {
    const payment = await db.payment.findUnique({
      where: { id: result.paymentId },
      select: { metadata: true },
    });
    await db.payment.update({
      where: { id: result.paymentId },
      data: { metadata: { ...(payment?.metadata as object), returnTo } },
    });
  }
  redirect(`/payments/${result.paymentId}`);
}

export type PaymentPoll = { status: "PENDING" | "SUCCESSFUL" | "FAILED" };

/** Called by the waiting page to check the payment with CamPay. */
export async function checkPaymentAction(paymentId: string): Promise<PaymentPoll> {
  const user = await requireUser();
  const payment = await db.payment.findUnique({
    where: { id: paymentId },
    select: { userId: true },
  });
  if (!payment || payment.userId !== user.id) return { status: "FAILED" };
  try {
    const updated = await refreshPayment(paymentId);
    return { status: updated?.status ?? "FAILED" };
  } catch (err) {
    console.error("Payment status check failed", err);
    return { status: "PENDING" };
  }
}
