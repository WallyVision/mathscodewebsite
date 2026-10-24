import { describe, expect, it } from "vitest";
import { displayLabel, layoutPaper, leaderboardName, timeTakenSeconds } from "./paper";

const questions = Array.from({ length: 10 }, (_, i) => ({
  questionId: `q${i}`,
  position: i,
  options: ["A", "B", "C", "D"].map((label) => ({ id: `q${i}-${label}`, label })),
}));

describe("layoutPaper", () => {
  it("is stable for a seed regardless of input order", () => {
    const reversed = [...questions]
      .reverse()
      .map((q) => ({ ...q, options: [...q.options].reverse() }));
    expect(layoutPaper(reversed, 99)).toEqual(layoutPaper(questions, 99));
  });

  it("contains every question and every option exactly once", () => {
    const layout = layoutPaper(questions, 5);
    expect(layout.map((s) => s.questionId).sort()).toEqual(
      questions.map((q) => q.questionId).sort(),
    );
    for (const slot of layout) {
      expect([...slot.optionIds].sort()).toEqual(
        ["A", "B", "C", "D"].map((l) => `${slot.questionId}-${l}`),
      );
    }
  });

  it("differs between seeds", () => {
    expect(layoutPaper(questions, 1)).not.toEqual(layoutPaper(questions, 2));
  });
});

describe("displayLabel", () => {
  it("letters options", () => {
    expect([0, 1, 2, 3].map(displayLabel)).toEqual(["A", "B", "C", "D"]);
  });
});

describe("timeTakenSeconds", () => {
  const start = new Date("2026-10-24T10:00:00Z");
  const deadline = new Date("2026-10-24T10:45:00Z");

  it("measures to submission", () => {
    expect(timeTakenSeconds(start, new Date("2026-10-24T10:20:30Z"), deadline)).toBe(1230);
  });

  it("caps at the deadline", () => {
    expect(timeTakenSeconds(start, new Date("2026-10-24T10:45:20Z"), deadline)).toBe(2700);
  });
});

describe("leaderboardName", () => {
  it.each([
    ["Ngwa Brenda", "Ngwa B."],
    ["  Tabi  Emmanuel  Fon ", "Tabi F."],
    ["Mbah", "Mbah"],
    ["", "Student"],
  ])("%s → %s", (input, expected) => {
    expect(leaderboardName(input)).toBe(expected);
  });
});
