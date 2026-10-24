"use server";

import { z } from "zod";
import { requireUser } from "@/lib/auth/session";
import {
  recordFocusLoss,
  saveAnswer,
  startAttempt,
  submitAttempt,
  type SaveResult,
  type StartResult,
} from "@/lib/tests";

const id = z.string().min(1).max(64);
const answersSchema = z.record(id, id.nullable()).refine((a) => Object.keys(a).length <= 500);

/**
 * Starts (or resumes) the student's attempt and says where to go next. The
 * browser navigates itself, so the server does not render the paper inside
 * this request; that keeps starts cheap when a whole class begins together.
 */
export async function startTest(
  testId: string,
): Promise<{ next: string } | Exclude<StartResult, { ok: true }>> {
  const user = await requireUser();
  const result = await startAttempt(id.parse(testId), user);
  if (result.ok) return { next: `/tests/${testId}/take` };
  if (result.reason === "FINISHED") return { next: `/tests/${testId}/results` };
  return result;
}

export async function saveAnswerAction(
  testId: string,
  questionId: string,
  optionId: string | null,
): Promise<SaveResult> {
  const user = await requireUser();
  const parsed = z.tuple([id, id, id.nullable()]).safeParse([testId, questionId, optionId]);
  if (!parsed.success) return { ok: false, reason: "INVALID" };
  return saveAnswer(parsed.data[0], user.id, parsed.data[1], parsed.data[2]);
}

export async function reportFocusLoss(testId: string): Promise<void> {
  const user = await requireUser();
  await recordFocusLoss(id.parse(testId), user.id);
}

export async function submitTest(testId: string, answers: Record<string, string | null>) {
  const user = await requireUser();
  const parsed = answersSchema.safeParse(answers);
  await submitAttempt(id.parse(testId), user.id, parsed.success ? parsed.data : {});
  return { next: `/tests/${testId}/results` };
}
