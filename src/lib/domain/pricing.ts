import type { Level } from "@prisma/client";

/** All amounts are whole XAF (FCFA). */
export const SUBSCRIPTION_PRICE: Record<Level, number> = {
  O_LEVEL: 1500,
  A_LEVEL: 2000,
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
