/**
 * How a subject's income is shared. Every competition entry's fee is income
 * of its subject; after payment fees it is split between the platform, the
 * subject's team and the subject's prize pool. The prize pool never falls
 * below the minimum: the platform tops it up from its own share.
 */
import { DEFAULT_PRIZE_POLICY, type PrizePolicy } from "./prizes";

export interface RevenuePolicy {
  platformShare: number;
  teamShare: number;
  prizeShare: number;
  /**
   * Share of online (CamPay) payments kept by the payment service. An
   * estimate: set it to the rate in your CamPay contract. Cash and manual
   * payments have no fee.
   */
  paymentFeeRate: number;
}

export const DEFAULT_REVENUE_POLICY: RevenuePolicy = {
  platformShare: 0.4,
  teamShare: 0.4,
  prizeShare: 0.2,
  paymentFeeRate: 0.03,
};

export interface SubjectIncome {
  /** Everything students paid for entries in the subject this month. */
  gross: number;
  /** The part of `gross` paid online, which carries payment fees. */
  online: number;
}

export interface SubjectSplit {
  gross: number;
  fees: number;
  net: number;
  team: number;
  /** The prize share before the minimum is applied. */
  prizeShare: number;
  /** What the month's winners share: the prize share, at least the minimum. */
  prizePool: number;
  /** Paid from the platform's share when the prize share is below the minimum. */
  topUp: number;
  /** What the platform keeps after the team, the prizes and any top-up. */
  platform: number;
}

const floorTo = (amount: number, unit: number) => Math.floor(amount / unit) * unit;

export function splitSubjectIncome(
  income: SubjectIncome,
  policy: RevenuePolicy = DEFAULT_REVENUE_POLICY,
  prizes: PrizePolicy = DEFAULT_PRIZE_POLICY,
): SubjectSplit {
  const fees = Math.round(income.online * policy.paymentFeeRate);
  const net = Math.max(0, income.gross - fees);
  const team = Math.floor(net * policy.teamShare);
  const prizeShare = Math.floor(net * policy.prizeShare);
  // No entries, no competitors: no prize to guarantee.
  const prizePool =
    income.gross > 0 ? floorTo(Math.max(prizeShare, prizes.minimumPool), prizes.roundTo) : 0;
  const topUp = Math.max(0, prizePool - prizeShare);
  return {
    gross: income.gross,
    fees,
    net,
    team,
    prizeShare,
    prizePool,
    topUp,
    platform: net - team - prizePool,
  };
}

/**
 * Shares the team amount between members by weight (1 and 1 is half each,
 * 3 and 2 is 60% and 40%). Amounts are rounded down; any franc left over by
 * rounding goes to the first member, so the total is exact.
 */
export function splitTeamShare(
  team: number,
  members: readonly { userId: string; weight: number }[],
): { userId: string; amount: number }[] {
  const total = members.reduce((sum, m) => sum + Math.max(0, m.weight), 0);
  if (total === 0) return members.map((m) => ({ userId: m.userId, amount: 0 }));
  const amounts = members.map((m) => ({
    userId: m.userId,
    amount: Math.floor((team * Math.max(0, m.weight)) / total),
  }));
  const remainder = team - amounts.reduce((sum, a) => sum + a.amount, 0);
  if (amounts[0]) amounts[0].amount += remainder;
  return amounts;
}
