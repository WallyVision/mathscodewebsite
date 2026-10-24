import type { Level } from "@prisma/client";
import { hasActiveSubscription, type SubscriptionPeriod } from "./subscription";

export interface ViewerAccess {
  role: "STUDENT" | "AUTHOR" | "ADMIN";
  subscriptions: readonly SubscriptionPeriod[];
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

/** Entering tests (and so competing for prizes) requires a subscription. */
export function canEnterTest(viewer: ViewerAccess, level: Level, now: Date): boolean {
  return viewer.role !== "STUDENT" || hasActiveSubscription(viewer.subscriptions, level, now);
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
