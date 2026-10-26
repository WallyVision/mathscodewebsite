import { describe, expect, it } from "vitest";
import { bankAdvice, drawQuestionIds } from "./draw";

// A repeatable "random" sequence for tests.
const seq = (...values: number[]) => {
  let i = 0;
  return () => values[i++ % values.length]!;
};

describe("drawQuestionIds", () => {
  it("draws the requested number of distinct unused questions", () => {
    const unused = ["a", "b", "c", "d", "e", "f"];
    const drawn = drawQuestionIds(unused, ["x"], 4, Math.random);
    expect(drawn).toHaveLength(4);
    expect(new Set(drawn).size).toBe(4);
    expect(drawn.every((id) => unused.includes(id))).toBe(true);
  });

  it("varies with the random source", () => {
    const unused = ["a", "b", "c", "d", "e"];
    expect(drawQuestionIds(unused, [], 3, seq(0))).not.toEqual(
      drawQuestionIds(unused, [], 3, seq(0.99)),
    );
  });

  it("tops up from used questions only when the unused ones run out", () => {
    const drawn = drawQuestionIds(["a", "b"], ["x", "y", "z"], 4, Math.random);
    expect(drawn.slice(0, 2).sort()).toEqual(["a", "b"]);
    expect(drawn.slice(2).every((id) => ["x", "y", "z"].includes(id))).toBe(true);
  });

  it("returns what exists when the whole bank is too small", () => {
    expect(drawQuestionIds(["a"], ["x"], 5, Math.random).sort()).toEqual(["a", "x"]);
  });
});

describe("bankAdvice", () => {
  it("warns when the bank is short or thin, and is quiet when it is healthy", () => {
    expect(bankAdvice(5, 10)).toMatch(/Only 5 unused/);
    expect(bankAdvice(20, 10)).toMatch(/at least 30/);
    expect(bankAdvice(30, 10)).toBeNull();
    expect(bankAdvice(0, 0)).toBeNull();
  });
});
