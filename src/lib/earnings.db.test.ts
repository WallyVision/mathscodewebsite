/** Team earnings against a real database (DATABASE_URL). */
import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { CurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { authorEarnings, createPayouts, monthEarnings } from "./earnings";

const run = randomUUID().slice(0, 8);
const PERIOD = "2025-05";
const inMonth = (day: number) => new Date(`2025-05-${String(day).padStart(2, "0")}T12:00:00+01:00`);
const AFTER = new Date("2025-06-02T12:00:00+01:00");

let maths: string;
let physics: string;
const users: CurrentUser[] = [];

async function makeUser(name: string, role: "STUDENT" | "AUTHOR"): Promise<CurrentUser> {
  const user = await db.user.create({
    data: {
      name,
      email: `earn-${run}-${users.length}@example.test`,
      passwordHash: "x",
      level: "O_LEVEL",
      role,
    },
    select: { id: true, name: true, role: true, level: true, email: true, phone: true },
  });
  users.push(user);
  return user;
}

beforeAll(async () => {
  maths = (
    await db.subject.create({
      data: { level: "O_LEVEL", slug: `earn-m-${run}`, name: `Maths ${run}` },
    })
  ).id;
  physics = (
    await db.subject.create({
      data: { level: "O_LEVEL", slug: `earn-p-${run}`, name: `Physics ${run}` },
    })
  ).id;
  const lead = await makeUser("Lead Teacher", "AUTHOR");
  const assistant = await makeUser("Assistant Teacher", "AUTHOR");
  const physicsTeacher = await makeUser("Physics Teacher", "AUTHOR");
  await db.subjectTeamMember.createMany({
    data: [
      { subjectId: maths, userId: lead.id, weight: 3 },
      { subjectId: maths, userId: assistant.id, weight: 2 },
      { subjectId: physics, userId: physicsTeacher.id },
    ],
  });

  // 100 Maths entries in May (cash, no fees): 150,000 FCFA. One in June does not count.
  const student = await makeUser("A Student", "STUDENT");
  const entry = (subjectId: string, createdAt: Date, income: number) => ({
    userId: student.id,
    subjectId,
    startsAt: createdAt,
    endsAt: new Date(createdAt.getTime() + 30 * 86_400_000),
    source: "MEMBERSHIP" as const,
    income,
    createdAt,
  });
  await db.competitionEntry.createMany({
    data: [
      ...Array.from({ length: 100 }, (_, i) => entry(maths, inMonth(1 + (i % 28)), 1500)),
      entry(maths, AFTER, 1500),
      entry(physics, inMonth(10), 1000),
    ],
  });
});

afterAll(async () => {
  const ids = users.map((u) => u.id);
  await db.teamPayout.deleteMany({ where: { userId: { in: ids } } });
  await db.competitionEntry.deleteMany({ where: { userId: { in: ids } } });
  await db.subject.deleteMany({ where: { id: { in: [maths, physics] } } });
  await db.user.deleteMany({ where: { id: { in: ids } } });
  await db.$disconnect();
});

describe("team earnings", () => {
  it("splits a subject's month by the 40/40/20 rule and the team by weight", async () => {
    const month = await monthEarnings(PERIOD, { subjectIds: [maths], now: AFTER });
    const row = month!.subjects[0]!;
    expect(month!.ended).toBe(true);
    expect(row.split).toMatchObject({
      gross: 150_000,
      fees: 0,
      net: 150_000,
      team: 60_000,
      prizePool: 30_000,
    });
    expect(row.members.map((m) => [m.name, m.amount])).toEqual([
      ["Lead Teacher", 36_000],
      ["Assistant Teacher", 24_000],
    ]);
  });

  it("shows a live estimate during the month that grows with payments", async () => {
    const early = await monthEarnings(PERIOD, { subjectIds: [maths], now: inMonth(5) });
    const later = await monthEarnings(PERIOD, { subjectIds: [maths], now: inMonth(20) });
    expect(early!.ended).toBe(false);
    expect(early!.subjects[0]!.split.gross).toBeLessThan(later!.subjects[0]!.split.gross);
  });

  it("shows an author only their own subjects", async () => {
    const { month } = await authorEarnings(users[2]!, PERIOD, AFTER);
    expect(month!.subjects.map((s) => s.subject.id)).toEqual([physics]);
  });

  it("fixes payouts once the month has ended, once", async () => {
    expect(await createPayouts(PERIOD, inMonth(20))).toBe(0);
    expect(await createPayouts(PERIOD, AFTER)).toBe(3);
    expect(await createPayouts(PERIOD, AFTER)).toBe(0);
    const payouts = await db.teamPayout.findMany({
      where: { period: PERIOD, subjectId: maths },
      orderBy: { amount: "desc" },
    });
    expect(payouts.map((p) => [p.amount, p.status])).toEqual([
      [36_000, "PENDING"],
      [24_000, "PENDING"],
    ]);
    const { payouts: mine } = await authorEarnings(users[0]!, PERIOD, AFTER);
    expect(mine.map((p) => p.amount)).toEqual([36_000]);
  });
});
