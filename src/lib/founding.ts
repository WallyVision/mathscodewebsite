import "server-only";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { FOUNDING, foundingPeriod } from "@/lib/domain/founding";

type Tx = Prisma.TransactionClient;

export type RecordFoundingResult =
  | { ok: true; number: number; activated: boolean }
  | { ok: false; reason: "ALREADY" | "FULL" | "NO_STUDENT" | "NO_SUBJECT" };

/** Founding memberships are open once any founding member's membership has started. */
export async function foundingOpened(client: Tx | typeof db = db): Promise<boolean> {
  return (await client.foundingMember.count({ where: { activatedAt: { not: null } } })) > 0;
}

/** Starts one founding member's membership, with its competition subject. */
async function activate(
  tx: Tx,
  member: { id: string; userId: string; subjectId: string; paymentId: string },
  now: Date,
) {
  const [subject, payment] = await Promise.all([
    tx.subject.findUniqueOrThrow({ where: { id: member.subjectId }, select: { level: true } }),
    tx.payment.findUniqueOrThrow({ where: { id: member.paymentId }, select: { amount: true } }),
  ]);
  const existing = await tx.subscription.findMany({
    where: { userId: member.userId, level: subject.level },
    select: { endsAt: true },
  });
  const period = foundingPeriod(
    existing.map((s) => s.endsAt),
    now,
  );
  await tx.subscription.create({
    data: { userId: member.userId, level: subject.level, ...period, paymentId: member.paymentId },
  });
  await tx.competitionEntry.create({
    data: {
      userId: member.userId,
      subjectId: member.subjectId,
      ...period,
      source: "MEMBERSHIP",
      income: payment.amount,
      paymentId: member.paymentId,
    },
  });
  await tx.foundingMember.update({ where: { id: member.id }, data: { activatedAt: now } });
}

/**
 * Records a founding-member payment taken by hand and gives the student the
 * next founding number. Before founding memberships open, nothing else
 * changes; after, the membership starts at once.
 */
export async function recordFoundingMember(input: {
  userId: string;
  subjectId: string;
  amount: number;
  reference: string;
  recordedBy: string;
  now: Date;
}): Promise<RecordFoundingResult> {
  const { userId, subjectId, amount, reference, recordedBy, now } = input;
  return db.$transaction(async (tx) => {
    // One at a time, so two admins cannot hand out the same number or the 101st place.
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext('founding-members'))`;
    const [user, subject, already, taken, last] = await Promise.all([
      tx.user.findUnique({ where: { id: userId }, select: { id: true } }),
      tx.subject.findUnique({ where: { id: subjectId }, select: { level: true } }),
      tx.foundingMember.findUnique({ where: { userId }, select: { id: true } }),
      tx.foundingMember.count(),
      tx.foundingMember.findFirst({ orderBy: { number: "desc" }, select: { number: true } }),
    ]);
    if (!user) return { ok: false, reason: "NO_STUDENT" } as const;
    if (!subject) return { ok: false, reason: "NO_SUBJECT" } as const;
    if (already) return { ok: false, reason: "ALREADY" } as const;
    if (taken >= FOUNDING.places) return { ok: false, reason: "FULL" } as const;

    const payment = await tx.payment.create({
      data: {
        userId,
        purpose: "SUBSCRIPTION",
        amount,
        provider: "manual",
        status: "SUCCESSFUL",
        completedAt: now,
        metadata: { level: subject.level, subjectId, founding: true, reference, recordedBy },
      },
    });
    const member = await tx.foundingMember.create({
      data: { userId, subjectId, paymentId: payment.id, number: (last?.number ?? 0) + 1 },
    });
    const opened = await foundingOpened(tx);
    if (opened) await activate(tx, member, now);
    return { ok: true, number: member.number, activated: opened } as const;
  });
}

/**
 * Opens founding memberships: every founding member's membership starts now.
 * Safe to run again; members already started are left alone. Returns how many started.
 */
export async function openFoundingMemberships(now: Date): Promise<number> {
  return db.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext('founding-members'))`;
    const waiting = await tx.foundingMember.findMany({
      where: { activatedAt: null },
      orderBy: { number: "asc" },
      select: { id: true, userId: true, subjectId: true, paymentId: true },
    });
    for (const member of waiting) await activate(tx, member, now);
    return waiting.length;
  });
}
