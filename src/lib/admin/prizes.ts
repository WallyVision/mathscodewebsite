import "server-only";
import type { Level } from "@prisma/client";
import { db } from "@/lib/db";
import { parsePeriod } from "@/lib/domain/period";
import { monthlyStandings, splitPool, subjectPrizePool } from "@/lib/domain/prizes";

/** Successful subscription payments for a level, completed within the month. */
export async function levelRevenue(level: Level, start: Date, end: Date): Promise<number> {
  const result = await db.payment.aggregate({
    _sum: { amount: true },
    where: {
      purpose: "SUBSCRIPTION",
      status: "SUCCESSFUL",
      completedAt: { gte: start, lt: end },
      metadata: { path: ["level"], equals: level },
    },
  });
  return result._sum.amount ?? 0;
}

/**
 * Everything needed to award a subject's monthly prizes: closed tests in the
 * month, standings, revenue, pool and existing awards.
 */
export async function loadMonthlyPrizes(period: string, subjectId: string) {
  const range = parsePeriod(period);
  const subject = await db.subject.findUnique({ where: { id: subjectId } });
  if (!range || !subject) return null;
  const now = new Date();

  const tests = await db.test.findMany({
    where: {
      subjectId,
      status: { not: "DRAFT" },
      closesAt: { gte: range.start, lt: range.end, lte: now },
    },
    orderBy: { closesAt: "asc" },
    select: { id: true, title: true, closesAt: true },
  });
  const testIds = tests.map((t) => t.id);

  const [attempts, revenue, subjectsAtLevel, awards] = await Promise.all([
    db.testAttempt.findMany({
      where: {
        testId: { in: testIds },
        status: { in: ["SUBMITTED", "EXPIRED"] },
        score: { not: null },
      },
      select: {
        userId: true,
        testId: true,
        score: true,
        timeTaken: true,
        submittedAt: true,
        focusLosses: true,
      },
    }),
    levelRevenue(subject.level, range.start, range.end),
    db.subject.count({ where: { level: subject.level } }),
    db.prizeAward.findMany({
      where: { subjectId, period, category: "TOP_SCORER" },
      orderBy: { rank: "asc" },
      include: { user: { select: { id: true, name: true, phone: true } } },
    }),
  ]);

  const standings = monthlyStandings(
    attempts.map((a) => ({
      userId: a.userId,
      testId: a.testId,
      score: a.score ?? 0,
      timeTaken: a.timeTaken ?? 0,
      submittedAt: a.submittedAt ?? new Date(0),
      focusLosses: a.focusLosses,
    })),
    testIds,
  );
  const users = await db.user.findMany({
    where: { id: { in: standings.map((s) => s.userId) } },
    select: { id: true, name: true, phone: true },
  });
  const userById = new Map(users.map((u) => [u.id, u]));

  const pool = subjectPrizePool(revenue, subjectsAtLevel);
  return {
    subject,
    range,
    monthEnded: now >= range.end,
    tests,
    revenue,
    subjectsAtLevel,
    pool,
    amounts: splitPool(pool),
    standings: standings.map((s) => ({ ...s, user: userById.get(s.userId)! })),
    awards,
  };
}
