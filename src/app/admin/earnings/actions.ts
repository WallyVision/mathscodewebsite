"use server";

import { revalidatePath } from "next/cache";
import { formValues, invalid, type AdminFormState } from "@/lib/admin/form";
import { payoutPaidSchema } from "@/lib/admin/schemas";
import { ADMIN_ONLY, requireRole } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { parsePeriod } from "@/lib/domain/period";
import { createPayouts } from "@/lib/earnings";

export async function createPayoutsAction(period: string): Promise<{ message: string }> {
  await requireRole(ADMIN_ONLY);
  if (!parsePeriod(period)) return { message: "Unknown month." };
  const created = await createPayouts(period);
  revalidatePath("/admin/earnings");
  return {
    message:
      created > 0
        ? `${created} payout${created === 1 ? "" : "s"} created. Pay them, then mark each as paid.`
        : "No new payouts: the month has not ended, there was no team income, or they already exist.",
  };
}

export async function markPayoutPaid(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireRole(ADMIN_ONLY);
  const values = formValues(formData);
  const parsed = payoutPaidSchema.safeParse(values);
  if (!parsed.success) return invalid(parsed.error, values);
  const updated = await db.teamPayout.updateMany({
    where: { id: parsed.data.id, status: "PENDING" },
    data: { status: "PAID", paidAt: new Date(), reference: parsed.data.reference },
  });
  revalidatePath("/admin/earnings");
  return { message: updated.count > 0 ? "Marked as paid." : "Already marked as paid." };
}
