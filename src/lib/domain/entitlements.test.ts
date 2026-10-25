import { describe, expect, it } from "vitest";
import { canEnterTest, canReadPosts, canViewSolution, type ViewerAccess } from "./entitlements";

const now = new Date("2026-10-21");
const student = (overrides: Partial<ViewerAccess> = {}): ViewerAccess => ({
  role: "STUDENT",
  subscriptions: [],
  entries: [],
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
  const maths = {
    subjectId: "maths",
    startsAt: new Date("2026-10-01"),
    endsAt: new Date("2026-10-31"),
  };

  it("lets a student sit only the subjects they entered", () => {
    const viewer = student({ entries: [maths] });
    expect(canEnterTest(viewer, "maths", now)).toBe(true);
    expect(canEnterTest(viewer, "physics", now)).toBe(false);
  });

  it("refuses a membership without an entry for the subject", () => {
    const viewer = student({
      subscriptions: [
        { level: "O_LEVEL", startsAt: new Date("2026-10-01"), endsAt: new Date("2026-10-31") },
      ],
    });
    expect(canEnterTest(viewer, "maths", now)).toBe(false);
  });

  it("closes when the entry has ended", () => {
    const viewer = student({ entries: [{ ...maths, endsAt: new Date("2026-10-15") }] });
    expect(canEnterTest(viewer, "maths", now)).toBe(false);
  });

  it("always allows staff", () => {
    expect(canEnterTest(student({ role: "ADMIN" }), "maths", now)).toBe(true);
  });
});

describe("canReadPosts", () => {
  it("is closed to visitors and students without a subscription", () => {
    expect(canReadPosts(null, now)).toBe(false);
    expect(canReadPosts(student(), now)).toBe(false);
  });

  it("opens with a subscription at either level", () => {
    for (const level of ["O_LEVEL", "A_LEVEL"] as const) {
      const viewer = student({
        subscriptions: [
          { level, startsAt: new Date("2026-10-01"), endsAt: new Date("2026-10-31") },
        ],
      });
      expect(canReadPosts(viewer, now)).toBe(true);
    }
  });

  it("closes when the subscription has ended", () => {
    const viewer = student({
      subscriptions: [
        { level: "O_LEVEL", startsAt: new Date("2026-09-01"), endsAt: new Date("2026-10-01") },
      ],
    });
    expect(canReadPosts(viewer, now)).toBe(false);
  });

  it("is open to staff", () => {
    expect(canReadPosts(student({ role: "AUTHOR" }), now)).toBe(true);
  });
});
