import { describe, expect, it } from "vitest";
import {
  checkoutPath,
  mapProviderStatus,
  matchesExpected,
  productAmount,
  productDescription,
  productFromPayment,
  productMetadata,
  productPurpose,
  safeReturnPath,
  toProviderPhone,
  type Product,
} from "./checkout";

const products: Product[] = [
  { kind: "SUBSCRIPTION", level: "O_LEVEL" },
  { kind: "SUBSCRIPTION", level: "A_LEVEL" },
  { kind: "QUESTION_SOLUTION", questionId: "q1" },
  { kind: "PAPER_SOLUTIONS", pastPaperId: "p1" },
];

describe("products", () => {
  it("are priced by the server", () => {
    expect(products.map(productAmount)).toEqual([1500, 2000, 100, 500]);
  });

  it("round-trip through payment metadata", () => {
    for (const product of products) {
      expect(productFromPayment(productPurpose(product), productMetadata(product))).toEqual(
        product,
      );
    }
  });

  it("rejects metadata that does not match the purpose", () => {
    expect(productFromPayment("SUBSCRIPTION", { level: "B_LEVEL" })).toBeNull();
    expect(productFromPayment("QUESTION_SOLUTION", { pastPaperId: "p1" })).toBeNull();
    expect(productFromPayment("PAPER_SOLUTIONS", null)).toBeNull();
  });

  it("describes the purchase for the payment prompt", () => {
    expect(productDescription(products[0]!, "GCEPrep237")).toBe("GCEPrep237 O Level 30 days");
  });
});

describe("mapProviderStatus", () => {
  it.each([
    ["SUCCESSFUL", "SUCCESSFUL"],
    ["FAILED", "FAILED"],
    ["PENDING", "PENDING"],
    ["successful", "SUCCESSFUL"],
    ["SOMETHING_NEW", "PENDING"],
  ])("%s → %s", (input, expected) => {
    expect(mapProviderStatus(input)).toBe(expected);
  });
});

describe("toProviderPhone", () => {
  it("drops the plus sign", () => {
    expect(toProviderPhone("+237677123456")).toBe("237677123456");
  });
});

describe("matchesExpected", () => {
  const expected = { amount: 1500, currency: "XAF" };
  it("accepts the same amount as a number or string", () => {
    expect(matchesExpected(expected, { amount: 1500, currency: "XAF" })).toBe(true);
    expect(matchesExpected(expected, { amount: "1500", currency: "xaf" })).toBe(true);
  });
  it("rejects a different amount or currency", () => {
    expect(matchesExpected(expected, { amount: 15, currency: "XAF" })).toBe(false);
    expect(matchesExpected(expected, { amount: 1500, currency: "EUR" })).toBe(false);
    expect(matchesExpected(expected, { amount: null, currency: "XAF" })).toBe(false);
  });
});

describe("safeReturnPath", () => {
  it.each([
    ["/learn/o-level/mathematics/algebra#q-1", "/learn/o-level/mathematics/algebra#q-1"],
    ["/tests", "/tests"],
    ["https://evil.example", null],
    ["//evil.example", null],
    ["/\\evil.example", null],
    ["javascript:alert(1)", null],
    ["", null],
  ])("%s → %s", (input, expected) => {
    expect(safeReturnPath(input)).toBe(expected);
  });
});

describe("checkoutPath", () => {
  it("links to the product and keeps a safe return path", () => {
    expect(checkoutPath({ kind: "SUBSCRIPTION", level: "A_LEVEL" })).toBe("/checkout?plan=A_LEVEL");
    expect(checkoutPath({ kind: "QUESTION_SOLUTION", questionId: "q1" }, "/learn/x#q-q1")).toBe(
      "/checkout?question=q1&returnTo=%2Flearn%2Fx%23q-q1",
    );
    expect(checkoutPath({ kind: "PAPER_SOLUTIONS", pastPaperId: "p1" }, "https://evil")).toBe(
      "/checkout?paper=p1",
    );
  });
});
