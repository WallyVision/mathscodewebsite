"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { loadMonthlyPrizes } from "@/lib/admin/prizes";
import { ADMIN_ONLY, requireRole } from "@/lib/auth/session";
import { db } from "@/lib/db";

export type PrizeActionResult = { ok: true } | { ok: false; message: string };

const period = z.string().regex(/^\d{4}-\d{2}$/);
const id = z.string().min(1);

/** Creates prize awards for the top eligible students once the month is over. */
export async function createAwards(
  periodValue: string,
  subjectId: string,
): Promise<PrizeActionResult> {
  await requireRole(ADMIN_ONLY);
  const data = await loadMonthlyPrizes(period.parse(periodValue), id.parse(subjectId));
  if (!data) return { ok: false, message: "Unknown month or subject." };
  if (!data.monthEnded)
    return { ok: false, message: "Prizes can only be awarded after the month ends." };
  if (data.awards.length > 0)
    return { ok: false, message: "Prizes for this month were already created." };

  const winners = data.standings.filter((s) => s.eligible).slice(0, data.amounts.length);
  if (winners.length === 0) {
    return { ok: false, message: "No student sat enough tests this month to be eligible." };
  }

  await db.prizeAward.createMany({
    data: winners.map((w, i) => ({
      userId: w.userId,
      subjectId: data.subject.id,
      period: periodValue,
      category: "TOP_SCORER" as const,
      // Places are positions in the standings, so an exact tie still gets distinct places.
      rank: i + 1,
      amount: data.amounts[i] ?? 0,
    })),
  });
  revalidatePath("/admin/prizes");
  return { ok: true };
}

const TRANSITIONS = {
  PENDING_VERIFICATION: ["VERIFIED", "DISQUALIFIED"],
  VERIFIED: ["PAID", "DISQUALIFIED", "PENDING_VERIFICATION"],
  DISQUALIFIED: ["PENDING_VERIFICATION"],
  PAID: [],
} as const;

export async function setAwardStatus(
  awardId: string,
  status: "VERIFIED" | "PAID" | "DISQUALIFIED" | "PENDING_VERIFICATION",
  notes?: string,
): Promise<PrizeActionResult> {
  await requireRole(ADMIN_ONLY);
  const award = await db.prizeAward.findUnique({ where: { id: id.parse(awardId) } });
  if (!award) return { ok: false, message: "Award not found." };
  const allowed: readonly string[] = TRANSITIONS[award.status];
  if (!allowed.includes(status)) {
    return {
      ok: false,
      message: `Cannot change a ${award.status.toLowerCase()} award to ${status.toLowerCase()}.`,
    };
  }
  await db.prizeAward.update({
    where: { id: award.id },
    data: {
      status,
      paidAt: status === "PAID" ? new Date() : null,
      ...(notes ? { notes: notes.slice(0, 500) } : {}),
    },
  });
  revalidatePath("/admin/prizes");
  return { ok: true };
}

/** Removes the month's awards so they can be recreated, unless any were paid. */
export async function discardAwards(
  periodValue: string,
  subjectId: string,
): Promise<PrizeActionResult> {
  await requireRole(ADMIN_ONLY);
  const where = {
    period: period.parse(periodValue),
    subjectId: id.parse(subjectId),
    category: "TOP_SCORER" as const,
  };
  if (await db.prizeAward.count({ where: { ...where, status: "PAID" } })) {
    return {
      ok: false,
      message: "Some prizes are already paid, so this list cannot be discarded.",
    };
  }
  await db.prizeAward.deleteMany({ where });
  revalidatePath("/admin/prizes");
  return { ok: true };
}
