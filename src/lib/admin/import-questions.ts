import "server-only";
import { db } from "@/lib/db";
import type { ImportedQuestion } from "./question-import";

export interface ImportDestination {
  subjectId: string;
  topicId: string | null;
  /** When set, the questions become this past paper's questions, numbered from their headings. */
  pastPaperId: string | null;
}

export type ImportTarget = ({ ok: true } & ImportDestination) | { ok: false; message: string };

/** Checks the subject exists and the topic and past paper, if any, belong to it. */
export async function resolveImportTarget(
  subjectId: string,
  topicId: string | null,
  pastPaperId: string | null = null,
): Promise<ImportTarget> {
  const subject = await db.subject.findUnique({
    where: { id: subjectId },
    select: { topics: { select: { id: true } }, pastPapers: { select: { id: true } } },
  });
  if (!subject) return { ok: false, message: "Choose a subject." };
  if (topicId && !subject.topics.some((t) => t.id === topicId)) {
    return { ok: false, message: "That topic does not belong to the chosen subject." };
  }
  if (pastPaperId && !subject.pastPapers.some((p) => p.id === pastPaperId)) {
    return { ok: false, message: "That past paper does not belong to the chosen subject." };
  }
  return { ok: true, subjectId, topicId, pastPaperId };
}

/**
 * Creates the questions as drafts, all or nothing. Questions whose text
 * already exists in the subject are skipped, so importing the same set twice
 * does not create duplicates. Into a past paper, each question takes the
 * number in its heading (or its position in the set), and a number the paper
 * already has is skipped too.
 */
export async function createImportedQuestions(
  target: ImportDestination,
  questions: readonly ImportedQuestion[],
  options: { forTests?: boolean } = {},
): Promise<{ created: number; skipped: string[] }> {
  const { pastPaperId } = target;
  const numbered = questions.map((q, i) => ({ ...q, number: q.number ?? i + 1 }));
  const [existing, takenNumbers] = await Promise.all([
    db.question.findMany({
      where: { subjectId: target.subjectId, stem: { in: questions.map((q) => q.stem) } },
      select: { stem: true },
    }),
    pastPaperId
      ? db.question.findMany({ where: { pastPaperId }, select: { number: true } })
      : Promise.resolve([]),
  ]);
  const seen = new Set(existing.map((q) => q.stem));
  const numbers = new Set(takenNumbers.map((q) => q.number));
  const skipped: string[] = [];
  const fresh: typeof numbered = [];
  for (const q of numbered) {
    if (seen.has(q.stem) || (pastPaperId && numbers.has(q.number))) skipped.push(q.title);
    else {
      seen.add(q.stem);
      numbers.add(q.number);
      fresh.push(q);
    }
  }

  await db.$transaction(
    fresh.map((q) =>
      db.question.create({
        data: {
          subjectId: target.subjectId,
          topicId: target.topicId,
          pastPaperId,
          number: pastPaperId ? q.number : null,
          stem: q.stem,
          solution: q.solution,
          difficulty: q.difficulty,
          status: "DRAFT",
          source: pastPaperId ? "PAST_PAPER" : "ORIGINAL",
          forTests: options.forTests ?? false,
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
