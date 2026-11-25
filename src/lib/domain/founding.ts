/**
 * The founding-member offer: a limited number of students pay once before
 * launch and get a longer first membership, which starts the day an admin
 * opens founding memberships. Change the numbers here to change the offer.
 */
export const FOUNDING = {
  /** One-off price, in XAF. */
  price: 2000,
  /** How many founding places there are. */
  places: 100,
  /** Days of membership a founding member gets once memberships open. */
  days: 90,
} as const;

const DAY_MS = 24 * 60 * 60 * 1000;

export interface FoundingProgress {
  taken: number;
  left: number;
  /** 0 to 100, for the progress bar. */
  percent: number;
  full: boolean;
  /** XAF raised so far at the standard price. */
  raised: number;
  goal: number;
}

export function foundingProgress(taken: number): FoundingProgress {
  const counted = Math.max(0, Math.min(taken, FOUNDING.places));
  return {
    taken: counted,
    left: FOUNDING.places - counted,
    percent: Math.round((counted / FOUNDING.places) * 100),
    full: counted >= FOUNDING.places,
    raised: counted * FOUNDING.price,
    goal: FOUNDING.places * FOUNDING.price,
  };
}

/**
 * The membership period a founding member gets. It starts when founding
 * memberships open, or after a membership the student already has, so no
 * paid day is lost.
 */
export function foundingPeriod(
  existingEnds: readonly Date[],
  now: Date,
): { startsAt: Date; endsAt: Date } {
  const latest = existingEnds.reduce<Date | null>(
    (max, end) => (end > now && (max === null || end > max) ? end : max),
    null,
  );
  const startsAt = latest ?? now;
  return { startsAt, endsAt: new Date(startsAt.getTime() + FOUNDING.days * DAY_MS) };
}
