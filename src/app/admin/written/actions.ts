"use server";

import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { formValues, invalid, type AdminFormState } from "@/lib/admin/form";
import { createWrittenQuestions } from "@/lib/admin/import-written";
import { writtenQuestionSchema } from "@/lib/admin/schemas";
import { contentScope, inScope, NOT_YOUR_SUBJECT, topicSubjectId } from "@/lib/admin/scope";
import { parseWrittenImport } from "@/lib/admin/written-import";
import { requireRole, STAFF_ROLES } from "@/lib/auth/session";
import { db } from "@/lib/db";

const paperSubjectId = async (pastPaperId: string) =>
  (await db.pastPaper.findUnique({ where: { id: pastPaperId }, select: { subjectId: true } }))
    ?.subjectId ?? null;

export async function saveWrittenQuestion(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const user = await requireRole(STAFF_ROLES);
  const values = formValues(formData);
  const parsed = writtenQuestionSchema.safeParse(values);
  if (!parsed.success) return invalid(parsed.error, values);
  const data = parsed.data;
  let id = values.id || null;

  const scope = await contentScope(user);
  const subjectId = await paperSubjectId(data.pastPaperId);
  if (!subjectId) return { message: "Choose a past paper.", values };
  if (!inScope(scope, subjectId)) return { message: NOT_YOUR_SUBJECT, values };
  if (data.topicId && (await topicSubjectId(data.topicId)) !== subjectId) {
    return { fieldErrors: { topicId: ["This topic belongs to another subject"] }, values };
  }

  try {
    if (id) {
      const existing = await db.writtenQuestion.findUnique({
        where: { id },
        select: { pastPaperId: true },
      });
      if (!existing) return { message: "This question no longer exists.", values };
      if (existing.pastPaperId !== data.pastPaperId) {
        return { message: "A written question cannot move to another paper.", values };
      }
      await db.writtenQuestion.update({ where: { id }, data });
    } else {
      // New questions go at the end of the paper.
      const last = await db.writtenQuestion.aggregate({
        where: { pastPaperId: data.pastPaperId },
        _max: { position: true },
      });
      id = (
        await db.writtenQuestion.create({
          data: { ...data, position: (last._max.position ?? 0) + 1 },
          select: { id: true },
        })
      ).id;
    }
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return {
        fieldErrors: { label: ["This paper already has a question with this label."] },
        values,
      };
    }
    throw err;
  }
  redirect(`/admin/written/${id}?saved=1`);
}

export async function deleteWrittenQuestion(formData: FormData): Promise<void> {
  const user = await requireRole(STAFF_ROLES);
  const id = String(formData.get("id") ?? "");
  const question = await db.writtenQuestion.findUnique({
    where: { id },
    select: { pastPaperId: true, pastPaper: { select: { subjectId: true } } },
  });
  if (!question || !inScope(await contentScope(user), question.pastPaper.subjectId)) {
    redirect("/admin/papers");
  }
  await db.writtenQuestion.delete({ where: { id } });
  redirect(`/admin/papers/${question.pastPaperId}?deleted=1`);
}

export interface WrittenImportState {
  message?: string;
  errors?: string[];
  /** Questions found by "Check", shown before anything is saved. */
  preview?: {
    label: string;
    section: string | null;
    marks: number | null;
    topic: string | null;
    body: string;
  }[];
  created?: number;
  skipped?: string[];
  values?: { pastPaperId: string; status: string; text: string };
}

export async function importWrittenQuestions(
  _prev: WrittenImportState,
  formData: FormData,
): Promise<WrittenImportState> {
  const user = await requireRole(STAFF_ROLES);
  const pastPaperId = String(formData.get("pastPaperId") ?? "");
  const status = formData.get("status") === "PUBLISHED" ? "PUBLISHED" : "DRAFT";
  const text = String(formData.get("text") ?? "");
  const values = { pastPaperId, status, text };

  const subjectId = pastPaperId ? await paperSubjectId(pastPaperId) : null;
  if (!subjectId) return { message: "Choose a past paper.", values };
  if (!inScope(await contentScope(user), subjectId)) return { message: NOT_YOUR_SUBJECT, values };
  if (!text.trim()) {
    return {
      message: "The Questions box is empty. Paste the paper into it, or choose a file.",
      values,
    };
  }
  const { questions, errors } = parseWrittenImport(text);
  if (errors.length > 0) {
    return { message: "Nothing was saved. Fix these problems and try again.", errors, values };
  }

  const topics = await db.topic.findMany({ where: { subjectId }, select: { name: true } });
  const known = new Set(topics.map((t) => t.name.toLowerCase()));
  const unknown = [
    ...new Set(
      questions.map((q) => q.topic).filter((t): t is string => !!t && !known.has(t.toLowerCase())),
    ),
  ];
  if (unknown.length > 0) {
    return {
      message: "Nothing was saved. Fix these problems and try again.",
      errors: unknown.map(
        (t) => `The subject has no topic called "${t}". Add it in Subjects, or fix the name.`,
      ),
      values,
    };
  }

  if (formData.get("intent") !== "import") {
    return {
      preview: questions.map(({ label, section, marks, topic, body }) => ({
        label,
        section,
        marks,
        topic,
        body,
      })),
      values,
    };
  }

  const result = await createWrittenQuestions(pastPaperId, questions, status);
  if (result.unknownTopics.length > 0) {
    return {
      message: "Nothing was saved. Fix these problems and try again.",
      errors: result.unknownTopics.map(
        (t) => `The subject has no topic called "${t}". Add it in Subjects, or fix the name.`,
      ),
      values,
    };
  }
  return { created: result.created, skipped: result.skipped, values: { ...values, text: "" } };
}
