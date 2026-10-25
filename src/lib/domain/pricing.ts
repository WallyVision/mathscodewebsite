import type { Level } from "@prisma/client";

/**
 * All amounts are whole XAF (FCFA).
 *
 * Membership (a "subscription") opens everything on the site and includes one
 * competition subject, chosen at checkout.
 */
export const SUBSCRIPTION_PRICE: Record<Level, number> = {
  O_LEVEL: 1500,
  A_LEVEL: 2000,
};

/** Each further competition subject a member enters, for 30 days. */
export const EXTRA_SUBJECT_PRICE: Record<Level, number> = {
  O_LEVEL: 1000,
  A_LEVEL: 1500,
};

/** A paid month of access. Counted in days so renewals are predictable. */
export const SUBSCRIPTION_DAYS = 30;

/** Pay-as-you-go prices for students without a subscription. */
export const UNLOCK_PRICE = {
  questionSolution: 100,
  paperSolutions: 500,
} as const;

export const LEVEL_LABEL: Record<Level, string> = {
  O_LEVEL: "O Level",
  A_LEVEL: "A Level",
};

export function formatXaf(amount: number): string {
  return `${new Intl.NumberFormat("en-CM").format(amount)} FCFA`;
}
