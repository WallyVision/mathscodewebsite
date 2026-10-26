/** Random test drawing and the test bank, against a real database (DATABASE_URL). */
import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { practiceQuestionWhere } from "@/lib/content";
import { db } from "@/lib/db";
import { ensureTestDrawn } from "@/lib/tests";

const run = randomUUID().slice(0, 8);
const HOUR = 3_600_000;
let subjectId: string;
const bank: string[] = [];
let practiceOnly: string;

async function makeQuestion(stem: string, forTests: boolean) {
  const q = await db.question.create({
    data: {
      subjectId,
      stem,
      status: "PUBLISHED",
      forTests,
      options: {
        create: ["A", "B", "C", "D"].map((label) => ({
          label,
          text: label,
          isCorrect: label === "A",
        })),
      },
    },
  });
  return q.id;
}

const makeTest = (opensAt: Date, closesAt: Date, drawCount = 5) =>
  db.test.create({
    data: {
      subjectId,
      title: `Drawn ${run}`,
      kind: "WEEKLY",
      status: "SCHEDULED",
      opensAt,
      closesAt,
      durationMinutes: 30,
      drawCount,
    },
  });

beforeAll(async () => {
  subjectId = (
    await db.subject.create({ data: { level: "O_LEVEL", slug: `draw-${run}`, name: "Draw" } })
  ).id;
  for (let i = 0; i < 12; i++) bank.push(await makeQuestion(`Bank ${i}`, true));
  practiceOnly = await makeQuestion("Practice", false);
});

afterAll(async () => {
  await db.test.deleteMany({ where: { subjectId } });
  await db.question.deleteMany({ where: { subjectId } });
  await db.subject.delete({ where: { id: subjectId } });
  await db.$disconnect();
});

const drawnIds = async (testId: string) =>
  (await db.testQuestion.findMany({ where: { testId }, orderBy: { position: "asc" } })).map(
    (q) => q.questionId,
  );

describe("random test drawing", () => {
  it("chooses nothing before the test opens", async () => {
    const test = await makeTest(new Date(Date.now() + HOUR), new Date(Date.now() + 2 * HOUR));
    await ensureTestDrawn(test.id);
    expect(await drawnIds(test.id)).toEqual([]);
    expect((await db.test.findUniqueOrThrow({ where: { id: test.id } })).drawnAt).toBeNull();
  });

  it("draws once from the test bank when it opens, even with simultaneous callers", async () => {
    const test = await makeTest(new Date(Date.now() - HOUR), new Date(Date.now() + HOUR));
    await Promise.all([
      ensureTestDrawn(test.id),
      ensureTestDrawn(test.id),
      ensureTestDrawn(test.id),
    ]);
    const ids = await drawnIds(test.id);
    expect(ids).toHaveLength(5);
    expect(new Set(ids).size).toBe(5);
    expect(ids.every((id) => bank.includes(id))).toBe(true);
    expect(ids).not.toContain(practiceOnly);
    await ensureTestDrawn(test.id);
    expect(await drawnIds(test.id)).toEqual(ids);
  });

  it("prefers questions not used in earlier tests", async () => {
    const used = new Set(
      (await db.testQuestion.findMany({ where: { test: { subjectId } } })).map((q) => q.questionId),
    );
    const test = await makeTest(new Date(Date.now() - HOUR), new Date(Date.now() + HOUR));
    await ensureTestDrawn(test.id);
    const ids = await drawnIds(test.id);
    expect(ids.filter((id) => used.has(id))).toEqual([]);
  });

  it("keeps test-bank questions out of practice until a test using them has closed", async () => {
    const visible = async () =>
      (
        await db.question.findMany({
          where: { ...practiceQuestionWhere(new Date()), subjectId },
          select: { id: true },
        })
      ).map((q) => q.id);
    const before = await visible();
    expect(before).toEqual([practiceOnly]);

    const closed = await makeTest(new Date(Date.now() - 3 * HOUR), new Date(Date.now() - HOUR), 2);
    await ensureTestDrawn(closed.id, new Date(Date.now() - 2 * HOUR));
    const released = await drawnIds(closed.id);
    // Drawn questions already used by the still-open tests stay hidden until those close too.
    const openUses = new Set(
      (
        await db.testQuestion.findMany({
          where: { test: { subjectId, closesAt: { gt: new Date() } } },
        })
      ).map((q) => q.questionId),
    );
    const after = await visible();
    for (const id of released) expect(after.includes(id)).toBe(!openUses.has(id));
    expect(after).toContain(practiceOnly);
  });
});
