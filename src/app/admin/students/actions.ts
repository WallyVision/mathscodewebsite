"use server";

import { revalidatePath } from "next/cache";
import { formValues, invalid, type AdminFormState } from "@/lib/admin/form";
import { grantSchema, roleSchema } from "@/lib/admin/schemas";
import { ADMIN_ONLY, requireRole } from "@/lib/auth/session";
import { appUrl } from "@/lib/app-url";
import { createResetToken } from "@/lib/auth/password-reset";
import { db } from "@/lib/db";
import { site } from "@/lib/site";
import { nextSubscriptionPeriod } from "@/lib/domain/subscription";

/**
 * Records a payment taken outside the site (cash or a direct Mobile Money
 * transfer) and grants a subscription period for it.
 */
export async function grantSubscription(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const admin = await requireRole(ADMIN_ONLY);
  const values = formValues(formData);
  const parsed = grantSchema.safeParse(values);
  if (!parsed.success) return invalid(parsed.error, values);
  const { userId, level, amount, reference } = parsed.data;
  const now = new Date();

  const period = await db.$transaction(async (tx) => {
    const existing = await tx.subscription.findMany({
      where: { userId },
      select: { level: true, startsAt: true, endsAt: true },
    });
    const payment = await tx.payment.create({
      data: {
        userId,
        purpose: "SUBSCRIPTION",
        amount,
        provider: "manual",
        status: "SUCCESSFUL",
        completedAt: now,
        metadata: { level, reference, recordedBy: admin.id },
      },
    });
    const next = nextSubscriptionPeriod(existing, level, now);
    await tx.subscription.create({ data: { userId, level, ...next, paymentId: payment.id } });
    return next;
  });

  revalidatePath(`/admin/students/${userId}`);
  return { message: `Subscription added until ${period.endsAt.toISOString().slice(0, 10)}.` };
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
