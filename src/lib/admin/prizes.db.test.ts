/** Monthly prize data against a real database (DATABASE_URL). */
import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { db } from "@/lib/db";
import { subjectIncome } from "@/lib/revenue";
import { loadMonthlyPrizes } from "./prizes";

const run = randomUUID().slice(0, 8);
// A month safely in the past, so its tests are closed and awards allowed.
const PERIOD = "2025-03";
const inMonth = (day: number, hour = 12) =>
  new Date(`2025-03-${String(day).padStart(2, "0")}T${hour}:00:00+01:00`);

let subjectId: string;
let otherSubjectId: string;
const userIds: string[] = [];

beforeAll(async () => {
  // A_LEVEL with a unique slug; revenue below is A Level-only, so other data does not interfere
  // except for real payments in March 2025, which a fresh database does not have.
  const subject = await db.subject.create({
    data: { level: "A_LEVEL", slug: `prize-${run}`, name: `Prize ${run}` },
  });
  subjectId = subject.id;

  const makeTest = (title: string, closesAt: Date) =>
    db.test.create({
      data: {
        subjectId,
        title,
        kind: "WEEKLY",
        status: "SCHEDULED",
        opensAt: new Date(closesAt.getTime() - 86_400_000),
        closesAt,
        durationMinutes: 30,
      },
    });
  const t1 = await makeTest("Week 1", inMonth(8));
  const t2 = await makeTest("Week 2", inMonth(15));
  // Closes just after the month ends in Cameroon time; must not count.
  const t3 = await makeTest("Next month", new Date("2025-04-01T00:30:00+01:00"));

  for (const name of ["Top Student", "Second Student", "Missed One"]) {
    const u = await db.user.create({
      data: {
        name,
        email: `prize-${run}-${userIds.length}@example.test`,
        passwordHash: "x",
        level: "A_LEVEL",
      },
    });
    userIds.push(u.id);
  }
  const [top, second, missed] = userIds as [string, string, string];
  const attempt = (
    userId: string,
    testId: string,
    score: number,
    status: "SUBMITTED" | "DISQUALIFIED" = "SUBMITTED",
  ) =>
    db.testAttempt.create({
      data: {
        userId,
        testId,
        score,
        maxScore: 10,
        timeTaken: 600,
        status,
        seed: 1,
        startedAt: inMonth(1),
        deadlineAt: inMonth(1, 13),
        submittedAt: inMonth(1, 12),
      },
    });
  await attempt(top, t1.id, 9);
  await attempt(top, t2.id, 9);
  await attempt(top, t3.id, 10);
  await attempt(second, t1.id, 8);
  await attempt(second, t2.id, 7);
  await attempt(missed, t1.id, 10);

  // Income: two entries in March (one paid online), one in April, one for another subject.
  const other = await db.subject.create({
    data: { level: "A_LEVEL", slug: `prize-other-${run}`, name: `Other ${run}` },
  });
  otherSubjectId = other.id;
  const online = await db.payment.create({
    data: {
      userId: top,
      purpose: "SUBSCRIPTION",
      amount: 2000,
      provider: "campay",
      status: "SUCCESSFUL",
      completedAt: inMonth(2),
      metadata: { level: "A_LEVEL", subjectId, run },
    },
  });
  const entry = (subject: string, createdAt: Date, paymentId: string | null = null) =>
    db.competitionEntry.create({
      data: {
        userId: top,
        subjectId: subject,
        startsAt: createdAt,
        endsAt: new Date(createdAt.getTime() + 30 * 86_400_000),
        source: "MEMBERSHIP",
        income: 2000,
        paymentId,
        createdAt,
      },
    });
  await entry(subjectId, inMonth(2), online.id);
  await entry(subjectId, inMonth(20));
  await entry(subjectId, new Date("2025-04-02T10:00:00+01:00"));
  await entry(otherSubjectId, inMonth(3));
});

afterAll(async () => {
  await db.prizeAward.deleteMany({ where: { subjectId } });
  await db.test.deleteMany({ where: { subjectId } });
  await db.competitionEntry.deleteMany({ where: { userId: { in: userIds } } });
  await db.payment.deleteMany({ where: { userId: { in: userIds } } });
  await db.subject.deleteMany({ where: { id: { in: [subjectId, otherSubjectId] } } });
  await db.user.deleteMany({ where: { id: { in: userIds } } });
  await db.$disconnect();
});

describe("monthly prizes", () => {
  it("counts the subject's entries made within the month, separating online payments", async () => {
    const start = new Date("2025-03-01T00:00:00+01:00");
    const end = new Date("2025-04-01T00:00:00+01:00");
    expect(await subjectIncome(subjectId, start, end)).toEqual({ gross: 4000, online: 2000 });
  });

  it("ranks students who sat every test closed in the month", async () => {
    const data = await loadMonthlyPrizes(PERIOD, subjectId);
    expect(data?.tests.map((t) => t.title)).toEqual(["Week 1", "Week 2"]);
    expect(data?.monthEnded).toBe(true);
    expect(data?.standings.map((s) => [s.user.name, s.totalScore, s.rank])).toEqual([
      ["Top Student", 18, 1],
      ["Second Student", 15, 2],
      ["Missed One", 10, null],
    ]);
    // 20% of the subject's 4,000 is far below the minimum, so the pool is topped up.
    expect(data?.pool).toBe(10_000);
    expect(data?.amounts).toEqual([5000, 3000, 2000]);
  });

  it("leaves the subject's own team out of the standings", async () => {
    const member = await db.subjectTeamMember.create({
      data: { subjectId, userId: userIds[1]! },
    });
    try {
      const data = await loadMonthlyPrizes(PERIOD, subjectId);
      expect(data?.standings.map((s) => s.user.name)).not.toContain("Second Student");
    } finally {
      await db.subjectTeamMember.delete({ where: { id: member.id } });
    }
  });

  it("leaves disqualified attempts out of the standings", async () => {
    await db.testAttempt.updateMany({
      where: { userId: userIds[0], test: { title: "Week 2", subjectId } },
      data: { status: "DISQUALIFIED" },
    });
    const data = await loadMonthlyPrizes(PERIOD, subjectId);
    expect(data?.standings.find((s) => s.user.name === "Top Student")).toMatchObject({
      eligible: false,
    });
    expect(data?.standings[0]?.user.name).toBe("Second Student");
  });
});
