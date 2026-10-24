import { describe, expect, it } from "vitest";
import { isCameroonMobile, normalizeCameroonPhone } from "./phone";

describe("normalizeCameroonPhone", () => {
  it.each([
    ["677123456", "+237677123456"],
    ["6 77 12 34 56", "+237677123456"],
    ["+237 677-123-456", "+237677123456"],
    ["00237677123456", "+237677123456"],
    ["237677123456", "+237677123456"],
    ["222123456", "+237222123456"],
  ])("normalises %s", (input, expected) => {
    expect(normalizeCameroonPhone(input)).toBe(expected);
  });

  it.each(["", "67712345", "577123456", "+33612345678", "6771234567", "abc"])(
    "rejects %s",
    (input) => {
      expect(normalizeCameroonPhone(input)).toBeNull();
    },
  );
});

describe("isCameroonMobile", () => {
  it("accepts mobiles and rejects landlines", () => {
    expect(isCameroonMobile("+237677123456")).toBe(true);
    expect(isCameroonMobile("+237222123456")).toBe(false);
  });
});
