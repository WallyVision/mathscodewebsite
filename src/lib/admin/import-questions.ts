import "server-only";
import { db } from "@/lib/db";
import type { ImportedQuestion } from "./question-import";

export type ImportTarget =
  { ok: true; subjectId: string; topicId: string | null } | { ok: false; message: string };

/** Checks the subject exists and the topic, if any, belongs to it. */
export async function resolveImportTarget(
  subjectId: string,
  topicId: string | null,
): Promise<ImportTarget> {
  const subject = await db.subject.findUnique({
    where: { id: subjectId },
    select: { topics: { select: { id: true } } },
  });
  if (!subject) return { ok: false, message: "Choose a subject." };
  if (topicId && !subject.topics.some((t) => t.id === topicId)) {
    return { ok: false, message: "That topic does not belong to the chosen subject." };
  }
  return { ok: true, subjectId, topicId };
}

/**
 * Creates the questions as drafts, all or nothing. Questions whose text
 * already exists in the subject are skipped, so importing the same set twice
 * does not create duplicates.
 */
export async function createImportedQuestions(
  target: { subjectId: string; topicId: string | null },
  questions: readonly ImportedQuestion[],
): Promise<{ created: number; skipped: string[] }> {
  const existing = await db.question.findMany({
    where: { subjectId: target.subjectId, stem: { in: questions.map((q) => q.stem) } },
    select: { stem: true },
  });
  const seen = new Set(existing.map((q) => q.stem));
  const skipped: string[] = [];
  const fresh: ImportedQuestion[] = [];
  for (const q of questions) {
    if (seen.has(q.stem)) skipped.push(q.title);
    else {
      seen.add(q.stem);
      fresh.push(q);
    }
  }

  await db.$transaction(
    fresh.map((q) =>
      db.question.create({
        data: {
          subjectId: target.subjectId,
          topicId: target.topicId,
          stem: q.stem,
          solution: q.solution,
          difficulty: q.difficulty,
          status: "DRAFT",
          source: "ORIGINAL",
          options: {
            create: q.options.map((o) => ({ ...o, isCorrect: o.label === q.correct })),
          },
        },
        select: { id: true },
      }),
    ),
  );
  return { created: fresh.length, skipped };
}
