"use server";

import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { formValues, invalid, type AdminFormState } from "@/lib/admin/form";
import { paperSchema } from "@/lib/admin/schemas";
import { requireRole, STAFF_ROLES } from "@/lib/auth/session";
import { db } from "@/lib/db";

export async function savePaper(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireRole(STAFF_ROLES);
  const values = formValues(formData);
  const parsed = paperSchema.safeParse(values);
  if (!parsed.success) return invalid(parsed.error, values);

  let id = values.id || null;
  try {
    if (id) {
      await db.pastPaper.update({ where: { id }, data: parsed.data });
    } else {
      id = (await db.pastPaper.create({ data: parsed.data, select: { id: true } })).id;
    }
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return {
        fieldErrors: { paperNumber: ["This subject already has that paper for that year."] },
        values,
      };
    }
    throw err;
  }
  redirect(`/admin/papers/${id}?saved=1`);
}
