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

/** Subjects and every question, for the test form's question picker. */
export async function loadTestFormOptions() {
  const [subjects, questions] = await Promise.all([
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
  ]);
  return {
    subjects: subjects.map((s) => ({ id: s.id, name: `${LEVEL_LABEL[s.level]} ${s.name}` })),
    questions: questions.map((q): PickableQuestion => ({
      id: q.id,
      subjectId: q.subjectId,
      stem: q.stem.length > 160 ? `${q.stem.slice(0, 160)}…` : q.stem,
      topic: q.topic?.name ?? null,
      published: q.status === "PUBLISHED",
    })),
  };
}
