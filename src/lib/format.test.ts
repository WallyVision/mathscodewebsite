import { describe, expect, it } from "vitest";
import { formatDateTime, formatSeconds } from "./format";

describe("formatSeconds", () => {
  it.each([
    [0, "0:00"],
    [65, "1:05"],
    [2700, "45:00"],
    [3725, "1:02:05"],
    [-3, "0:00"],
  ])("%d → %s", (input, expected) => {
    expect(formatSeconds(input)).toBe(expected);
  });
});

describe("formatDateTime", () => {
  it("uses Cameroon time (UTC+1)", () => {
    expect(formatDateTime(new Date("2026-10-24T07:00:00Z"))).toContain("08:00");
  });
});
