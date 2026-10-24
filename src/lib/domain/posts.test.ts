import { describe, expect, it } from "vitest";
import {
  CATEGORIES,
  categoryBySlug,
  categoryInfo,
  daysLeft,
  deadlineState,
  whatsappShareUrl,
} from "./posts";

describe("categories", () => {
  it("has five categories with unique slugs that round-trip", () => {
    expect(CATEGORIES).toHaveLength(5);
    expect(new Set(CATEGORIES.map((c) => c.slug)).size).toBe(5);
    for (const c of CATEGORIES) {
      expect(categoryBySlug(c.slug)).toBe(c);
      expect(categoryInfo(c.category)).toBe(c);
    }
  });

  it("rejects unknown slugs", () => {
    expect(categoryBySlug("lottery")).toBeNull();
  });

  it("only scholarships and jobs have deadlines", () => {
    expect(CATEGORIES.filter((c) => c.hasDeadlines).map((c) => c.category)).toEqual([
      "SCHOLARSHIP",
      "JOB",
    ]);
  });
});

describe("deadlineState", () => {
  const now = new Date("2026-11-01T12:00:00Z");
  it.each([
    [null, "none"],
    ["2026-12-01T00:00:00Z", "open"],
    ["2026-11-05T00:00:00Z", "closing-soon"],
    ["2026-11-01T12:00:00Z", "closing-soon"],
    ["2026-10-31T00:00:00Z", "closed"],
  ])("%s → %s", (deadline, expected) => {
    expect(deadlineState(deadline ? new Date(deadline) : null, now)).toBe(expected);
  });
});

describe("daysLeft", () => {
  const now = new Date("2026-11-01T12:00:00Z");
  it("rounds up and never goes negative", () => {
    expect(daysLeft(new Date("2026-11-02T00:00:00Z"), now)).toBe(1);
    expect(daysLeft(new Date("2026-11-08T12:00:00Z"), now)).toBe(7);
    expect(daysLeft(new Date("2026-10-01T00:00:00Z"), now)).toBe(0);
  });
});

describe("whatsappShareUrl", () => {
  it("encodes the title and link", () => {
    expect(whatsappShareUrl("MTN Scholarship", "https://studentlife237.com/x")).toBe(
      "https://wa.me/?text=MTN%20Scholarship%0Ahttps%3A%2F%2Fstudentlife237.com%2Fx",
    );
  });
});
