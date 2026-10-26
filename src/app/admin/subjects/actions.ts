"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { formValues, invalid, type AdminFormState } from "@/lib/admin/form";
import {
  slugify,
  subjectSchema,
  subjectUpdateSchema,
  teamMemberSchema,
  teamWeightSchema,
  topicSchema,
  topicUpdateSchema,
} from "@/lib/admin/schemas";
import { ADMIN_ONLY, requireRole } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { normalizeCameroonPhone } from "@/lib/domain/phone";

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

/**
 * Adds a registered person to a subject's team. A student becomes an author;
 * an admin keeps admin access.
 */
export async function addTeamMember(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireRole(ADMIN_ONLY);
  const values = formValues(formData);
  const parsed = teamMemberSchema.safeParse(values);
  if (!parsed.success) return invalid(parsed.error, values);
  const { subjectId, identifier, weight } = parsed.data;
  const phone = identifier.includes("@") ? null : normalizeCameroonPhone(identifier);
  const user = await db.user.findUnique({
    where: phone ? { phone } : { email: identifier.toLowerCase() },
    select: { id: true, name: true, role: true },
  });
  if (!user) {
    return {
      fieldErrors: {
        identifier: ["No account with that phone or email. They must register first."],
      },
      values,
    };
  }
  try {
    await db.$transaction([
      db.subjectTeamMember.create({ data: { subjectId, userId: user.id, weight } }),
      ...(user.role === "STUDENT"
        ? [db.user.update({ where: { id: user.id }, data: { role: "AUTHOR" } })]
        : []),
    ]);
  } catch (err) {
    if (!isDuplicate(err)) throw err;
    return { fieldErrors: { identifier: [`${user.name} is already in this team.`] }, values };
  }
  revalidatePath(`/admin/subjects/${subjectId}`);
  return { message: `${user.name} added to the team.` };
}

export async function updateTeamWeight(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireRole(ADMIN_ONLY);
  const values = formValues(formData);
  const parsed = teamWeightSchema.safeParse(values);
  if (!parsed.success) return invalid(parsed.error, values);
  const member = await db.subjectTeamMember.update({
    where: { id: parsed.data.id },
    data: { weight: parsed.data.weight },
    select: { subjectId: true },
  });
  revalidatePath(`/admin/subjects/${member.subjectId}`);
  return { message: "Saved." };
}

/** Removes someone from a team. Their role stays as it is; change it from Students if needed. */
export async function removeTeamMember(memberId: string): Promise<void> {
  await requireRole(ADMIN_ONLY);
  const member = await db.subjectTeamMember.delete({
    where: { id: memberId },
    select: { subjectId: true },
  });
  revalidatePath(`/admin/subjects/${member.subjectId}`);
}
