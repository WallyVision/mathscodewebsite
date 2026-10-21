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
