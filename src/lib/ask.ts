import "server-only";
import type { CurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { subjectIdFilter, type ContentScope } from "@/lib/admin/scope";

export const MAX_QUESTION_CHARS = 3000;

/**
 * Subjects a student may ask about: those at a level where they hold an
 * active membership. Staff may ask about any subject (useful for testing).
 */
export async function askableSubjects(user: CurrentUser, now = new Date()) {
  const where =
    user.role === "STUDENT"
      ? {
          level: {
            in: (
              await db.subscription.findMany({
                where: { userId: user.id, startsAt: { lte: now }, endsAt: { gt: now } },
                select: { level: true },
              })
            ).map((s) => s.level),
          },
        }
      : {};
  return db.subject.findMany({
    where,
    orderBy: [{ level: "asc" }, { name: "asc" }],
    select: { id: true, name: true, level: true },
  });
}

export type AskResult = { ok: true; id: string } | { ok: false; message: string };

export async function createStudentQuestion(
  user: CurrentUser,
  input: { subjectId: string; body: string; imageId: string | null },
): Promise<AskResult> {
  const body = input.body.trim();
  if (!body && !input.imageId) {
    return { ok: false, message: "Type your question or attach a photo of it." };
  }
  if (body.length > MAX_QUESTION_CHARS) {
    return { ok: false, message: `Keep your question under ${MAX_QUESTION_CHARS} characters.` };
  }
  const allowed = await askableSubjects(user);
  if (!allowed.some((s) => s.id === input.subjectId)) {
    return { ok: false, message: "Choose one of your subjects." };
  }
  const question = await db.studentQuestion.create({
    data: { userId: user.id, subjectId: input.subjectId, body, imageId: input.imageId },
    select: { id: true },
  });
  return { ok: true, id: question.id };
}

const questionInclude = {
  subject: { select: { name: true, level: true } },
  replies: {
    orderBy: { createdAt: "asc" },
    select: { id: true, body: true, createdAt: true, author: { select: { name: true } } },
  },
} as const;

export function ownQuestions(userId: string) {
  return db.studentQuestion.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: questionInclude,
  });
}

/** The staff inbox: questions in the subjects this staff member covers. */
export function inboxQuestions(scope: ContentScope, status: "OPEN" | "ANSWERED" | "CLOSED") {
  return db.studentQuestion.findMany({
    where: { status, subjectId: subjectIdFilter(scope) },
    orderBy: { createdAt: status === "OPEN" ? "asc" : "desc" },
    take: 100,
    include: { ...questionInclude, user: { select: { name: true, level: true } } },
  });
}

export function openQuestionCount(scope: ContentScope) {
  return db.studentQuestion.count({
    where: { status: "OPEN", subjectId: subjectIdFilter(scope) },
  });
}
