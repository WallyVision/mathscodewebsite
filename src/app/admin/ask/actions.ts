"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { formValues, invalid, type AdminFormState } from "@/lib/admin/form";
import { replySchema } from "@/lib/admin/schemas";
import { contentScope, inScope, NOT_YOUR_SUBJECT } from "@/lib/admin/scope";
import { requireRole, STAFF_ROLES } from "@/lib/auth/session";
import { db } from "@/lib/db";

async function questionInScope(questionId: string) {
  const user = await requireRole(STAFF_ROLES);
  const question = await db.studentQuestion.findUnique({
    where: { id: questionId },
    select: { subjectId: true },
  });
  const allowed = question !== null && inScope(await contentScope(user), question.subjectId);
  return { user, allowed };
}

export async function replyToQuestion(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const values = formValues(formData);
  const parsed = replySchema.safeParse(values);
  if (!parsed.success) return invalid(parsed.error, values);
  const { user, allowed } = await questionInScope(parsed.data.questionId);
  if (!allowed) return { message: NOT_YOUR_SUBJECT, values };
  await db.$transaction([
    db.studentQuestionReply.create({
      data: { questionId: parsed.data.questionId, authorId: user.id, body: parsed.data.body },
    }),
    db.studentQuestion.update({
      where: { id: parsed.data.questionId },
      data: { status: "ANSWERED" },
    }),
  ]);
  revalidatePath("/admin/ask");
  // The question leaves the Waiting list, so confirm on the page instead of in its form.
  redirect("/admin/ask?sent=1");
}

export async function setQuestionStatus(
  questionId: string,
  status: "OPEN" | "CLOSED",
): Promise<void> {
  const { allowed } = await questionInScope(questionId);
  if (!allowed) return;
  await db.studentQuestion.update({ where: { id: questionId }, data: { status } });
  revalidatePath("/admin/ask");
}
