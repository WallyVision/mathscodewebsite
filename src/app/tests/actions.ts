"use server";

import { redirect } from "next/navigation";
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

export async function startTest(testId: string): Promise<Exclude<StartResult, { ok: true }>> {
  const user = await requireUser();
  const result = await startAttempt(id.parse(testId), user);
  if (result.ok) redirect(`/tests/${testId}/take`);
  if (result.reason === "FINISHED") redirect(`/tests/${testId}/results`);
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
  redirect(`/tests/${testId}/results`);
}
