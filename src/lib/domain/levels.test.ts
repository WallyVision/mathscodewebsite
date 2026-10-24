import { describe, expect, it } from "vitest";
import { levelFromSlug, levelSlug, paperSlug, parsePaperSlug } from "./levels";

describe("level slugs", () => {
  it("round-trips both levels", () => {
    expect(levelFromSlug(levelSlug("O_LEVEL"))).toBe("O_LEVEL");
    expect(levelFromSlug(levelSlug("A_LEVEL"))).toBe("A_LEVEL");
  });

  it("rejects unknown slugs", () => {
    expect(levelFromSlug("b-level")).toBeNull();
    expect(levelFromSlug("O_LEVEL")).toBeNull();
  });
});

describe("paper slugs", () => {
  it("round-trips", () => {
    expect(parsePaperSlug(paperSlug(2024, 1))).toEqual({ year: 2024, paperNumber: 1 });
  });

  it("rejects malformed slugs", () => {
    expect(parsePaperSlug("2024-paper-")).toBeNull();
    expect(parsePaperSlug("24-paper-1")).toBeNull();
    expect(parsePaperSlug("2024-paper-1-extra")).toBeNull();
  });
});
