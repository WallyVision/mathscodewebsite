import { describe, expect, it } from "vitest";
import { gradeMcq, percentage } from "./scoring";

describe("gradeMcq", () => {
  const questions = [
    { id: "q1", correctOptionId: "a" },
    { id: "q2", correctOptionId: "b" },
    { id: "q3", correctOptionId: "c" },
  ];

  it("counts correct answers and ignores wrong or missing ones", () => {
    const answers = new Map<string, string | null>([
      ["q1", "a"],
      ["q2", "x"],
      ["q3", null],
    ]);
    expect(gradeMcq(questions, answers)).toEqual({
      score: 1,
      maxScore: 3,
      correctQuestionIds: ["q1"],
    });
  });

  it("ignores answers to questions not in the test", () => {
    expect(gradeMcq(questions, new Map([["other", "a"]])).score).toBe(0);
  });
});

describe("percentage", () => {
  it("rounds to one decimal and handles empty tests", () => {
    expect(percentage(2, 3)).toBe(66.7);
    expect(percentage(0, 0)).toBe(0);
  });
});
