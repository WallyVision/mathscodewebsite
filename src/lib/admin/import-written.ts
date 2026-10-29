import "server-only";
import type { ContentStatus } from "@prisma/client";
import { db } from "@/lib/db";
import type { ImportedWrittenQuestion } from "./written-import";

/**
 * Adds written questions to a past paper, all or nothing, in file order. A
 * label the paper already has is skipped, so importing the same file again
 * (for example after adding more questions to it) only adds the new ones.
 * Topic names are matched, ignoring case, to the topics of the paper's subject.
 */
export async function createWrittenQuestions(
  pastPaperId: string,
  questions: readonly ImportedWrittenQuestion[],
  status: ContentStatus = "DRAFT",
): Promise<{ created: number; skipped: string[]; unknownTopics: string[] }> {
  const paper = await db.pastPaper.findUniqueOrThrow({
    where: { id: pastPaperId },
    select: {
      writtenQuestions: { select: { label: true } },
      subject: { select: { topics: { select: { id: true, name: true } } } },
    },
  });
  const topicIds = new Map(paper.subject.topics.map((t) => [t.name.toLowerCase(), t.id]));
  const unknownTopics = [
    ...new Set(
      questions
        .map((q) => q.topic)
        .filter((t): t is string => !!t && !topicIds.has(t.toLowerCase())),
    ),
  ];
  if (unknownTopics.length > 0) return { created: 0, skipped: [], unknownTopics };

  const taken = new Set(paper.writtenQuestions.map((q) => q.label.toUpperCase()));
  const fresh = questions
    .map((q, i) => ({ ...q, position: i + 1 }))
    .filter((q) => !taken.has(q.label.toUpperCase()));
  await db.$transaction(
    fresh.map((q) =>
      db.writtenQuestion.create({
        data: {
          pastPaperId,
          label: q.label,
          section: q.section,
          position: q.position,
          marks: q.marks,
          topicId: q.topic ? topicIds.get(q.topic.toLowerCase())! : null,
          body: q.body,
          solution: q.solution,
          status,
        },
      }),
    ),
  );
  return {
    created: fresh.length,
    skipped: questions.filter((q) => taken.has(q.label.toUpperCase())).map((q) => q.label),
    unknownTopics: [],
  };
}
