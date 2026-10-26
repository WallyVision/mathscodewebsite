import "server-only";
import { db } from "@/lib/db";
import type { SubjectIncome } from "@/lib/domain/revenue";

/**
 * A subject's income for a period: the fees of competition entries created
 * in it (an entry is created when its payment succeeds). `online` is the
 * part paid through CamPay, which carries payment fees.
 */
export async function subjectIncome(
  subjectId: string,
  start: Date,
  end: Date,
): Promise<SubjectIncome> {
  const entries = await db.competitionEntry.findMany({
    where: { subjectId, createdAt: { gte: start, lt: end } },
    select: { income: true, payment: { select: { provider: true } } },
  });
  let gross = 0;
  let online = 0;
  for (const entry of entries) {
    gross += entry.income;
    if (entry.payment?.provider === "campay") online += entry.income;
  }
  return { gross, online };
}

/** Number of students entered in a subject at some point in the period. */
export function subjectEntrants(subjectId: string, start: Date, end: Date): Promise<number> {
  return db.competitionEntry
    .groupBy({
      by: ["userId"],
      where: { subjectId, startsAt: { lt: end }, endsAt: { gt: start } },
    })
    .then((rows) => rows.length);
}
