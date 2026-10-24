import type { Level } from "@prisma/client";
import { SUBSCRIPTION_DAYS } from "./pricing";

const DAY_MS = 24 * 60 * 60 * 1000;

export interface SubscriptionPeriod {
  level: Level;
  startsAt: Date;
  endsAt: Date;
}

export function isActive(sub: SubscriptionPeriod, now: Date): boolean {
  return sub.startsAt <= now && now < sub.endsAt;
}

export function hasActiveSubscription(
  subs: readonly SubscriptionPeriod[],
  level: Level,
  now: Date,
): boolean {
  return subs.some((s) => s.level === level && isActive(s, now));
}

/**
 * Period for a newly paid subscription. Paying early extends the current
 * period instead of overlapping it, so students never lose paid days.
 */
export function nextSubscriptionPeriod(
  existing: readonly SubscriptionPeriod[],
  level: Level,
  now: Date,
): { startsAt: Date; endsAt: Date } {
  const latestEnd = existing
    .filter((s) => s.level === level && s.endsAt > now)
    .reduce<Date | null>((max, s) => (max === null || s.endsAt > max ? s.endsAt : max), null);
  const startsAt = latestEnd ?? now;
  return { startsAt, endsAt: new Date(startsAt.getTime() + SUBSCRIPTION_DAYS * DAY_MS) };
}
