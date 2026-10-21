import { describe, expect, it } from "vitest";
import { acceptsAnswers, attemptDeadline, canStartAttempt } from "./attempt";

const test = {
  opensAt: new Date("2026-10-24T08:00:00Z"),
  closesAt: new Date("2026-10-24T20:00:00Z"),
  durationMinutes: 45,
};

describe("canStartAttempt", () => {
  it("rejects before opening and at or after closing", () => {
    expect(canStartAttempt(test, new Date("2026-10-24T07:59:59Z"))).toEqual({
      ok: false,
      reason: "NOT_OPEN",
    });
    expect(canStartAttempt(test, test.closesAt)).toEqual({ ok: false, reason: "CLOSED" });
  });

  it("accepts within the window", () => {
    expect(canStartAttempt(test, new Date("2026-10-24T12:00:00Z"))).toEqual({ ok: true });
  });
});

describe("attemptDeadline", () => {
  it("gives the full duration when there is time", () => {
    expect(attemptDeadline(test, new Date("2026-10-24T10:00:00Z"))).toEqual(
      new Date("2026-10-24T10:45:00Z"),
    );
  });

  it("is capped at the closing time", () => {
    expect(attemptDeadline(test, new Date("2026-10-24T19:40:00Z"))).toEqual(test.closesAt);
  });
});

describe("acceptsAnswers", () => {
  const deadline = new Date("2026-10-24T10:45:00Z");
  it("allows a short grace period", () => {
    expect(acceptsAnswers(deadline, new Date("2026-10-24T10:45:29Z"))).toBe(true);
    expect(acceptsAnswers(deadline, new Date("2026-10-24T10:45:31Z"))).toBe(false);
  });
});
