import { describe, expect, it } from "vitest";
import { DEFAULT_PRIZE_POLICY, prizePool, splitPool } from "./prizes";

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
