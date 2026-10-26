import "server-only";
import type { Prisma } from "@prisma/client";
import type { Product } from "@/lib/domain/checkout";
import { nextEntryPeriod, nextSubscriptionPeriod } from "@/lib/domain/subscription";

/**
 * Gives a student what a successful payment bought. Used for online payments
 * and for payments an admin records by hand, so both follow the same rules.
 * Runs inside the caller's transaction; returns the access period granted.
 */
export async function grantPurchase(
  tx: Prisma.TransactionClient,
  payment: { id: string; userId: string; amount: number },
  product: Product,
  now: Date,
): Promise<{ startsAt: Date; endsAt: Date } | null> {
  const { userId } = payment;

  if (product.kind === "SUBSCRIPTION") {
    const existing = await tx.subscription.findMany({
      where: { userId },
      select: { level: true, startsAt: true, endsAt: true },
    });
    const period = nextSubscriptionPeriod(existing, product.level, now);
    await tx.subscription.create({
      data: { userId, level: product.level, ...period, paymentId: payment.id },
    });
    // The included competition subject runs alongside the membership, and the whole fee
    // counts as that subject's income.
    if (product.subjectId) {
      await tx.competitionEntry.create({
        data: {
          userId,
          subjectId: product.subjectId,
          ...period,
          source: "MEMBERSHIP",
          income: payment.amount,
          paymentId: payment.id,
        },
      });
    }
    return period;
  }

  if (product.kind === "COMPETITION_ENTRY") {
    const existing = await tx.competitionEntry.findMany({
      where: { userId, subjectId: product.subjectId },
      select: { subjectId: true, startsAt: true, endsAt: true },
    });
    const period = nextEntryPeriod(existing, product.subjectId, now);
    await tx.competitionEntry.create({
      data: {
        userId,
        subjectId: product.subjectId,
        ...period,
        source: "EXTRA",
        income: payment.amount,
        paymentId: payment.id,
      },
    });
    return period;
  }

  if (product.kind === "QUESTION_SOLUTION") {
    await tx.solutionUnlock.upsert({
      where: { userId_questionId: { userId, questionId: product.questionId } },
      create: { userId, questionId: product.questionId, paymentId: payment.id },
      update: {},
    });
  } else {
    await tx.solutionUnlock.upsert({
      where: { userId_pastPaperId: { userId, pastPaperId: product.pastPaperId } },
      create: { userId, pastPaperId: product.pastPaperId, paymentId: payment.id },
      update: {},
    });
  }
  return null;
}
