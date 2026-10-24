import type { Level } from "@prisma/client";

const SLUG_BY_LEVEL: Record<Level, string> = {
  O_LEVEL: "o-level",
  A_LEVEL: "a-level",
};

/** URL segment for a level, e.g. O_LEVEL → "o-level". */
export function levelSlug(level: Level): string {
  return SLUG_BY_LEVEL[level];
}

export function levelFromSlug(slug: string): Level | null {
  const match = Object.entries(SLUG_BY_LEVEL).find(([, s]) => s === slug);
  return match ? (match[0] as Level) : null;
}

/** URL segment for a past paper, e.g. 2024 paper 1 → "2024-paper-1". */
export function paperSlug(year: number, paperNumber: number): string {
  return `${year}-paper-${paperNumber}`;
}

export function parsePaperSlug(slug: string): { year: number; paperNumber: number } | null {
  const match = /^(\d{4})-paper-(\d{1,2})$/.exec(slug);
  if (!match) return null;
  return { year: Number(match[1]), paperNumber: Number(match[2]) };
}
