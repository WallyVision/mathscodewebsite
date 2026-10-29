/** "Test is open" notifications, against a real database (DATABASE_URL). */
import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { db } from "@/lib/db";

const sendNotification = vi.fn(async () => undefined);
vi.mock("web-push", () => ({
  default: {
    sendNotification: (...args: unknown[]) => sendNotification(...(args as [])),
    generateVAPIDKeys: () => ({ publicKey: "pub", privateKey: "priv" }),
  },
}));
process.env.VAPID_PUBLIC_KEY = "pub";
process.env.VAPID_PRIVATE_KEY = "priv";

const { notifyOpenedTests } = await import("./test-notifications");

const run = randomUUID().slice(0, 8);
const now = new Date("2030-03-02T15:00:00Z");
const minutes = (m: number) => new Date(now.getTime() + m * 60_000);
let subjectId: string;
const testIds: Record<string, string> = {};
const userIds: string[] = [];

const makeTest = async (
  name: string,
  status: "DRAFT" | "SCHEDULED",
  opensIn: number,
  closesIn: number,
) => {
  testIds[name] = (
    await db.test.create({
      data: {
        subjectId,
        title: `Test ${name} ${run}`,
        kind: "WEEKLY",
        status,
        opensAt: minutes(opensIn),
        closesAt: minutes(closesIn),
        durationMinutes: 30,
      },
    })
  ).id;
};

beforeAll(async () => {
  subjectId = (
    await db.subject.create({ data: { level: "O_LEVEL", slug: `tn-${run}`, name: "Notify Maths" } })
  ).id;
  for (const [name, level] of [
    ["o", "O_LEVEL"],
    ["a", "A_LEVEL"],
  ] as const) {
    const u = await db.user.create({
      data: {
        name,
        email: `tn-${run}-${name}@example.test`,
        passwordHash: "x",
        level,
        pushDevices: {
          create: { endpoint: `https://push.example/${run}/${name}`, p256dh: "k", auth: "a" },
        },
      },
    });
    userIds.push(u.id);
  }
  await makeTest("justOpened", "SCHEDULED", -2, 120);
  await makeTest("notYet", "SCHEDULED", 10, 120);
  await makeTest("draft", "DRAFT", -2, 120);
  await makeTest("longAgo", "SCHEDULED", -60 * 24, 120);
  await makeTest("closed", "SCHEDULED", -120, -1);
});

afterAll(async () => {
  delete process.env.VAPID_PUBLIC_KEY;
  delete process.env.VAPID_PRIVATE_KEY;
  await db.notificationLog.deleteMany({ where: { title: { contains: run } } });
  await db.test.deleteMany({ where: { subjectId } });
  await db.subject.deleteMany({ where: { id: subjectId } });
  await db.user.deleteMany({ where: { id: { in: userIds } } });
  await db.$disconnect();
});

const notified = async () =>
  (
    await db.test.findMany({
      where: { subjectId, openNotifiedAt: { not: null } },
      select: { id: true },
    })
  ).map((t) => Object.keys(testIds).find((k) => testIds[k] === t.id));

describe("notifyOpenedTests", () => {
  it("announces a test that just opened, once, to students at its level", async () => {
    // Other tests in the shared database may also be due; count only this file's.
    await notifyOpenedTests(now);
    expect(await notified()).toEqual(["justOpened"]);
    const mine = sendNotification.mock.calls.filter((c) =>
      (c as unknown as [{ endpoint: string }])[0].endpoint.includes(run),
    );
    expect(
      mine.map((c) => (c as unknown as [{ endpoint: string }])[0].endpoint.split("/").pop()),
    ).toEqual(["o"]);
    const payload = JSON.parse((mine[0] as unknown as [unknown, string])[1]);
    expect(payload).toMatchObject({
      title: `📝 Test justOpened ${run} is open`,
      url: `/tests/${testIds.justOpened}`,
    });
    expect(payload.body).toMatch(/^Notify Maths: answer before /);
    const log = await db.notificationLog.findFirstOrThrow({ where: { title: { contains: run } } });
    expect(log).toMatchObject({ audience: "O_LEVEL", devices: 1, delivered: 1 });

    sendNotification.mockClear();
    await notifyOpenedTests(minutes(1));
    expect(sendNotification.mock.calls.filter((c) => JSON.stringify(c).includes(run))).toEqual([]);
  });

  it("announces a test when its opening time comes", async () => {
    await notifyOpenedTests(minutes(11));
    expect((await notified()).sort()).toEqual(["justOpened", "notYet"]);
  });
});
