"use server";

import { redirect } from "next/navigation";
import { formValues, invalid, type AdminFormState } from "@/lib/admin/form";
import { questionSchema } from "@/lib/admin/schemas";
import { requireRole, STAFF_ROLES } from "@/lib/auth/session";
import { db } from "@/lib/db";

export async function saveQuestion(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireRole(STAFF_ROLES);
  const values = formValues(formData);
  const parsed = questionSchema.safeParse(values);
  if (!parsed.success) return invalid(parsed.error, values);
  const { options, correct, ...data } = parsed.data;
  const questionId = values.id || null;

  if (questionId) {
    const existing = await db.question.findUnique({
      where: { id: questionId },
      select: {
        options: { select: { label: true, isCorrect: true } },
        _count: { select: { answers: true } },
      },
    });
    if (!existing) return { message: "This question no longer exists.", values };
    const currentCorrect = existing.options.find((o) => o.isCorrect)?.label;
    // Changing the answer key after students answered would make their marks wrong.
    if (existing._count.answers > 0 && currentCorrect !== correct) {
      return {
        fieldErrors: {
          correct: [
            "Students have already answered this in a test, so the correct option cannot change.",
          ],
        },
        values,
      };
    }
    await db.$transaction([
      db.question.update({
        where: { id: questionId },
        data: { ...data, source: data.pastPaperId ? "PAST_PAPER" : "ORIGINAL" },
      }),
      ...options.map((o) =>
        db.questionOption.upsert({
          where: { questionId_label: { questionId, label: o.label } },
          create: { questionId, label: o.label, text: o.text, isCorrect: o.label === correct },
          update: { text: o.text, isCorrect: o.label === correct },
        }),
      ),
    ]);
    redirect(`/admin/questions/${questionId}?saved=1`);
  }

  const created = await db.question.create({
    data: {
      ...data,
      source: data.pastPaperId ? "PAST_PAPER" : "ORIGINAL",
      options: { create: options.map((o) => ({ ...o, isCorrect: o.label === correct })) },
    },
    select: { id: true },
  });
  redirect(`/admin/questions/${created.id}?saved=1`);
}
