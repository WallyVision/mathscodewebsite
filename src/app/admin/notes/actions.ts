"use server";

import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { formValues, invalid, type AdminFormState } from "@/lib/admin/form";
import { noteSchema } from "@/lib/admin/schemas";
import { contentScope, inScope, NOT_YOUR_SUBJECT, topicSubjectId } from "@/lib/admin/scope";
import { requireRole, STAFF_ROLES } from "@/lib/auth/session";
import { db } from "@/lib/db";

export async function saveNote(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const user = await requireRole(STAFF_ROLES);
  const values = formValues(formData);
  const parsed = noteSchema.safeParse(values);
  if (!parsed.success) return invalid(parsed.error, values);

  let id = values.id || null;
  const scope = await contentScope(user);
  if (!inScope(scope, await topicSubjectId(parsed.data.topicId))) {
    return { message: NOT_YOUR_SUBJECT, values };
  }
  if (id) {
    const existing = await db.note.findUnique({ where: { id }, select: { topicId: true } });
    if (!existing) return { message: "This note no longer exists.", values };
    if (!inScope(scope, await topicSubjectId(existing.topicId))) {
      return { message: NOT_YOUR_SUBJECT, values };
    }
  }
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
