import "server-only";
import { db } from "@/lib/db";
import { LEVEL_LABEL } from "@/lib/domain/pricing";

export interface PickableQuestion {
  id: string;
  subjectId: string;
  stem: string;
  topic: string | null;
  published: boolean;
}

/** Subjects, every question for the picker, and each subject's test bank size. */
export async function loadTestFormOptions() {
  const [subjects, questions, bank] = await Promise.all([
    db.subject.findMany({
      orderBy: [{ level: "asc" }, { name: "asc" }],
      select: { id: true, name: true, level: true },
    }),
    db.question.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        subjectId: true,
        stem: true,
        status: true,
        topic: { select: { name: true } },
      },
    }),
    db.question.groupBy({
      by: ["subjectId"],
      where: { status: "PUBLISHED", forTests: true, testQuestions: { none: {} } },
      _count: { _all: true },
    }),
  ]);
  return {
    subjects: subjects.map((s) => ({ id: s.id, name: `${LEVEL_LABEL[s.level]} ${s.name}` })),
    /** Published test-bank questions never used in a test, per subject. */
    unusedBank: Object.fromEntries(bank.map((b) => [b.subjectId, b._count._all])) as Record<
      string,
      number
    >,
    questions: questions.map((q): PickableQuestion => ({
      id: q.id,
      subjectId: q.subjectId,
      stem: q.stem.length > 160 ? `${q.stem.slice(0, 160)}…` : q.stem,
      topic: q.topic?.name ?? null,
      published: q.status === "PUBLISHED",
    })),
  };
}
