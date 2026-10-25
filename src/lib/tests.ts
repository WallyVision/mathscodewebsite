import "server-only";
import { randomInt } from "node:crypto";
import { Prisma, type AttemptStatus } from "@prisma/client";
import type { CurrentUser } from "@/lib/auth/session";
import { loadViewerAccess } from "@/lib/access";
import { db } from "@/lib/db";
import {
  acceptsAnswers,
  attemptDeadline,
  canStartAttempt,
  SUBMISSION_GRACE_SECONDS,
} from "@/lib/domain/attempt";
import { canEnterTest } from "@/lib/domain/entitlements";
import { displayLabel, layoutPaper, leaderboardName, timeTakenSeconds } from "@/lib/domain/paper";
import { rankEntries } from "@/lib/domain/ranking";
import { gradeMcq } from "@/lib/domain/scoring";

type Tx = Prisma.TransactionClient;

/**
 * Marking runs in a transaction. When many students submit at once they queue
 * for a database connection, so wait well beyond Prisma's 2-second default.
 */
const TRANSACTION_OPTIONS = { maxWait: 15_000, timeout: 20_000 };

export type Answers = Record<string, string | null>;

/** Answers, correct options and the leaderboard are revealed once the test window closes. */
export function isRevealed(test: { closesAt: Date }, now: Date): boolean {
  return now >= test.closesAt;
}

export async function getTestForUser(testId: string, user: CurrentUser) {
  const test = await db.test.findUnique({
    where: { id: testId },
    include: {
      subject: { select: { name: true, level: true } },
      _count: { select: { questions: true } },
    },
  });
  // Students only see scheduled tests at their own level; staff see everything.
  if (!test) return null;
  if (user.role === "STUDENT" && (test.status === "DRAFT" || test.subject.level !== user.level)) {
    return null;
  }
  return test;
}

export async function getOwnAttempt(testId: string, userId: string) {
  await finalizeExpiredAttempts(testId);
  return db.testAttempt.findUnique({ where: { testId_userId: { testId, userId } } });
}

// ─── Starting ────────────────────────────────────────────────────────────────

export type StartResult =
  | { ok: true }
  | { ok: false; reason: "NOT_FOUND" | "NOT_OPEN" | "CLOSED" | "NOT_SUBSCRIBED" | "FINISHED" };

