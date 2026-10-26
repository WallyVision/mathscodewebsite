"use server";

import { revalidatePath } from "next/cache";
import { formValues, invalid, type AdminFormState } from "@/lib/admin/form";
import { grantSchema, roleSchema } from "@/lib/admin/schemas";
import { ADMIN_ONLY, requireRole } from "@/lib/auth/session";
import { appUrl } from "@/lib/app-url";
import { createResetToken } from "@/lib/auth/password-reset";
import { db } from "@/lib/db";
import { site } from "@/lib/site";
import { productMetadata, productPurpose } from "@/lib/domain/checkout";
import { LEVEL_LABEL } from "@/lib/domain/pricing";
import { grantPurchase } from "@/lib/payments/grant";

/**
 * Records a payment taken outside the site (cash or a direct Mobile Money
 * transfer) and grants what it paid for: a membership including a competition
 * subject, or an extra subject for a member. The amount counts as that
 * subject's income, exactly like an online payment.
 */
export async function grantSubscription(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const admin = await requireRole(ADMIN_ONLY);
  const values = formValues(formData);
  const parsed = grantSchema.safeParse(values);
  if (!parsed.success) return invalid(parsed.error, values);
  const { userId, product: kind, subjectId, amount, reference } = parsed.data;
  const now = new Date();

  const subject = await db.subject.findUnique({
    where: { id: subjectId },
    select: { level: true, name: true },
  });
  if (!subject) return { fieldErrors: { subjectId: ["Choose the competition subject"] }, values };
  if (kind === "EXTRA") {
    const member = await db.subscription.findFirst({
      where: { userId, level: subject.level, startsAt: { lte: now }, endsAt: { gt: now } },
      select: { id: true },
    });
    if (!member) {
      return {
        message: `An extra subject needs an active ${LEVEL_LABEL[subject.level]} membership. Record a membership instead.`,
        fieldErrors: {},
        values,
      };
    }
  }

  const product =
    kind === "MEMBERSHIP"
      ? ({ kind: "SUBSCRIPTION", level: subject.level, subjectId } as const)
      : ({ kind: "COMPETITION_ENTRY", level: subject.level, subjectId } as const);
  const period = await db.$transaction(async (tx) => {
    const payment = await tx.payment.create({
      data: {
        userId,
        purpose: productPurpose(product),
        amount,
        provider: "manual",
        status: "SUCCESSFUL",
        completedAt: now,
        metadata: { ...productMetadata(product), reference, recordedBy: admin.id },
      },
    });
    return grantPurchase(tx, payment, product, now);
  });

  revalidatePath(`/admin/students/${userId}`);
  const until = period ? ` until ${period.endsAt.toISOString().slice(0, 10)}` : "";
  return {
    message:
      kind === "MEMBERSHIP"
        ? `Membership with ${subject.name} added${until}.`
        : `${subject.name} added${until}.`,
  };
}

export async function changeRole(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const admin = await requireRole(ADMIN_ONLY);
  const values = formValues(formData);
  const parsed = roleSchema.safeParse(values);
  if (!parsed.success) return invalid(parsed.error, values);
  if (parsed.data.userId === admin.id && parsed.data.role !== "ADMIN") {
    return { message: "You cannot remove your own admin access.", fieldErrors: {} };
  }
  await db.user.update({ where: { id: parsed.data.userId }, data: { role: parsed.data.role } });
  revalidatePath(`/admin/students/${parsed.data.userId}`);
  return { message: "Role updated." };
}

export interface ResetLinkResult {
  url?: string;
  expiresAt?: string;
  whatsappUrl?: string | null;
  error?: string;
}

/** Creates a one-time password reset link for a student to receive by WhatsApp or SMS. */
export async function createResetLink(userId: string): Promise<ResetLinkResult> {
  const admin = await requireRole(ADMIN_ONLY);
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, phone: true },
  });
  if (!user) return { error: "Student not found." };
  const { token, expiresAt } = await createResetToken(user.id, admin.id);
  const url = `${await appUrl()}/reset-password/${token}`;
  const text = `Hello ${user.name.split(" ")[0]}, here is your ${site.name} password reset link (valid 24 hours): ${url}`;
  return {
    url,
    expiresAt: expiresAt.toISOString(),
    whatsappUrl: user.phone
      ? `https://wa.me/${user.phone.replace(/^\+/, "")}?text=${encodeURIComponent(text)}`
      : null,
  };
}
