import { describe, expect, it } from "vitest";
import {
  hasActiveEntry,
  hasActiveSubscription,
  nextEntryPeriod,
  nextSubscriptionPeriod,
} from "./subscription";

const d = (iso: string) => new Date(iso);

describe("hasActiveSubscription", () => {
  const subs = [{ level: "O_LEVEL" as const, startsAt: d("2026-10-01"), endsAt: d("2026-10-31") }];

  it("is true inside the period for the same level", () => {
    expect(hasActiveSubscription(subs, "O_LEVEL", d("2026-10-15"))).toBe(true);
  });

  it("is false for another level", () => {
    expect(hasActiveSubscription(subs, "A_LEVEL", d("2026-10-15"))).toBe(false);
  });

  it("treats endsAt as exclusive", () => {
    expect(hasActiveSubscription(subs, "O_LEVEL", d("2026-10-31"))).toBe(false);
  });
});

describe("nextSubscriptionPeriod", () => {
  it("starts now when there is no active subscription", () => {
    const now = d("2026-10-21T10:00:00Z");
    const p = nextSubscriptionPeriod([], "A_LEVEL", now);
    expect(p.startsAt).toEqual(now);
    expect(p.endsAt).toEqual(d("2026-11-20T10:00:00Z"));
  });

  it("extends from the end of the current period when renewing early", () => {
    const existing = [
      { level: "A_LEVEL" as const, startsAt: d("2026-10-01"), endsAt: d("2026-10-31") },
    ];
    const p = nextSubscriptionPeriod(existing, "A_LEVEL", d("2026-10-21"));
    expect(p.startsAt).toEqual(d("2026-10-31"));
    expect(p.endsAt).toEqual(d("2026-11-30"));
  });

  it("ignores subscriptions for the other level", () => {
    const existing = [
      { level: "O_LEVEL" as const, startsAt: d("2026-10-01"), endsAt: d("2026-10-31") },
    ];
    const now = d("2026-10-21");
    expect(nextSubscriptionPeriod(existing, "A_LEVEL", now).startsAt).toEqual(now);
  });
});

describe("nextEntryPeriod", () => {
  const maths = { subjectId: "maths", startsAt: d("2026-10-01"), endsAt: d("2026-10-31") };

  it("starts now for a new subject", () => {
    const now = d("2026-10-21");
    expect(nextEntryPeriod([maths], "physics", now)).toEqual({
      startsAt: now,
      endsAt: d("2026-11-20"),
    });
  });

  it("extends from the end of the current entry for the same subject", () => {
    expect(nextEntryPeriod([maths], "maths", d("2026-10-21"))).toEqual({
      startsAt: d("2026-10-31"),
      endsAt: d("2026-11-30"),
    });
  });

  it("reports whether a subject is entered right now", () => {
    expect(hasActiveEntry([maths], "maths", d("2026-10-21"))).toBe(true);
    expect(hasActiveEntry([maths], "maths", d("2026-11-01"))).toBe(false);
    expect(hasActiveEntry([maths], "physics", d("2026-10-21"))).toBe(false);
  });
});
