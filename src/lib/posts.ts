import "server-only";
import type { PostCategory, Prisma } from "@prisma/client";
import { db } from "@/lib/db";

export const postSummarySelect = {
  slug: true,
  title: true,
  summary: true,
  category: true,
  organisation: true,
  location: true,
  deadline: true,
} satisfies Prisma.PostSelect;

/** Posts students can see: published, and not scheduled for later. */
export function visiblePostWhere(now: Date): Prisma.PostWhereInput {
  return { status: "PUBLISHED", publishedAt: { lte: now } };
}

/**
 * A category's posts. With deadlines, open ones come first (soonest deadline
 * first) and closed ones are returned separately.
 */
export async function listCategoryPosts(category: PostCategory, hasDeadlines: boolean, now: Date) {
  const base = { ...visiblePostWhere(now), category };
  if (!hasDeadlines) {
    const posts = await db.post.findMany({
      where: base,
      orderBy: { publishedAt: "desc" },
      select: postSummarySelect,
    });
    return { open: posts, closed: [] };
  }
  const [open, closed] = await Promise.all([
    db.post.findMany({
      where: { ...base, OR: [{ deadline: null }, { deadline: { gte: now } }] },
      orderBy: [{ deadline: { sort: "asc", nulls: "last" } }, { publishedAt: "desc" }],
      select: postSummarySelect,
    }),
    db.post.findMany({
      where: { ...base, deadline: { lt: now } },
      orderBy: { deadline: "desc" },
      take: 10,
      select: postSummarySelect,
    }),
  ]);
  return { open, closed };
}

export async function latestPosts(now: Date, take = 6) {
  return db.post.findMany({
    where: { ...visiblePostWhere(now), OR: [{ deadline: null }, { deadline: { gte: now } }] },
    orderBy: { publishedAt: "desc" },
    take,
    select: postSummarySelect,
  });
}
