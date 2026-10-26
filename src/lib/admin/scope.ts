import "server-only";
import { cache } from "react";
import type { CurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db";

/**
 * Which subjects' content (questions, notes, past papers) a staff member may
 * see and change. Admins: every subject. Authors: only the subjects whose team
 * they belong to. Opportunities posts and images are not tied to a subject.
 */
export type ContentScope = { all: true } | { all: false; subjectIds: string[] };

export const contentScope = cache(async (user: CurrentUser): Promise<ContentScope> => {
  if (user.role === "ADMIN") return { all: true };
  if (user.role !== "AUTHOR") return { all: false, subjectIds: [] };
  const teams = await db.subjectTeamMember.findMany({
    where: { userId: user.id },
    select: { subjectId: true },
  });
  return { all: false, subjectIds: teams.map((t) => t.subjectId) };
});

export function inScope(scope: ContentScope, subjectId: string | null | undefined): boolean {
  return scope.all || (subjectId != null && scope.subjectIds.includes(subjectId));
}

/** A Prisma filter on a subject id. */
export function subjectIdFilter(scope: ContentScope): { in: string[] } | undefined {
  return scope.all ? undefined : { in: scope.subjectIds };
}

/** The subject a topic belongs to, or null if the topic does not exist. */
export async function topicSubjectId(topicId: string): Promise<string | null> {
  const topic = await db.topic.findUnique({ where: { id: topicId }, select: { subjectId: true } });
  return topic?.subjectId ?? null;
}

export const NOT_YOUR_SUBJECT =
  "You can only work on the subjects you are assigned to. Ask the admin to add you to this subject's team.";
