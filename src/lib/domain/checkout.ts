import type { Level, PaymentPurpose, PaymentStatus } from "@prisma/client";
import { LEVEL_LABEL, SUBSCRIPTION_PRICE, UNLOCK_PRICE } from "./pricing";

/** Something a student can buy. */
export type Product =
  | { kind: "SUBSCRIPTION"; level: Level }
  | { kind: "QUESTION_SOLUTION"; questionId: string }
  | { kind: "PAPER_SOLUTIONS"; pastPaperId: string };

export function productPurpose(product: Product): PaymentPurpose {
  return product.kind;
}

/** Price in XAF. Always computed on the server, never taken from the browser. */
export function productAmount(product: Product): number {
  switch (product.kind) {
    case "SUBSCRIPTION":
      return SUBSCRIPTION_PRICE[product.level];
    case "QUESTION_SOLUTION":
      return UNLOCK_PRICE.questionSolution;
    case "PAPER_SOLUTIONS":
      return UNLOCK_PRICE.paperSolutions;
  }
}

/** Stored on the payment so it can be fulfilled later. Subscriptions record the level for prize income. */
export function productMetadata(product: Product): Record<string, string> {
  switch (product.kind) {
    case "SUBSCRIPTION":
      return { level: product.level };
    case "QUESTION_SOLUTION":
      return { questionId: product.questionId };
    case "PAPER_SOLUTIONS":
      return { pastPaperId: product.pastPaperId };
  }
}

export function productFromPayment(purpose: PaymentPurpose, metadata: unknown): Product | null {
  const m = (metadata ?? {}) as Record<string, unknown>;
  if (purpose === "SUBSCRIPTION" && (m.level === "O_LEVEL" || m.level === "A_LEVEL")) {
    return { kind: "SUBSCRIPTION", level: m.level };
  }
  if (purpose === "QUESTION_SOLUTION" && typeof m.questionId === "string") {
    return { kind: "QUESTION_SOLUTION", questionId: m.questionId };
  }
  if (purpose === "PAPER_SOLUTIONS" && typeof m.pastPaperId === "string") {
    return { kind: "PAPER_SOLUTIONS", pastPaperId: m.pastPaperId };
  }
  return null;
}

/** Short text shown on the student's Mobile Money prompt. */
export function productDescription(product: Product, siteName: string): string {
  switch (product.kind) {
    case "SUBSCRIPTION":
      return `${siteName} ${LEVEL_LABEL[product.level]} 30 days`;
    case "QUESTION_SOLUTION":
      return `${siteName} solution unlock`;
    case "PAPER_SOLUTIONS":
      return `${siteName} paper solutions`;
  }
}

/** Maps a CamPay transaction status to ours. Unknown statuses stay pending. */
export function mapProviderStatus(status: string): PaymentStatus {
  switch (status.toUpperCase()) {
    case "SUCCESSFUL":
      return "SUCCESSFUL";
    case "FAILED":
      return "FAILED";
    default:
      return "PENDING";
  }
}

/** CamPay expects the number without "+", e.g. 237677123456. */
export function toProviderPhone(e164: string): string {
  return e164.replace(/^\+/, "");
}

/**
 * Whether a provider's report of a successful payment matches what we asked
 * for. A mismatch is never fulfilled.
 */
export function matchesExpected(
  expected: { amount: number; currency: string },
  reported: { amount: unknown; currency: string },
): boolean {
  const amount = typeof reported.amount === "string" ? Number(reported.amount) : reported.amount;
  return amount === expected.amount && reported.currency.toUpperCase() === expected.currency;
}

/**
 * A same-site path to return to after paying, or null. Rejects absolute URLs
 * and protocol-relative paths so the link cannot send students elsewhere.
 */
export function safeReturnPath(value: string): string | null {
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return null;
  if (value.length > 300 || /[\s<>"]/.test(value)) return null;
  return value;
}

/** Link to the checkout page for a product, optionally returning to a page afterwards. */
export function checkoutPath(product: Product, returnTo?: string): string {
  const params = new URLSearchParams();
  if (product.kind === "SUBSCRIPTION") params.set("plan", product.level);
  if (product.kind === "QUESTION_SOLUTION") params.set("question", product.questionId);
  if (product.kind === "PAPER_SOLUTIONS") params.set("paper", product.pastPaperId);
  const safe = returnTo ? safeReturnPath(returnTo) : null;
  if (safe) params.set("returnTo", safe);
  return `/checkout?${params}`;
}
