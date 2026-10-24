/** Grace period for network latency when a submission arrives after the deadline. */
export const SUBMISSION_GRACE_SECONDS = 30;

export interface TestWindow {
  opensAt: Date;
  closesAt: Date;
  durationMinutes: number;
}

export type StartCheck = { ok: true } | { ok: false; reason: "NOT_OPEN" | "CLOSED" };

export function canStartAttempt(test: TestWindow, now: Date): StartCheck {
  if (now < test.opensAt) return { ok: false, reason: "NOT_OPEN" };
  if (now >= test.closesAt) return { ok: false, reason: "CLOSED" };
  return { ok: true };
}

/** A student gets the full duration, but never beyond the test's closing time. */
export function attemptDeadline(test: TestWindow, startedAt: Date): Date {
  const byDuration = startedAt.getTime() + test.durationMinutes * 60_000;
  return new Date(Math.min(byDuration, test.closesAt.getTime()));
}

export function acceptsAnswers(deadlineAt: Date, now: Date): boolean {
  return now.getTime() <= deadlineAt.getTime() + SUBMISSION_GRACE_SECONDS * 1000;
}
