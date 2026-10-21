export interface RankableEntry {
  userId: string;
  score: number;
  /** Seconds taken; faster wins a tie on score. */
  timeTaken: number;
  submittedAt: Date;
}

export type Ranked<T> = T & { rank: number };

function compare(a: RankableEntry, b: RankableEntry): number {
  return (
    b.score - a.score ||
    a.timeTaken - b.timeTaken ||
    a.submittedAt.getTime() - b.submittedAt.getTime()
  );
}

/**
 * Orders entries by score (desc), then time taken (asc), then submission
 * time (asc). Entries equal on all three share a rank ("1, 2, 2, 4").
 */
export function rankEntries<T extends RankableEntry>(entries: readonly T[]): Ranked<T>[] {
  const sorted = [...entries].sort(compare);
  const ranked: Ranked<T>[] = [];
  sorted.forEach((entry, i) => {
    const prev = ranked[i - 1];
    const rank = prev && compare(prev, entry) === 0 ? prev.rank : i + 1;
    ranked.push({ ...entry, rank });
  });
  return ranked;
}
