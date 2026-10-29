import "server-only";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { type ContentScope, subjectIdFilter } from "./scope";

/** Which draft questions a "Publish all" button covers: a past paper, or the questions list's filter. */
export interface DraftFilter {
  subjectId?: string;
  pastPaperId?: string;
  /** Text the stem contains, as in the questions list search. */
  q?: string;
}

export function draftWhere(scope: ContentScope, filter: DraftFilter): Prisma.QuestionWhereInput {
  return {
    status: "DRAFT",
    AND: [
      { subjectId: subjectIdFilter(scope) },
      filter.subjectId ? { subjectId: filter.subjectId } : {},
      filter.pastPaperId ? { pastPaperId: filter.pastPaperId } : {},
      filter.q ? { stem: { contains: filter.q, mode: "insensitive" } } : {},
    ],
  };
}

/** Publishes every draft question the filter covers, within the staff member's subjects. */
export async function publishDrafts(scope: ContentScope, filter: DraftFilter): Promise<number> {
  const { count } = await db.question.updateMany({
    where: draftWhere(scope, filter),
    data: { status: "PUBLISHED" },
  });
  return count;
}
