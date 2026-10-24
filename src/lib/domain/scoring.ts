export interface GradableQuestion {
  id: string;
  correctOptionId: string;
}

export interface GradeResult {
  score: number;
  maxScore: number;
  correctQuestionIds: string[];
}

/** One mark per correct answer; unanswered and wrong answers score zero. */
export function gradeMcq(
  questions: readonly GradableQuestion[],
  answers: ReadonlyMap<string, string | null>,
): GradeResult {
  const correctQuestionIds = questions
    .filter((q) => answers.get(q.id) === q.correctOptionId)
    .map((q) => q.id);
  return {
    score: correctQuestionIds.length,
    maxScore: questions.length,
    correctQuestionIds,
  };
}

export function percentage(score: number, maxScore: number): number {
  return maxScore === 0 ? 0 : Math.round((score / maxScore) * 1000) / 10;
}
