"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { formValues, invalid, type AdminFormState } from "@/lib/admin/form";
import {
  slugify,
  subjectSchema,
  subjectUpdateSchema,
  topicSchema,
  topicUpdateSchema,
} from "@/lib/admin/schemas";
import { ADMIN_ONLY, requireRole } from "@/lib/auth/session";
import { db } from "@/lib/db";

const isDuplicate = (err: unknown) =>
  err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002";

export async function createSubject(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireRole(ADMIN_ONLY);
  const values = formValues(formData);
  const parsed = subjectSchema.safeParse(values);
  if (!parsed.success) return invalid(parsed.error, values);
  const slug = slugify(parsed.data.name);
  if (!slug) return { fieldErrors: { name: ["Use letters or numbers in the name"] }, values };
  let id: string;
  try {
    ({ id } = await db.subject.create({ data: { ...parsed.data, slug }, select: { id: true } }));
  } catch (err) {
    if (!isDuplicate(err)) throw err;
    return { fieldErrors: { name: ["This level already has a subject with that name"] }, values };
  }
  revalidatePath("/admin/subjects");
  redirect(`/admin/subjects/${id}?saved=1`);
}

export async function updateSubject(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireRole(ADMIN_ONLY);
  const values = formValues(formData);
  const parsed = subjectUpdateSchema.safeParse(values);
  if (!parsed.success) return invalid(parsed.error, values);
  const { id, ...data } = parsed.data;
  // The web address (slug) stays the same, so links students saved keep working.
  await db.subject.update({ where: { id }, data });
  revalidatePath(`/admin/subjects/${id}`);
  revalidatePath("/admin/subjects");
  return { message: "Saved." };
}

export async function addTopic(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  await requireRole(ADMIN_ONLY);
  const values = formValues(formData);
  const parsed = topicSchema.safeParse(values);
  if (!parsed.success) return invalid(parsed.error, values);
  const { subjectId, name } = parsed.data;
  const slug = slugify(name);
  if (!slug) return { fieldErrors: { name: ["Use letters or numbers in the name"] }, values };
  const last = await db.topic.aggregate({ where: { subjectId }, _max: { position: true } });
  try {
    await db.topic.create({
      data: { subjectId, name, slug, position: (last._max.position ?? -1) + 1 },
    });
  } catch (err) {
    if (!isDuplicate(err)) throw err;
    return { fieldErrors: { name: ["This subject already has a topic with that name"] }, values };
  }
  revalidatePath(`/admin/subjects/${subjectId}`);
  return { message: `Added ${name}.` };
}

export async function updateTopic(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireRole(ADMIN_ONLY);
  const values = formValues(formData);
  const parsed = topicUpdateSchema.safeParse(values);
  if (!parsed.success) return invalid(parsed.error, values);
  const { id, ...data } = parsed.data;
  const topic = await db.topic.update({ where: { id }, data, select: { subjectId: true } });
  revalidatePath(`/admin/subjects/${topic.subjectId}`);
  return { message: "Saved." };
}
