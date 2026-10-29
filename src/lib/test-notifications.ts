import "server-only";
import { db } from "@/lib/db";
import { formatDateTime } from "@/lib/format";
import { sendPush } from "@/lib/push";

/** Tests that opened longer ago than this are not announced (for example after downtime). */
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
