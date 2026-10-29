import "server-only";
import { db } from "@/lib/db";
import { categoryInfo, deadlineState } from "@/lib/domain/posts";
import { formatDateTime } from "@/lib/format";
import { sendPush } from "@/lib/push";

/** Events older than this are not announced (for example after downtime). */
const ANNOUNCE_WITHIN_MS = 6 * 60 * 60 * 1000;

/**
 * Sends "test is open" notifications for scheduled tests that have just
 * opened, once per test, to every student at the test's level: entered
 * students can start, others see how to enter. Safe to run often and on
 * several servers at once: each test is claimed before it is announced.
 */
export async function notifyOpenedTests(now = new Date()): Promise<number> {
  const due = await db.test.findMany({
    where: {
      status: "SCHEDULED",
      openNotifiedAt: null,
      opensAt: { lte: now, gte: new Date(now.getTime() - ANNOUNCE_WITHIN_MS) },
      closesAt: { gt: now },
    },
    select: {
      id: true,
      title: true,
      closesAt: true,
      subject: { select: { name: true, level: true } },
    },
  });

  let announced = 0;
  for (const test of due) {
    const claimed = await db.test.updateMany({
      where: { id: test.id, openNotifiedAt: null },
      data: { openNotifiedAt: now },
    });
    if (claimed.count === 0) continue;
    const message = {
      title: `📝 ${test.title} is open`,
      body: `${test.subject.name}: answer before ${formatDateTime(test.closesAt)}. Good luck!`,
      url: `/tests/${test.id}`,
    };
    const result = await sendPush(message, { level: test.subject.level });
    await db.notificationLog.create({
      data: { ...message, audience: test.subject.level, ...result },
    });
    announced++;
  }
  return announced;
}

/**
 * Tells students who sat a test that its results are out. Results appear when
 * a test closes, so this runs at closing time, once per test.
 */
export async function notifyTestResults(now = new Date()): Promise<number> {
  const due = await db.test.findMany({
    where: {
      status: { not: "DRAFT" },
      resultsNotifiedAt: null,
      closesAt: { lte: now, gte: new Date(now.getTime() - ANNOUNCE_WITHIN_MS) },
    },
    select: { id: true, title: true },
  });

  let announced = 0;
  for (const test of due) {
    const claimed = await db.test.updateMany({
      where: { id: test.id, resultsNotifiedAt: null },
      data: { resultsNotifiedAt: now },
    });
    if (claimed.count === 0) continue;
    const message = {
      title: `🏁 Results are out: ${test.title}`,
      body: "See your score, the correct answers and the final ranking.",
      url: `/tests/${test.id}/results`,
    };
    const result = await sendPush(message, { attempts: { some: { testId: test.id } } });
    await db.notificationLog.create({ data: { ...message, audience: "TEST_TAKERS", ...result } });
    announced++;
  }
  return announced;
}

const clip = (text: string, max: number) =>
  text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`;

/**
 * Tells everyone about newly published opportunity posts, once per post.
 * Several posts published together go out as one notification, so students
 * are not flooded; posts whose deadline has already passed are not announced.
 */
export async function notifyNewPosts(now = new Date()): Promise<number> {
  const due = await db.post.findMany({
    where: {
      status: "PUBLISHED",
      notifiedAt: null,
      publishedAt: { lte: now, gte: new Date(now.getTime() - ANNOUNCE_WITHIN_MS) },
    },
    orderBy: { publishedAt: "asc" },
    select: { id: true, title: true, summary: true, slug: true, category: true, deadline: true },
  });

  const fresh: typeof due = [];
  for (const post of due) {
    const claimed = await db.post.updateMany({
      where: { id: post.id, notifiedAt: null },
      data: { notifiedAt: now },
    });
    if (claimed.count === 1 && deadlineState(post.deadline, now) !== "closed") fresh.push(post);
  }
  if (fresh.length === 0) return 0;

  const message =
    fresh.length === 1
      ? (() => {
          const post = fresh[0]!;
          const info = categoryInfo(post.category);
          return {
            title: clip(`${info.icon} New in ${info.label}: ${post.title}`, 80),
            body: clip(post.summary, 160),
            url: `/opportunities/${info.slug}/${post.slug}`,
          };
        })()
      : {
          title: `✨ ${fresh.length} new opportunities`,
          body: clip(fresh.map((p) => p.title).join(" · "), 160),
          url: "/opportunities",
        };
  const result = await sendPush(message, {});
  await db.notificationLog.create({ data: { ...message, audience: "ALL", ...result } });
  return fresh.length;
}

/** Everything the server announces on its own; run every minute. */
export async function runAutoNotifications(now = new Date()) {
  return {
    opened: await notifyOpenedTests(now),
    results: await notifyTestResults(now),
    posts: await notifyNewPosts(now),
  };
}
