import type { Level } from "@prisma/client";
import {
  hasActiveEntry,
  hasActiveSubscription,
  type EntryPeriod,
  type SubscriptionPeriod,
} from "./subscription";

export interface ViewerAccess {
  role: "STUDENT" | "AUTHOR" | "ADMIN";
  subscriptions: readonly SubscriptionPeriod[];
  /** Competition subjects the student has entered. */
  entries: readonly EntryPeriod[];
  unlockedQuestionIds: ReadonlySet<string>;
  unlockedPaperIds: ReadonlySet<string>;
}

export interface SolutionTarget {
  questionId: string;
  pastPaperId: string | null;
  level: Level;
}

/**
 * Worked solutions are paid content. A viewer may see one if they are staff,
 * subscribe to that level, or unlocked the question or its whole paper.
 */
export function canViewSolution(viewer: ViewerAccess, target: SolutionTarget, now: Date): boolean {
  if (viewer.role !== "STUDENT") return true;
  if (hasActiveSubscription(viewer.subscriptions, target.level, now)) return true;
  if (viewer.unlockedQuestionIds.has(target.questionId)) return true;
  return target.pastPaperId !== null && viewer.unlockedPaperIds.has(target.pastPaperId);
}

/**
 * Competitive tests are per subject: a student sits a subject's tests (and
 * competes for its prizes) only while entered in that subject.
 */
export function canEnterTest(viewer: ViewerAccess, subjectId: string, now: Date): boolean {
  return viewer.role !== "STUDENT" || hasActiveEntry(viewer.entries, subjectId, now);
}

/**
 * Opportunity and guide articles are a subscriber benefit: any active
 * subscription (O or A Level) opens them, as does staff access.
 */
export function canReadPosts(viewer: ViewerAccess | null, now: Date): boolean {
  if (!viewer) return false;
  if (viewer.role !== "STUDENT") return true;
  return viewer.subscriptions.some((s) => s.startsAt <= now && now < s.endsAt);
}
