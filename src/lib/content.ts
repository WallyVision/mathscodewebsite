import "server-only";
import type { Level, Prisma } from "@prisma/client";
import { notFound } from "next/navigation";
import { cache } from "react";
import type { CurrentUser } from "@/lib/auth/session";
import { loadViewerAccess } from "@/lib/access";
import type { WrittenQuestionView } from "@/components/written-question-card";
import { db } from "@/lib/db";
import { canViewSolution } from "@/lib/domain/entitlements";
import { levelFromSlug } from "@/lib/domain/levels";

/**
 * Questions students may revise from: published, and not part of a draft
 * test or a test that has not closed yet. Test-bank questions stay hidden
 * until they have appeared in a closed test. This stops answers to an
 * upcoming or running test leaking through the practice bank.
 */
export function practiceQuestionWhere(now: Date): Prisma.QuestionWhereInput {
  return {
    status: "PUBLISHED",
    testQuestions: {
      none: { test: { OR: [{ status: "DRAFT" }, { closesAt: { gt: now } }] } },
    },
    OR: [
      { forTests: false },
      { testQuestions: { some: { test: { status: { not: "DRAFT" }, closesAt: { lte: now } } } } },
    ],
  };
}

const questionSelect = {
  id: true,
  number: true,
  stem: true,
  solution: true,
  pastPaperId: true,
  options: { select: { label: true, text: true, isCorrect: true }, orderBy: { label: "asc" } },
} satisfies Prisma.QuestionSelect;

type QuestionRow = Prisma.QuestionGetPayload<{ select: typeof questionSelect }>;

export interface PracticeQuestion {
  id: string;
  number: number | null;
  stem: string;
  options: { label: string; text: string }[];
  correctLabel: string | null;
  fromPastPaper: boolean;
  pastPaperId: string | null;
  /** Worked solution when the viewer may see it; "locked" when they may not; null when none written. */
  solution: string | "locked" | null;
}

/** Resolves the subject for a /learn/[level]/[subject] URL, or renders 404. */
export const requireSubject = cache(async (levelParam: string, subjectParam: string) => {
  const level = levelFromSlug(levelParam);
  const subject = level
    ? await db.subject.findUnique({ where: { level_slug: { level, slug: subjectParam } } })
    : null;
  if (!subject) notFound();
  return subject;
});

/** Resolves a topic within a subject, or renders 404. */
export const requireTopic = cache(async (subjectId: string, topicParam: string) => {
  const topic = await db.topic.findUnique({
    where: { subjectId_slug: { subjectId, slug: topicParam } },
  });
  if (!topic) notFound();
  return topic;
});

/** Removes paid solution text the viewer is not entitled to before it reaches the page. */
async function toPracticeQuestions(
  rows: QuestionRow[],
  level: Level,
  user: CurrentUser,
): Promise<PracticeQuestion[]> {
  const access = await loadViewerAccess(user);
  const now = new Date();
  return rows.map((q) => {
    const allowed = canViewSolution(
      access,
      { questionId: q.id, pastPaperId: q.pastPaperId, level },
      now,
    );
    return {
      id: q.id,
      number: q.number,
      stem: q.stem,
      options: q.options.map(({ label, text }) => ({ label, text })),
      correctLabel: q.options.find((o) => o.isCorrect)?.label ?? null,
      fromPastPaper: q.pastPaperId !== null,
      pastPaperId: q.pastPaperId,
      solution: q.solution === null ? null : allowed ? q.solution : "locked",
    };
  });
}

export async function getTopicPracticeQuestions(topicId: string, level: Level, user: CurrentUser) {
  const rows = await db.question.findMany({
    where: { ...practiceQuestionWhere(new Date()), topicId },
    select: questionSelect,
    orderBy: { createdAt: "asc" },
  });
  return toPracticeQuestions(rows, level, user);
}

export async function getPaperQuestions(pastPaperId: string, level: Level, user: CurrentUser) {
  const rows = await db.question.findMany({
    where: { ...practiceQuestionWhere(new Date()), pastPaperId },
    select: questionSelect,
    orderBy: [{ number: "asc" }, { createdAt: "asc" }],
  });
  return toPracticeQuestions(rows, level, user);
}

export interface PaperWrittenSection {
  /** "A", "B"... or null for questions without a section. */
  section: string | null;
  questions: WrittenQuestionView[];
}

/**
 * A paper's published written (structured) questions in paper order, grouped
 * by section, with paid solution text removed for viewers not entitled to it.
 */
export async function getPaperWrittenQuestions(
  pastPaperId: string,
  level: Level,
  user: CurrentUser,
): Promise<PaperWrittenSection[]> {
  const [rows, access] = await Promise.all([
    db.writtenQuestion.findMany({
      where: { pastPaperId, status: "PUBLISHED" },
      orderBy: [{ position: "asc" }, { createdAt: "asc" }],
      select: { id: true, label: true, section: true, marks: true, body: true, solution: true },
    }),
    loadViewerAccess(user),
  ]);
  // Written questions are unlocked with their whole paper, never one by one.
  const allowed = canViewSolution(access, { questionId: "", pastPaperId, level }, new Date());
  const sections: PaperWrittenSection[] = [];
  for (const row of rows) {
    let group = sections.at(-1);
    if (!group || group.section !== row.section) {
      group = { section: row.section, questions: [] };
      sections.push(group);
    }
    group.questions.push({
      id: row.id,
      label: row.label,
      marks: row.marks,
      body: row.body,
      pastPaperId,
      solution: row.solution === null ? null : allowed ? row.solution : "locked",
    });
  }
  return sections;
}