/** Starts the student's single attempt, or resumes it if already started. */
export async function startAttempt(testId: string, user: CurrentUser): Promise<StartResult> {
  const test = await getTestForUser(testId, user);
  if (!test || test.status === "DRAFT") return { ok: false, reason: "NOT_FOUND" };

  const existing = await getOwnAttempt(testId, user.id);
  if (existing) {
    return existing.status === "IN_PROGRESS" ? { ok: true } : { ok: false, reason: "FINISHED" };
  }

  const now = new Date();
  const window = canStartAttempt(test, now);
  if (!window.ok) return window;
  if (!canEnterTest(await loadViewerAccess(user), test.subjectId, now)) {
    return { ok: false, reason: "NOT_SUBSCRIBED" };
  }

  try {
    await db.testAttempt.create({
      data: {
        testId,
        userId: user.id,
        seed: randomInt(0, 2 ** 31 - 1),
        startedAt: now,
        deadlineAt: attemptDeadline(test, now),
      },
    });
  } catch (err) {
    // A double-click can race two creates; the unique constraint keeps one.
    if (!(err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002")) throw err;
  }
  return { ok: true };
}

// ─── The question paper ──────────────────────────────────────────────────────

async function loadTestQuestions(testId: string, tx: Tx = db) {
  return tx.testQuestion.findMany({
    where: { testId },
    select: {
      position: true,
      question: {
        select: {
          id: true,
          stem: true,
          solution: true,
          options: { select: { id: true, label: true, text: true, isCorrect: true } },
        },
      },
    },
  });
}

type TestQuestionRow = Awaited<ReturnType<typeof loadTestQuestions>>[number];

/** Questions in this student's order, each with options in this student's order. */
function orderForAttempt(rows: TestQuestionRow[], seed: number) {
  const byId = new Map(rows.map((r) => [r.question.id, r.question]));
  const layout = layoutPaper(
    rows.map((r) => ({
      questionId: r.question.id,
      position: r.position,
      options: r.question.options,
    })),
    seed,
  );
  return layout.map((slot) => {
    const question = byId.get(slot.questionId)!;
    const options = slot.optionIds.map((id) => question.options.find((o) => o.id === id)!);
    return { question, options };
  });
}

export interface PaperQuestion {
  id: string;
  stem: string;
  options: { id: string; label: string; text: string }[];
}

/** The paper for an in-progress attempt. Correct answers are never included. */
export async function getAttemptPaper(testId: string, userId: string) {
  const attempt = await getOwnAttempt(testId, userId);
  if (!attempt || attempt.status !== "IN_PROGRESS") return null;

  const [rows, answers] = await Promise.all([
    loadTestQuestions(testId),
    db.attemptAnswer.findMany({
      where: { attemptId: attempt.id },
      select: { questionId: true, selectedOptionId: true },
    }),
  ]);

  const questions: PaperQuestion[] = orderForAttempt(rows, attempt.seed).map(
    ({ question, options }) => ({
      id: question.id,
      stem: question.stem,
      options: options.map((o, i) => ({ id: o.id, label: displayLabel(i), text: o.text })),
    }),
  );
  const saved: Answers = Object.fromEntries(answers.map((a) => [a.questionId, a.selectedOptionId]));
  return { attempt, questions, answers: saved };
}

// ─── Answering ───────────────────────────────────────────────────────────────

export type SaveResult = { ok: true } | { ok: false; reason: "CLOSED" | "INVALID" };

async function openAttempt(testId: string, userId: string, now: Date, tx: Tx = db) {
  const attempt = await tx.testAttempt.findUnique({
    where: { testId_userId: { testId, userId } },
  });
  if (!attempt || attempt.status !== "IN_PROGRESS" || !acceptsAnswers(attempt.deadlineAt, now)) {
    return null;
  }
  return attempt;
}

/** Keeps only answers to questions in this test, with options belonging to that question. */
function validAnswers(rows: TestQuestionRow[], answers: Answers): Answers {
  const valid: Answers = {};
  for (const row of rows) {
    const q = row.question;
    if (!(q.id in answers)) continue;
    const choice = answers[q.id] ?? null;
    if (choice === null || q.options.some((o) => o.id === choice)) valid[q.id] = choice;
  }
  return valid;
}

async function upsertAnswers(attemptId: string, answers: Answers, now: Date, tx: Tx = db) {
  for (const [questionId, selectedOptionId] of Object.entries(answers)) {
    await tx.attemptAnswer.upsert({
      where: { attemptId_questionId: { attemptId, questionId } },
      create: { attemptId, questionId, selectedOptionId, answeredAt: now },
      update: { selectedOptionId, answeredAt: now },
    });
  }
}

export async function saveAnswer(
  testId: string,
  userId: string,
  questionId: string,
  optionId: string | null,
): Promise<SaveResult> {
  const now = new Date();
  const attempt = await openAttempt(testId, userId, now);
  if (!attempt) return { ok: false, reason: "CLOSED" };

  const answer = validAnswers(await loadTestQuestions(testId), { [questionId]: optionId });
  if (!(questionId in answer)) return { ok: false, reason: "INVALID" };
  await upsertAnswers(attempt.id, answer, now);
  return { ok: true };
}

export async function recordFocusLoss(testId: string, userId: string): Promise<void> {
  await db.testAttempt.updateMany({
    where: { testId, userId, status: "IN_PROGRESS" },
    data: { focusLosses: { increment: 1 } },
  });
}

// ─── Submitting and marking ──────────────────────────────────────────────────

/**
 * Marks an attempt and closes it. The conditional update makes this safe to
 * call twice (e.g. the timer and the submit button firing together).
 */
async function gradeAndClose(
  tx: Tx,
  attempt: { id: string; testId: string; startedAt: Date; deadlineAt: Date },
  status: Extract<AttemptStatus, "SUBMITTED" | "EXPIRED">,
  now: Date,
  preloaded?: TestQuestionRow[],
) {
  const rows = preloaded ?? (await loadTestQuestions(attempt.testId, tx));
  const answers = await tx.attemptAnswer.findMany({
    where: { attemptId: attempt.id },
    select: { questionId: true, selectedOptionId: true },
  });
  const result = gradeMcq(
    rows.flatMap((r) => {
      const correct = r.question.options.find((o) => o.isCorrect);
      return correct ? [{ id: r.question.id, correctOptionId: correct.id }] : [];
    }),
    new Map(answers.map((a) => [a.questionId, a.selectedOptionId])),
  );
  await tx.testAttempt.updateMany({
    where: { id: attempt.id, status: "IN_PROGRESS" },
    data: {
      status,
      submittedAt: now,
      score: result.score,
      maxScore: rows.length,
      timeTaken: timeTakenSeconds(attempt.startedAt, now, attempt.deadlineAt),
    },
  });
}

/**
 * Submits the student's attempt. Answers sent with the submission are saved
 * first, so answers whose autosave failed on a bad connection still count.
 */
export async function submitAttempt(testId: string, userId: string, finalAnswers: Answers) {
  const now = new Date();
  await db.$transaction(async (tx) => {
    const attempt = await openAttempt(testId, userId, now, tx);
    if (!attempt) return;
    const rows = await loadTestQuestions(testId, tx);
    const saved = await tx.attemptAnswer.findMany({
      where: { attemptId: attempt.id },
      select: { questionId: true, selectedOptionId: true },
    });
    const savedById = new Map(saved.map((a) => [a.questionId, a.selectedOptionId]));
    // Autosave has usually stored these already; only write what differs.
    const changed = Object.fromEntries(
      Object.entries(validAnswers(rows, finalAnswers)).filter(
        ([questionId, optionId]) => savedById.get(questionId) !== optionId,
      ),
    );
    await upsertAnswers(attempt.id, changed, now, tx);
    await gradeAndClose(tx, attempt, "SUBMITTED", now, rows);
  }, TRANSACTION_OPTIONS);
  // Covers an attempt that ran out of time before the submission arrived.
  await finalizeExpiredAttempts(testId);
}

/** Marks attempts whose time ran out without a submission, using their saved answers. */
export async function finalizeExpiredAttempts(testId: string): Promise<void> {
  const now = new Date();
  const cutoff = new Date(now.getTime() - SUBMISSION_GRACE_SECONDS * 1000);
  const expired = await db.testAttempt.findMany({
    where: { testId, status: "IN_PROGRESS", deadlineAt: { lt: cutoff } },
    select: { id: true, testId: true, startedAt: true, deadlineAt: true },
  });
  for (const attempt of expired) {
    await db.$transaction(
      (tx) => gradeAndClose(tx, attempt, "EXPIRED", attempt.deadlineAt),
      TRANSACTION_OPTIONS,
    );
  }
}

// ─── Results ─────────────────────────────────────────────────────────────────

export interface LeaderboardRow {
  userId: string;
  name: string;
  score: number;
  timeTaken: number;
  rank: number;
}

export async function getLeaderboard(testId: string): Promise<LeaderboardRow[]> {
  await finalizeExpiredAttempts(testId);
  const attempts = await db.testAttempt.findMany({
    where: { testId, status: { in: ["SUBMITTED", "EXPIRED"] }, score: { not: null } },
    select: {
      userId: true,
      score: true,
      timeTaken: true,
      submittedAt: true,
      user: { select: { name: true } },
    },
  });
  return rankEntries(
    attempts.map((a) => ({
      userId: a.userId,
      name: leaderboardName(a.user.name),
      score: a.score ?? 0,
      timeTaken: a.timeTaken ?? 0,
      submittedAt: a.submittedAt ?? new Date(0),
    })),
  ).map(({ userId, name, score, timeTaken, rank }) => ({ userId, name, score, timeTaken, rank }));
}

export interface ReviewQuestion {
  id: string;
  stem: string;
  solution: string | null;
  options: { id: string; label: string; text: string; isCorrect: boolean }[];
  selectedOptionId: string | null;
}

/** Question-by-question review in the student's own order. Only call once revealed. */
export async function getAttemptReview(attempt: {
  id: string;
  testId: string;
  seed: number;
}): Promise<ReviewQuestion[]> {
  const [rows, answers] = await Promise.all([
    loadTestQuestions(attempt.testId),
    db.attemptAnswer.findMany({
      where: { attemptId: attempt.id },
      select: { questionId: true, selectedOptionId: true },
    }),
  ]);
  const chosen = new Map(answers.map((a) => [a.questionId, a.selectedOptionId]));
  return orderForAttempt(rows, attempt.seed).map(({ question, options }) => ({
    id: question.id,
    stem: question.stem,
    solution: question.solution,
    options: options.map((o, i) => ({
      id: o.id,
      label: displayLabel(i),
      text: o.text,
      isCorrect: o.isCorrect,
    })),
    selectedOptionId: chosen.get(question.id) ?? null,
  }));
}

export async function listTestsForUser(user: CurrentUser) {
  const tests = await db.test.findMany({
    where: {
      status: { not: "DRAFT" },
      ...(user.role === "STUDENT" ? { subject: { level: user.level } } : {}),
    },
    orderBy: { opensAt: "desc" },
    take: 50,
    select: {
      id: true,
      title: true,
      kind: true,
      opensAt: true,
      closesAt: true,
      durationMinutes: true,
      subject: { select: { name: true } },
      attempts: {
        where: { userId: user.id },
        select: { status: true, score: true, maxScore: true },
      },
    },
  });
  return tests.map(({ attempts, ...test }) => ({ ...test, attempt: attempts[0] ?? null }));
}
