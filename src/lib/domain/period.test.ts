import { describe, expect, it } from "vitest";
import { parsePeriod, periodOf, previousPeriod } from "./period";

describe("parsePeriod", () => {
  it("covers the month in Cameroon time", () => {
    expect(parsePeriod("2026-11")).toEqual({
      start: new Date("2026-10-31T23:00:00Z"),
      end: new Date("2026-11-30T23:00:00Z"),
    });
  });

  it("rolls over the year", () => {
    expect(parsePeriod("2026-12")?.end).toEqual(new Date("2026-12-31T23:00:00Z"));
  });

  it("rejects bad periods", () => {
    expect(parsePeriod("2026-13")).toBeNull();
    expect(parsePeriod("2026-1")).toBeNull();
  });
});

describe("periodOf", () => {
  it("uses Cameroon time at month boundaries", () => {
    // 23:30 UTC on 31 Oct is 00:30 on 1 Nov in Douala.
    expect(periodOf(new Date("2026-10-31T23:30:00Z"))).toBe("2026-11");
    expect(periodOf(new Date("2026-10-31T22:30:00Z"))).toBe("2026-10");
  });
});

describe("previousPeriod", () => {
  it("steps back a month across years", () => {
    expect(previousPeriod("2026-01")).toBe("2025-12");
    expect(previousPeriod("2026-11")).toBe("2026-10");
  });
});
