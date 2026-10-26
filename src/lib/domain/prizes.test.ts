import { describe, expect, it } from "vitest";
import { monthlyStandings, splitPool } from "./prizes";

describe("splitPool", () => {
  it("splits by place and never exceeds the pool", () => {
    const parts = splitPool(112_500);
    expect(parts).toEqual([56_000, 33_500, 22_500]);
    expect(parts.reduce((a, b) => a + b, 0)).toBeLessThanOrEqual(112_500);
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

  it("ranks by the total of each student's best 2 tests, then time", () => {
    const standings = monthlyStandings(
      [
        attempt("amy", "t1", 8),
        attempt("amy", "t2", 7),
        attempt("amy", "t3", 2),
        attempt("ben", "t2", 9, 500),
        attempt("ben", "t3", 6, 500),
        attempt("cho", "t1", 10),
      ],
      ["t1", "t2", "t3", "t4"],
    );
    expect(standings.map((s) => [s.userId, s.totalScore, s.eligible, s.rank])).toEqual([
      ["ben", 15, true, 1],
      ["amy", 15, true, 2],
      ["cho", 10, false, null],
    ]);
    expect(standings[1]).toMatchObject({ testsTaken: 3, testsCounted: 2 });
  });

  it("lets a student who joined mid-month win with two good tests", () => {
    const standings = monthlyStandings(
      [
        attempt("early", "t1", 6),
        attempt("early", "t2", 6),
        attempt("early", "t3", 6),
        attempt("early", "t4", 6),
        attempt("late", "t3", 9),
        attempt("late", "t4", 9),
      ],
      ["t1", "t2", "t3", "t4"],
    );
    expect(standings[0]).toMatchObject({ userId: "late", totalScore: 18, rank: 1 });
    expect(standings[1]).toMatchObject({ userId: "early", totalScore: 12, rank: 2 });
  });

  it("counts every test when the month had fewer than the best-of number", () => {
    const standings = monthlyStandings([attempt("amy", "t1", 7)], ["t1"]);
    expect(standings[0]).toMatchObject({ totalScore: 7, testsCounted: 1, eligible: true });
  });

  it("uses the faster attempt to break a tie between equal best scores", () => {
    const standings = monthlyStandings(
      [attempt("amy", "t1", 8, 900), attempt("amy", "t2", 8, 300), attempt("amy", "t3", 8, 600)],
      ["t1", "t2", "t3"],
    );
    expect(standings[0]).toMatchObject({ totalScore: 16, totalTime: 900 });
  });

  it("ignores attempts at tests outside the month", () => {
    const standings = monthlyStandings(
      [attempt("amy", "old", 10), attempt("amy", "t1", 3)],
      ["t1"],
    );
    expect(standings[0]).toMatchObject({ totalScore: 3, testsTaken: 1, eligible: true });
  });
});
