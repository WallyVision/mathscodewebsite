/** Founding members, against a real database (DATABASE_URL). */
import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { db } from "@/lib/db";
import { FOUNDING } from "@/lib/domain/founding";
import { foundingOpened, openFoundingMemberships, recordFoundingMember } from "./founding";

const run = randomUUID().slice(0, 8);
const DAY = 24 * 60 * 60 * 1000;
let subjectId: string;
let adminId: string;
const students: string[] = [];
// Members other tests or a developer left behind are hidden for the run and put back after.
let parked: { id: string; number: number; activatedAt: Date | null }[] = [];

const student = async (n: number) =>
  (
    await db.user.create({
      data: {
        name: `Founder ${n}`,
        email: `f${n}-${run}@test.local`,
        passwordHash: "x",
        level: "O_LEVEL",
      },
      select: { id: true },
    })
  ).id;

const record = (userId: string, now = new Date()) =>
  recordFoundingMember({
    userId,
    subjectId,
    amount: FOUNDING.price,
    reference: "MoMo test",
    recordedBy: adminId,
    now,
  });

beforeAll(async () => {
  parked = await db.foundingMember.findMany({
    select: { id: true, number: true, activatedAt: true },
  });
  for (const [i, m] of parked.entries()) {
    await db.foundingMember.update({
      where: { id: m.id },
      data: { number: -1 - i - Math.floor(Math.random() * 1e6), activatedAt: null },
    });
  }
  subjectId = (
    await db.subject.create({ data: { level: "O_LEVEL", slug: `fnd-${run}`, name: "Founding" } })
  ).id;
  adminId = await student(0);
  for (let n = 1; n <= 3; n++) students.push(await student(n));
});

afterAll(async () => {
  const ids = [adminId, ...students];
  await db.foundingMember.deleteMany({ where: { userId: { in: ids } } });
  await db.competitionEntry.deleteMany({ where: { userId: { in: ids } } });
  await db.subscription.deleteMany({ where: { userId: { in: ids } } });
  await db.payment.deleteMany({ where: { userId: { in: ids } } });
  await db.user.deleteMany({ where: { id: { in: ids } } });
  await db.subject.delete({ where: { id: subjectId } });
  for (const m of parked) {
    await db.foundingMember.update({
      where: { id: m.id },
      data: { number: m.number, activatedAt: m.activatedAt },
    });
  }
});

describe("founding members", () => {
  it("records a payment and a number, without starting the membership", async () => {
    const before =
      (await db.foundingMember.findFirst({ orderBy: { number: "desc" } }))?.number ?? 0;
    const first = await record(students[0]!);
    const second = await record(students[1]!);
    expect(first).toEqual({ ok: true, number: Math.max(before, 0) + 1, activated: false });
    expect(second).toMatchObject({ ok: true, number: Math.max(before, 0) + 2 });
    expect(await db.subscription.count({ where: { userId: students[0]! } })).toBe(0);
    const payment = await db.payment.findFirstOrThrow({ where: { userId: students[0]! } });
    expect(payment).toMatchObject({
      amount: FOUNDING.price,
      status: "SUCCESSFUL",
      provider: "manual",
    });
    expect(payment.metadata).toMatchObject({ founding: true, subjectId });
  });

  it("refuses the same student twice", async () => {
    expect(await record(students[0]!)).toEqual({ ok: false, reason: "ALREADY" });
    expect(await db.payment.count({ where: { userId: students[0]! } })).toBe(1);
  });

  it("opening starts every waiting membership, once", async () => {
    const now = new Date();
    expect(await foundingOpened()).toBe(false);
    expect(await openFoundingMemberships(now)).toBe(2);
    expect(await openFoundingMemberships(now)).toBe(0);
    expect(await foundingOpened()).toBe(true);
    const sub = await db.subscription.findFirstOrThrow({ where: { userId: students[0]! } });
    expect(sub.level).toBe("O_LEVEL");
    expect(sub.endsAt.getTime() - sub.startsAt.getTime()).toBe(FOUNDING.days * DAY);
    const entry = await db.competitionEntry.findFirstOrThrow({ where: { userId: students[0]! } });
    expect(entry).toMatchObject({ subjectId, source: "MEMBERSHIP", income: FOUNDING.price });
    expect(entry.endsAt).toEqual(sub.endsAt);
  });

  it("a member recorded after opening starts at once", async () => {
    const result = await record(students[2]!);
    expect(result).toMatchObject({ ok: true, activated: true });
    expect(await db.subscription.count({ where: { userId: students[2]! } })).toBe(1);
  });
});
