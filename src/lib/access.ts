import "server-only";
import { cache } from "react";
import type { CurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import type { ViewerAccess } from "@/lib/domain/entitlements";

/** Loads what a user has paid for. Cached per request. */
export const loadViewerAccess = cache(async (user: CurrentUser): Promise<ViewerAccess> => {
  const now = new Date();
  const [subscriptions, entries, unlocks] = await Promise.all([
    db.subscription.findMany({
      where: { userId: user.id, endsAt: { gt: now } },
      select: { level: true, startsAt: true, endsAt: true },
    }),
    db.competitionEntry.findMany({
      where: { userId: user.id, endsAt: { gt: now } },
      select: { subjectId: true, startsAt: true, endsAt: true },
    }),
    db.solutionUnlock.findMany({
      where: { userId: user.id },
      select: { questionId: true, pastPaperId: true },
    }),
  ]);
  return {
    role: user.role,
    subscriptions,
    entries,
    unlockedQuestionIds: new Set(unlocks.flatMap((u) => (u.questionId ? [u.questionId] : []))),
    unlockedPaperIds: new Set(unlocks.flatMap((u) => (u.pastPaperId ? [u.pastPaperId] : []))),
  };
});
