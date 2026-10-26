import { rankEntries } from "./ranking";

export interface PrizePolicy {
  /** A subject's pool is never below this, so early months still have a real prize. */
  minimumPool: number;
  /** Split of the pool between places; must sum to 1. */
  placeShares: readonly number[];
  /** Prizes are rounded down to this unit (XAF). */
  roundTo: number;
  /**
   * A student's best this-many tests of the month count, so joining mid-month or
   * missing a week does not rule anyone out. Fewer tests that month: all count.
   */
  bestTests: number;
}

export const DEFAULT_PRIZE_POLICY: PrizePolicy = {
  minimumPool: 10_000,
  placeShares: [0.5, 0.3, 0.2],
  roundTo: 500,
  bestTests: 2,
};

/** Amount for each place, rounded down so the payout never exceeds the pool. */
export function splitPool(pool: number, policy: PrizePolicy = DEFAULT_PRIZE_POLICY): number[] {
  return policy.placeShares.map(
    (share) => Math.floor((pool * share) / policy.roundTo) * policy.roundTo,
  );
}

export interface MonthlyAttempt {
  userId: string;
  testId: string;
  score: number;
  timeTaken: number;
  submittedAt: Date;
  focusLosses: number;
}

export interface MonthlyStanding {
  userId: string;
  /** Sum of the counted (best) tests. */
  totalScore: number;
  totalTime: number;
  testsTaken: number;
  /** How many tests count: the policy's best N, or every test if the month had fewer. */
  testsCounted: number;
  focusLosses: number;
  eligible: boolean;
  /** Rank among eligible students; null when not eligible. */
  rank: number | null;
}

/**
 * Monthly standings for one subject. Each student's best tests count (by
 * score, then the faster time): the policy's `bestTests`, or every test if
 * the month had fewer. Students who sat at least that many are eligible and
 * are ranked by the total of those tests, then total time on them.
 */
export function monthlyStandings(
  attempts: readonly MonthlyAttempt[],
  testIds: readonly string[],
  policy: Pick<PrizePolicy, "bestTests"> = DEFAULT_PRIZE_POLICY,
): MonthlyStanding[] {
  const tests = new Set(testIds);
  const counted = Math.min(policy.bestTests, tests.size);
  const byUser = new Map<string, MonthlyAttempt[]>();
  for (const a of attempts) {
    if (!tests.has(a.testId)) continue;
    byUser.set(a.userId, [...(byUser.get(a.userId) ?? []), a]);
  }

  const rows = [...byUser.entries()].map(([userId, list]) => {
    const best = [...list]
      .sort((a, b) => b.score - a.score || a.timeTaken - b.timeTaken)
      .slice(0, counted);
    return {
      userId,
      score: best.reduce((sum, a) => sum + a.score, 0),
      timeTaken: best.reduce((sum, a) => sum + a.timeTaken, 0),
      submittedAt: new Date(Math.max(...best.map((a) => a.submittedAt.getTime()))),
      testsTaken: new Set(list.map((a) => a.testId)).size,
      focusLosses: list.reduce((sum, a) => sum + a.focusLosses, 0),
    };
  });

  const qualifies = (r: { testsTaken: number }) => counted > 0 && r.testsTaken >= counted;
  const eligible = rankEntries(rows.filter(qualifies));
  const rankOf = new Map(eligible.map((r) => [r.userId, r.rank]));

  return [...eligible, ...rankEntries(rows.filter((r) => !qualifies(r)))].map((r) => ({
    userId: r.userId,
    totalScore: r.score,
    totalTime: r.timeTaken,
    testsTaken: r.testsTaken,
    testsCounted: counted,
    focusLosses: r.focusLosses,
    eligible: rankOf.has(r.userId),
    rank: rankOf.get(r.userId) ?? null,
  }));
}
