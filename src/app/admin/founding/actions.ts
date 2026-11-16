"use server";

import { revalidatePath } from "next/cache";
import { formValues, invalid, type AdminFormState } from "@/lib/admin/form";
import { foundingSchema } from "@/lib/admin/schemas";
import { ADMIN_ONLY, requireRole } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { FOUNDING } from "@/lib/domain/founding";
import { normalizeCameroonPhone } from "@/lib/domain/phone";
import { openFoundingMemberships, recordFoundingMember } from "@/lib/founding";

function refresh() {
  revalidatePath("/admin/founding");
  revalidatePath("/founding");
  revalidatePath("/");
}

/** Records a founding-member payment taken by hand (cash or a direct Mobile Money transfer). */
export async function recordFounding(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const admin = await requireRole(ADMIN_ONLY);
  const values = formValues(formData);
  const parsed = foundingSchema.safeParse(values);
  if (!parsed.success) return invalid(parsed.error, values);
  const { contact, subjectId, amount, reference } = parsed.data;

  const phone = normalizeCameroonPhone(contact);
  const user = await db.user.findFirst({
    where: phone ? { phone } : { email: { equals: contact, mode: "insensitive" } },
    select: { id: true, name: true, level: true },
  });
  if (!user) {
    return {
      message: "No account uses that phone number or email. The student must sign up first.",
      fieldErrors: { contact: ["No account found"] },
      values,
    };
  }
  const subject = await db.subject.findUnique({
    where: { id: subjectId },
    select: { level: true, name: true },
  });
  if (!subject) return { fieldErrors: { subjectId: ["Choose the competition subject"] }, values };

  const result = await recordFoundingMember({
    userId: user.id,
    subjectId,
    amount,
    reference,
    recordedBy: admin.id,
    now: new Date(),
  });
  if (!result.ok) {
    const message = {
      ALREADY: `${user.name} is already a founding member.`,
      FULL: `All ${FOUNDING.places} founding places are taken.`,
      NO_STUDENT: "No account found.",
      NO_SUBJECT: "Choose the competition subject.",
    }[result.reason];
    return { message, fieldErrors: {}, values };
  }
  refresh();
  return {
    message: `${user.name} is Founding Member #${result.number} (${subject.name}).${
      result.activated ? " Their membership has started." : ""
    }`,
  };
}

/** Starts every founding member's membership. Done once, on launch day. */
export async function openFounding(): Promise<void> {
  await requireRole(ADMIN_ONLY);
  await openFoundingMemberships(new Date());
  refresh();
}
