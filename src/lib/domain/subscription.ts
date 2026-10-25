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

export interface EntryPeriod {
  subjectId: string;
  startsAt: Date;
  endsAt: Date;
}

export function hasActiveEntry(
  entries: readonly EntryPeriod[],
  subjectId: string,
  now: Date,
): boolean {
  return entries.some((e) => e.subjectId === subjectId && e.startsAt <= now && now < e.endsAt);
}

/**
 * Period for an extra competition subject: 30 days, starting when the
 * student's current entry for that subject ends, so renewing early loses
 * nothing.
 */
export function nextEntryPeriod(
  existing: readonly EntryPeriod[],
  subjectId: string,
  now: Date,
): { startsAt: Date; endsAt: Date } {
  const latestEnd = existing
    .filter((e) => e.subjectId === subjectId && e.endsAt > now)
    .reduce<Date | null>((max, e) => (max === null || e.endsAt > max ? e.endsAt : max), null);
  const startsAt = latestEnd ?? now;
  return { startsAt, endsAt: new Date(startsAt.getTime() + SUBSCRIPTION_DAYS * DAY_MS) };
}
