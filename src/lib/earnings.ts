import "server-only";
import type { CurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { parsePeriod } from "@/lib/domain/period";
import { splitSubjectIncome, splitTeamShare, type SubjectSplit } from "@/lib/domain/revenue";
import { subjectEntrants, subjectIncome } from "@/lib/revenue";

export interface SubjectEarnings {
  subject: { id: string; name: string; level: "O_LEVEL" | "A_LEVEL" };
  entrants: number;
  split: SubjectSplit;
  members: { userId: string; name: string; phone: string | null; weight: number; amount: number }[];
}

/**
 * Each subject's income and its split for a month. For the current month the
 * figures grow with every payment and are an estimate until the month ends;
 * the team share uses the subject's current team.
 */
export async function monthEarnings(
  period: string,
  options: { subjectIds?: string[]; now?: Date } = {},
): Promise<{ period: string; ended: boolean; subjects: SubjectEarnings[] } | null> {
  const range = parsePeriod(period);
  if (!range) return null;
  const now = options.now ?? new Date();
  const until = now < range.end ? now : range.end;

  const subjects = await db.subject.findMany({
    where: options.subjectIds ? { id: { in: options.subjectIds } } : {},
    orderBy: [{ level: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      level: true,
      team: {
        orderBy: { createdAt: "asc" },
        select: { userId: true, weight: true, user: { select: { name: true, phone: true } } },
      },
    },
  });

  const rows = await Promise.all(
    subjects.map(async (subject) => {
      const [income, entrants] = await Promise.all([
        subjectIncome(subject.id, range.start, until),
        subjectEntrants(subject.id, range.start, until),
      ]);
      const split = splitSubjectIncome(income);
      const shares = splitTeamShare(split.team, subject.team);
      return {
        subject: { id: subject.id, name: subject.name, level: subject.level },
        entrants,
        split,
        members: subject.team.map((m, i) => ({
          userId: m.userId,
          name: m.user.name,
          phone: m.user.phone,
          weight: m.weight,
          amount: shares[i]?.amount ?? 0,
        })),
      };
    }),
  );
  return { period, ended: now >= range.end, subjects: rows };
}

/** An author's own earnings: their subjects this month and their payouts so far. */
export async function authorEarnings(user: CurrentUser, period: string, now = new Date()) {
  const teams = await db.subjectTeamMember.findMany({
    where: { userId: user.id },
    select: { subjectId: true },
  });
  const [month, payouts] = await Promise.all([
    monthEarnings(period, { subjectIds: teams.map((t) => t.subjectId), now }),
    db.teamPayout.findMany({
      where: { userId: user.id },
      orderBy: [{ period: "desc" }, { createdAt: "asc" }],
      take: 36,
      include: { subject: { select: { name: true, level: true } } },
    }),
  ]);
  return { month, payouts };
}

/**
 * Fixes each team member's earnings for a month that has ended. Safe to run
 * again: members already given a payout for that subject and month are kept.
 */
export async function createPayouts(period: string, now = new Date()): Promise<number> {
  const month = await monthEarnings(period, { now });
  if (!month || !month.ended) return 0;
  const data = month.subjects.flatMap((s) =>
    s.members
      .filter((m) => m.amount > 0)
      .map((m) => ({ period, subjectId: s.subject.id, userId: m.userId, amount: m.amount })),
  );
  if (data.length === 0) return 0;
  const result = await db.teamPayout.createMany({ data, skipDuplicates: true });
  return result.count;
}
