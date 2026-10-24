import { describe, expect, it } from "vitest";
import {
  DEFAULT_PRIZE_POLICY,
  monthlyStandings,
  prizePool,
  splitPool,
  subjectPrizePool,
} from "./prizes";

describe("prizePool", () => {
  it("takes the configured share of revenue, rounded down", () => {
    // 500 O Level subscribers × 1,500 FCFA = 750,000 → 15% = 112,500
    expect(prizePool(750_000)).toBe(112_500);
  });

  it("never falls below the minimum", () => {
    expect(prizePool(20_000)).toBe(DEFAULT_PRIZE_POLICY.minimumPool);
  });
});

describe("splitPool", () => {
  it("splits by place and never exceeds the pool", () => {
    const parts = splitPool(112_500);
    expect(parts).toEqual([56_000, 33_500, 22_500]);
    expect(parts.reduce((a, b) => a + b, 0)).toBeLessThanOrEqual(112_500);
  });
});

describe("subjectPrizePool", () => {
  it("shares the level pool between subjects", () => {
    // 600 O Level subscribers × 1,500 = 900,000 → 15% = 135,000 → 2 subjects = 67,500
    expect(subjectPrizePool(900_000, 2)).toBe(67_500);
  });

  it("never falls below the minimum per subject", () => {
    expect(subjectPrizePool(50_000, 2)).toBe(10_000);
  });
});

describe("monthlyStandings", () => {
  const at = new Date("2026-11-10T10:00:00Z");
  const attempt = (userId: string, testId: string, score: number, timeTaken = 600) => ({
    userId,
    testId,
    score,
    timeTaken,
    submittedAt: at,
    focusLosses: 0,
  });

  it("ranks students who sat every test by total score, then time", () => {
    const standings = monthlyStandings(
      [
        attempt("amy", "t1", 8),
        attempt("amy", "t2", 7),
        attempt("ben", "t1", 9, 500),
        attempt("ben", "t2", 6, 500),
        attempt("cho", "t1", 10),
      ],
      ["t1", "t2"],
    );
    expect(standings.map((s) => [s.userId, s.totalScore, s.eligible, s.rank])).toEqual([
      ["ben", 15, true, 1],
      ["amy", 15, true, 2],
      ["cho", 10, false, null],
    ]);
  });

  it("ignores attempts at tests outside the month", () => {
    const standings = monthlyStandings(
      [attempt("amy", "old", 10), attempt("amy", "t1", 3)],
      ["t1"],
    );
    expect(standings[0]).toMatchObject({ totalScore: 3, testsTaken: 1, eligible: true });
  });
});
