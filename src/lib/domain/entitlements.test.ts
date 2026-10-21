import { describe, expect, it } from "vitest";
import { canEnterTest, canViewSolution, type ViewerAccess } from "./entitlements";

const now = new Date("2026-10-21");
const student = (overrides: Partial<ViewerAccess> = {}): ViewerAccess => ({
  role: "STUDENT",
  subscriptions: [],
  unlockedQuestionIds: new Set(),
  unlockedPaperIds: new Set(),
  ...overrides,
});
const target = { questionId: "q1", pastPaperId: "p1", level: "O_LEVEL" as const };

describe("canViewSolution", () => {
  it("denies a student with no subscription or unlock", () => {
    expect(canViewSolution(student(), target, now)).toBe(false);
  });

  it("allows a subscriber of the same level", () => {
    const viewer = student({
      subscriptions: [
        { level: "O_LEVEL", startsAt: new Date("2026-10-01"), endsAt: new Date("2026-10-31") },
      ],
    });
    expect(canViewSolution(viewer, target, now)).toBe(true);
  });

  it("denies a subscriber of the other level", () => {
    const viewer = student({
      subscriptions: [
        { level: "A_LEVEL", startsAt: new Date("2026-10-01"), endsAt: new Date("2026-10-31") },
      ],
    });
    expect(canViewSolution(viewer, target, now)).toBe(false);
  });

  it("allows a single unlocked question", () => {
    expect(canViewSolution(student({ unlockedQuestionIds: new Set(["q1"]) }), target, now)).toBe(
      true,
    );
  });

  it("allows a question whose whole paper was unlocked", () => {
    expect(canViewSolution(student({ unlockedPaperIds: new Set(["p1"]) }), target, now)).toBe(true);
  });

  it("does not treat a paper unlock as covering original questions", () => {
    const viewer = student({ unlockedPaperIds: new Set(["p1"]) });
    expect(canViewSolution(viewer, { ...target, pastPaperId: null }, now)).toBe(false);
  });

  it("always allows staff", () => {
    expect(canViewSolution(student({ role: "AUTHOR" }), target, now)).toBe(true);
  });
});

describe("canEnterTest", () => {
  it("requires a subscription for students", () => {
    expect(canEnterTest(student(), "A_LEVEL", now)).toBe(false);
  });
});
