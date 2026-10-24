import { rankEntries } from "./ranking";

export interface PrizePolicy {
  /** Share of a month's subscription revenue paid out as prizes, 0–1. */
  poolShare: number;
  /** Pool is never below this, so early months still have a real prize. */
  minimumPool: number;
  /** Split of the pool between places; must sum to 1. */
  placeShares: readonly number[];
  /** Prizes are rounded down to this unit (XAF). */
  roundTo: number;
}

export const DEFAULT_PRIZE_POLICY: PrizePolicy = {
  poolShare: 0.15,
  minimumPool: 10_000,
  placeShares: [0.5, 0.3, 0.2],
  roundTo: 500,
};

export function prizePool(revenue: number, policy: PrizePolicy = DEFAULT_PRIZE_POLICY): number {
  const pool = Math.max(revenue * policy.poolShare, policy.minimumPool);
  return Math.floor(pool / policy.roundTo) * policy.roundTo;
}

/** Amount for each place, rounded down so the payout never exceeds the pool. */
export function splitPool(pool: number, policy: PrizePolicy = DEFAULT_PRIZE_POLICY): number[] {
  return policy.placeShares.map(
    (share) => Math.floor((pool * share) / policy.roundTo) * policy.roundTo,
  );
}

/**
 * Prize pool for one subject: the level's pool shared equally between its
 * subjects, never below the policy minimum.
 */
export function subjectPrizePool(
  levelRevenue: number,
  subjectsAtLevel: number,
  policy: PrizePolicy = DEFAULT_PRIZE_POLICY,
): number {
  const share = (levelRevenue * policy.poolShare) / Math.max(1, subjectsAtLevel);
  const pool = Math.max(share, policy.minimumPool);
  return Math.floor(pool / policy.roundTo) * policy.roundTo;
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
  totalScore: number;
  totalTime: number;
  testsTaken: number;
  focusLosses: number;
  eligible: boolean;
  /** Rank among eligible students; null when not eligible. */
  rank: number | null;
}

/**
 * Monthly standings for one subject. Only students who sat every test of the
 * month are eligible; they are ranked by total score, then total time.
 */
export function monthlyStandings(
  attempts: readonly MonthlyAttempt[],
  testIds: readonly string[],
): MonthlyStanding[] {
  const tests = new Set(testIds);
  const byUser = new Map<string, MonthlyAttempt[]>();
  for (const a of attempts) {
    if (!tests.has(a.testId)) continue;
    byUser.set(a.userId, [...(byUser.get(a.userId) ?? []), a]);
  }

  const rows = [...byUser.entries()].map(([userId, list]) => ({
    userId,
    score: list.reduce((sum, a) => sum + a.score, 0),
    timeTaken: list.reduce((sum, a) => sum + a.timeTaken, 0),
    submittedAt: new Date(Math.max(...list.map((a) => a.submittedAt.getTime()))),
    testsTaken: new Set(list.map((a) => a.testId)).size,
    focusLosses: list.reduce((sum, a) => sum + a.focusLosses, 0),
  }));

  const eligible = rankEntries(rows.filter((r) => r.testsTaken === tests.size));
  const rankOf = new Map(eligible.map((r) => [r.userId, r.rank]));

  return [...eligible, ...rankEntries(rows.filter((r) => r.testsTaken < tests.size))].map((r) => ({
    userId: r.userId,
    totalScore: r.score,
    totalTime: r.timeTaken,
    testsTaken: r.testsTaken,
    focusLosses: r.focusLosses,
    eligible: rankOf.has(r.userId),
    rank: rankOf.get(r.userId) ?? null,
  }));
}
