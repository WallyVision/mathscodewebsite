import { deriveSeed, seededShuffle } from "./shuffle";

export interface PaperQuestionInput {
  questionId: string;
  position: number;
  options: { id: string; label: string }[];
}

export interface PaperSlot {
  questionId: string;
  /** Option ids in the order this student sees them; shown as A, B, C, D. */
  optionIds: string[];
}

const DISPLAY_LABELS = "ABCDEFGH";

/**
 * The order a student sees questions and options in, derived from their
 * attempt seed. Inputs are sorted first so the result does not depend on the
 * order rows came back from the database.
 */
export function layoutPaper(questions: readonly PaperQuestionInput[], seed: number): PaperSlot[] {
  const sorted = [...questions].sort((a, b) => a.position - b.position);
  return seededShuffle(sorted, seed).map((q) => {
    const options = [...q.options].sort((a, b) => a.label.localeCompare(b.label));
    return {
      questionId: q.questionId,
      optionIds: seededShuffle(options, deriveSeed(seed, q.questionId)).map((o) => o.id),
    };
  });
}

export function displayLabel(index: number): string {
  return DISPLAY_LABELS[index] ?? String(index + 1);
}

/** Seconds from start to submission, counting no time past the deadline. */
export function timeTakenSeconds(startedAt: Date, submittedAt: Date, deadlineAt: Date): number {
  const end = Math.min(submittedAt.getTime(), deadlineAt.getTime());
  return Math.max(0, Math.round((end - startedAt.getTime()) / 1000));
}

/** Public leaderboard name: first name and last initial, e.g. "Ngwa B.". */
export function leaderboardName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const first = parts[0] ?? "Student";
  const last = parts.length > 1 ? parts[parts.length - 1] : undefined;
  return last ? `${first} ${last.charAt(0).toUpperCase()}.` : first;
}
