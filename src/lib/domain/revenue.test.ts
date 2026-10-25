import { describe, expect, it } from "vitest";
import { splitSubjectIncome, splitTeamShare } from "./revenue";

describe("splitSubjectIncome", () => {
  it("takes payment fees off online income, then splits 40/40/20", () => {
    // 100 O Level members paying online.
    const split = splitSubjectIncome({ gross: 150_000, online: 150_000 });
    expect(split).toEqual({
      gross: 150_000,
      fees: 4500,
      net: 145_500,
      team: 58_200,
      prizeShare: 29_100,
      prizePool: 29_000,
      topUp: 0,
      platform: 58_300,
    });
    expect(split.team + split.prizePool + split.platform).toBe(split.net);
  });

  it("charges no fee on cash and manual payments", () => {
    expect(splitSubjectIncome({ gross: 100_000, online: 0 }).fees).toBe(0);
  });

  it("tops the prize pool up to the minimum from the platform's share", () => {
    const split = splitSubjectIncome({ gross: 30_000, online: 30_000 });
    expect(split.prizeShare).toBe(5820);
    expect(split.prizePool).toBe(10_000);
    expect(split.topUp).toBe(4180);
    expect(split.platform).toBe(split.net - split.team - 10_000);
  });

  it("guarantees no prize when nobody entered", () => {
    expect(splitSubjectIncome({ gross: 0, online: 0 })).toMatchObject({ prizePool: 0, topUp: 0 });
  });
});

describe("splitTeamShare", () => {
  it("shares equally by default and by weight when set", () => {
    const equal = [
      { userId: "a", weight: 1 },
      { userId: "b", weight: 1 },
    ];
    expect(splitTeamShare(58_200, equal)).toEqual([
      { userId: "a", amount: 29_100 },
      { userId: "b", amount: 29_100 },
    ]);
    expect(
      splitTeamShare(10_000, [
        { userId: "lead", weight: 3 },
        { userId: "assistant", weight: 2 },
      ]),
    ).toEqual([
      { userId: "lead", amount: 6000 },
      { userId: "assistant", amount: 4000 },
    ]);
  });

  it("never loses a franc to rounding", () => {
    const shares = splitTeamShare(100, [
      { userId: "a", weight: 1 },
      { userId: "b", weight: 1 },
      { userId: "c", weight: 1 },
    ]);
    expect(shares.reduce((s, x) => s + x.amount, 0)).toBe(100);
    expect(shares[0]!.amount).toBe(34);
  });

  it("handles a team with no members", () => {
    expect(splitTeamShare(5000, [])).toEqual([]);
  });
});
