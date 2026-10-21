"use server";

import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { formValues, invalid, type AdminFormState } from "@/lib/admin/form";
import { noteSchema } from "@/lib/admin/schemas";
import { requireRole, STAFF_ROLES } from "@/lib/auth/session";
import { db } from "@/lib/db";

export async function saveNote(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  await requireRole(STAFF_ROLES);
  const values = formValues(formData);
  const parsed = noteSchema.safeParse(values);
  if (!parsed.success) return invalid(parsed.error, values);

  let id = values.id || null;
  try {
    if (id) {
      await db.note.update({ where: { id }, data: parsed.data });
    } else {
      id = (await db.note.create({ data: parsed.data, select: { id: true } })).id;
    }
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return {
        fieldErrors: { slug: ["Another note in this topic already uses this URL name."] },
        values,
      };
    }
    throw err;
  }
  redirect(`/admin/notes/${id}?saved=1`);
}
