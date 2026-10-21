import { describe, expect, it } from "vitest";
import { deriveSeed, seededShuffle } from "./shuffle";

const items = Array.from({ length: 20 }, (_, i) => i);

describe("seededShuffle", () => {
  it("is deterministic for a seed", () => {
    expect(seededShuffle(items, 42)).toEqual(seededShuffle(items, 42));
  });

  it("is a permutation and does not mutate the input", () => {
    const copy = [...items];
    const out = seededShuffle(items, 7);
    expect(items).toEqual(copy);
    expect([...out].sort((a, b) => a - b)).toEqual(items);
  });

  it("gives different orders for different seeds", () => {
    expect(seededShuffle(items, 1)).not.toEqual(seededShuffle(items, 2));
  });
});

describe("deriveSeed", () => {
  it("varies by salt and is stable", () => {
    expect(deriveSeed(5, "a")).toBe(deriveSeed(5, "a"));
    expect(deriveSeed(5, "a")).not.toBe(deriveSeed(5, "b"));
  });
});
