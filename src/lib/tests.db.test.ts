/**
 * Integration tests for the test engine against a real PostgreSQL database
 * (DATABASE_URL). Each run creates its own subject, test and users, then
 * removes them.
 */
import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { CurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import {
  finalizeExpiredAttempts,
  getAttemptPaper,
  getLeaderboard,
  saveAnswer,
  startAttempt,
  submitAttempt,
} from "@/lib/tests";

const run = randomUUID().slice(0, 8);
const HOUR = 60 * 60 * 1000;

let testId: string;
let subjectId: string;
const questions: { id: string; correct: string; wrong: string }[] = [];
const users: CurrentUser[] = [];

async function makeUser(name: string, subscribed: boolean): Promise<CurrentUser> {
  const user = await db.user.create({
    data: {
      name,
      email: `itest-${run}-${users.length}@example.test`,
      passwordHash: "x",
      level: "O_LEVEL",
    },
    select: { id: true, name: true, role: true, level: true, email: true, phone: true },
  });
  if (subscribed) {
    await db.subscription.create({
      data: {
        userId: user.id,
        level: "O_LEVEL",
        startsAt: new Date(Date.now() - HOUR),
        endsAt: new Date(Date.now() + 24 * HOUR),
      },
    });
  }
  users.push(user);
  return user;
}

beforeAll(async () => {
  const subject = await db.subject.create({
    data: { level: "O_LEVEL", slug: `itest-${run}`, name: `Integration ${run}` },
  });
  subjectId = subject.id;
  for (let i = 0; i < 3; i++) {
    const q = await db.question.create({
      data: {
        subjectId,
        stem: `Q${i}`,
        status: "PUBLISHED",
        options: {
          create: ["A", "B", "C", "D"].map((label) => ({
            label,
            text: label,
            isCorrect: label === "A",
          })),
        },
      },
      include: { options: true },
    });
    questions.push({
      id: q.id,
      correct: q.options.find((o) => o.isCorrect)!.id,
      wrong: q.options.find((o) => !o.isCorrect)!.id,
    });
  }
  const test = await db.test.create({
    data: {
      subjectId,
      title: `Integration test ${run}`,
      kind: "WEEKLY",
      status: "SCHEDULED",
      opensAt: new Date(Date.now() - HOUR),
      closesAt: new Date(Date.now() + HOUR),
      durationMinutes: 30,
      questions: { create: questions.map((q, position) => ({ questionId: q.id, position })) },
    },
  });
  testId = test.id;
});

afterAll(async () => {
  await db.test.deleteMany({ where: { subjectId } });
  await db.subject.delete({ where: { id: subjectId } });
  await db.user.deleteMany({ where: { id: { in: users.map((u) => u.id) } } });
  await db.$disconnect();
});

describe("test engine", () => {
  it("refuses students without a subscription", async () => {
    const free = await makeUser("Free Student", false);
    expect(await startAttempt(testId, free)).toEqual({ ok: false, reason: "NOT_SUBSCRIBED" });
  });

  it("starts once, then resumes the same attempt", async () => {
    const user = await makeUser("Ada Lovelace", true);
    expect(await startAttempt(testId, user)).toEqual({ ok: true });
    expect(await startAttempt(testId, user)).toEqual({ ok: true });
    expect(await db.testAttempt.count({ where: { testId, userId: user.id } })).toBe(1);
  });

  it("never sends correct answers with the paper", async () => {
    const paper = await getAttemptPaper(testId, users[1]!.id);
    expect(paper?.questions).toHaveLength(3);
    expect(JSON.stringify(paper)).not.toContain("isCorrect");
  });

  it("rejects an option that belongs to another question", async () => {
    const [q0, q1] = questions;
    expect(await saveAnswer(testId, users[1]!.id, q0!.id, q1!.correct)).toEqual({
      ok: false,
      reason: "INVALID",
    });
  });

  it("marks autosaved and submitted answers together, once", async () => {
    const user = users[1]!;
    const [q0, q1, q2] = questions;
    expect(await saveAnswer(testId, user.id, q0!.id, q0!.correct)).toEqual({ ok: true });
    // q1 never autosaved (bad connection) but arrives with the submission.
    await submitAttempt(testId, user.id, { [q1!.id]: q1!.correct, [q2!.id]: q2!.wrong });

    const attempt = await db.testAttempt.findUniqueOrThrow({
      where: { testId_userId: { testId, userId: user.id } },
    });
    expect(attempt).toMatchObject({ status: "SUBMITTED", score: 2, maxScore: 3 });

    // A second submission (e.g. the timer firing too) changes nothing.
    await submitAttempt(testId, user.id, { [q2!.id]: q2!.correct });
    const again = await db.testAttempt.findUniqueOrThrow({ where: { id: attempt.id } });
    expect(again.score).toBe(2);
    expect(await startAttempt(testId, user)).toEqual({ ok: false, reason: "FINISHED" });
  });

  it("refuses answers after submission", async () => {
    const [q2] = questions.slice(2);
    expect(await saveAnswer(testId, users[1]!.id, q2!.id, q2!.correct)).toEqual({
      ok: false,
      reason: "CLOSED",
    });
  });

  it("marks an attempt whose time ran out using its saved answers", async () => {
    const user = await makeUser("Time Runner", true);
    await startAttempt(testId, user);
    await saveAnswer(testId, user.id, questions[0]!.id, questions[0]!.correct);
    await db.testAttempt.updateMany({
      where: { testId, userId: user.id },
      data: { deadlineAt: new Date(Date.now() - 5 * 60 * 1000) },
    });
    // Late answers are refused, then the attempt is closed with what was saved.
    expect(await saveAnswer(testId, user.id, questions[1]!.id, questions[1]!.correct)).toEqual({
      ok: false,
      reason: "CLOSED",
    });
    await finalizeExpiredAttempts(testId);
    const attempt = await db.testAttempt.findUniqueOrThrow({
      where: { testId_userId: { testId, userId: user.id } },
    });
    expect(attempt).toMatchObject({ status: "EXPIRED", score: 1 });
  });

  it("ranks finished attempts by score", async () => {
    const board = await getLeaderboard(testId);
    expect(board.map((r) => [r.name, r.score, r.rank])).toEqual([
      ["Ada L.", 2, 1],
      ["Time R.", 1, 2],
    ]);
  });

  it("refuses to start after the test closes", async () => {
    await db.test.update({
      where: { id: testId },
      data: { closesAt: new Date(Date.now() - 1000) },
    });
    const late = await makeUser("Late Comer", true);
    expect(await startAttempt(testId, late)).toEqual({ ok: false, reason: "CLOSED" });
  });
});
