"use server";

import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { formValues, invalid, type AdminFormState } from "@/lib/admin/form";
import { postSchema } from "@/lib/admin/schemas";
import { requireRole, STAFF_ROLES } from "@/lib/auth/session";
import { db } from "@/lib/db";

export async function savePost(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  await requireRole(STAFF_ROLES);
  const values = formValues(formData);
  const parsed = postSchema.safeParse(values);
  if (!parsed.success) return invalid(parsed.error, values);
  const data = parsed.data;

  let id = values.id || null;
  try {
    if (id) {
      const existing = await db.post.findUnique({ where: { id }, select: { publishedAt: true } });
      if (!existing) return { message: "This post no longer exists.", values };
      // The publish date is set the first time a post goes live and kept afterwards.
      const publishedAt =
        data.status === "PUBLISHED" ? (existing.publishedAt ?? new Date()) : existing.publishedAt;
      await db.post.update({ where: { id }, data: { ...data, publishedAt } });
    } else {
      const created = await db.post.create({
        data: { ...data, publishedAt: data.status === "PUBLISHED" ? new Date() : null },
        select: { id: true },
      });
      id = created.id;
    }
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return { fieldErrors: { slug: ["Another post already uses this URL name."] }, values };
    }
    throw err;
  }
  redirect(`/admin/posts/${id}?saved=1`);
}
