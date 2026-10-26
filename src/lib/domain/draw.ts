/**
 * Picks a test's questions at random from the subject's test bank. Questions
 * never used in a test come first; only if there are not enough are earlier
 * test questions reused. `random` returns a number in [0, 1).
 */
export function drawQuestionIds(
  unused: readonly string[],
  used: readonly string[],
  count: number,
  random: () => number,
): string[] {
  const fresh = shuffle(unused, random).slice(0, count);
  if (fresh.length >= count) return fresh;
  return [...fresh, ...shuffle(used, random).slice(0, count - fresh.length)];
}

/** Fisher–Yates shuffle into a new array. */
function shuffle<T>(items: readonly T[], random: () => number): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

/** How a test bank compares with what a drawn test needs, for the admin form. */
export function bankAdvice(unused: number, drawCount: number): string | null {
  if (drawCount <= 0) return null;
  if (unused < drawCount) {
    return `Only ${unused} unused questions in the test bank: earlier test questions will be reused. Add more, or draw fewer.`;
  }
  if (unused < drawCount * 3) {
    return `The test bank has ${unused} unused questions. Aim for at least ${drawCount * 3} (three times the test) so the questions cannot be guessed.`;
  }
  return null;
}
