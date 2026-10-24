import { describe, expect, it } from "vitest";
import { rankEntries } from "./ranking";

const at = new Date("2026-10-24T10:00:00Z");
const entry = (userId: string, score: number, timeTaken: number, submittedAt = at) => ({
  userId,
  score,
  timeTaken,
  submittedAt,
});

describe("rankEntries", () => {
  it("orders by score, then speed", () => {
    const ranked = rankEntries([
      entry("slow", 30, 900),
      entry("top", 35, 1200),
      entry("fast", 30, 600),
    ]);
    expect(ranked.map((r) => [r.userId, r.rank])).toEqual([
      ["top", 1],
      ["fast", 2],
      ["slow", 3],
    ]);
  });

  it("breaks remaining ties by earlier submission", () => {
    const ranked = rankEntries([
      entry("later", 30, 600, new Date("2026-10-24T11:00:00Z")),
      entry("earlier", 30, 600, new Date("2026-10-24T09:00:00Z")),
    ]);
    expect(ranked.map((r) => r.userId)).toEqual(["earlier", "later"]);
  });

  it("shares ranks on a complete tie and skips the next place", () => {
    const ranked = rankEntries([entry("a", 30, 600), entry("b", 30, 600), entry("c", 20, 600)]);
    expect(ranked.map((r) => r.rank)).toEqual([1, 1, 3]);
  });
});
