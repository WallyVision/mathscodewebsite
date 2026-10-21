import { describe, expect, it } from "vitest";
import { formatDateTime, formatSeconds, fromDoualaInput, toDoualaInput } from "./format";

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

describe("Cameroon datetime inputs", () => {
  it("round-trips through the input format", () => {
    const date = new Date("2026-10-24T07:30:00Z");
    expect(toDoualaInput(date)).toBe("2026-10-24T08:30");
    expect(fromDoualaInput("2026-10-24T08:30")).toEqual(date);
  });

  it("rejects malformed values", () => {
    expect(fromDoualaInput("")).toBeNull();
    expect(fromDoualaInput("2026-13-40T99:99")).toBeNull();
    expect(fromDoualaInput("24/10/2026 08:30")).toBeNull();
  });
});
