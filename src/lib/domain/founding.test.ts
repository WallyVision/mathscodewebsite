import { describe, expect, it } from "vitest";
import { FOUNDING, foundingPeriod, foundingProgress } from "./founding";

const day = (n: number) => new Date(Date.UTC(2026, 11, 1 + n));

describe("foundingProgress", () => {
  it("starts empty", () => {
    expect(foundingProgress(0)).toMatchObject({ taken: 0, left: FOUNDING.places, percent: 0 });
    expect(foundingProgress(0).full).toBe(false);
  });

  it("counts places and money raised", () => {
    const p = foundingProgress(25);
    expect(p.left).toBe(FOUNDING.places - 25);
    expect(p.percent).toBe(Math.round((25 / FOUNDING.places) * 100));
    expect(p.raised).toBe(25 * FOUNDING.price);
    expect(p.goal).toBe(FOUNDING.places * FOUNDING.price);
  });

  it("is full at the last place and never goes past it", () => {
    expect(foundingProgress(FOUNDING.places)).toMatchObject({ left: 0, percent: 100, full: true });
    expect(foundingProgress(FOUNDING.places + 5)).toMatchObject({
      taken: FOUNDING.places,
      left: 0,
      percent: 100,
    });
  });
});

describe("foundingPeriod", () => {
  it("starts now for a student with no membership", () => {
    const { startsAt, endsAt } = foundingPeriod([], day(0));
    expect(startsAt).toEqual(day(0));
    expect(endsAt).toEqual(day(FOUNDING.days));
  });

  it("starts after a membership the student already has", () => {
    const { startsAt, endsAt } = foundingPeriod([day(10), day(4)], day(0));
    expect(startsAt).toEqual(day(10));
    expect(endsAt).toEqual(day(10 + FOUNDING.days));
  });

  it("ignores memberships that have ended", () => {
    expect(foundingPeriod([day(-3)], day(0)).startsAt).toEqual(day(0));
  });
});
