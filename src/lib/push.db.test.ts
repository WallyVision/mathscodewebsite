/** Push notifications: audiences, delivery and clean-up, against a real database (DATABASE_URL). */
import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { db } from "@/lib/db";

const sendNotification = vi.fn();
vi.mock("web-push", () => ({
  default: {
    sendNotification: (...args: unknown[]) => sendNotification(...args),
    generateVAPIDKeys: () => ({ publicKey: `pub-${Math.random()}`, privateKey: "priv" }),
  },
}));

const { audienceWhere, sendPush, vapidKeys } = await import("./push");

const run = randomUUID().slice(0, 8);
const ids: Record<string, string> = {};
const now = new Date();

const user = async (name: string, level: "O_LEVEL" | "A_LEVEL", member: boolean) => {
  const u = await db.user.create({
    data: {
      name,
      email: `push-${run}-${name}@example.test`,
      passwordHash: "x",
      level,
      ...(member && {
        subscriptions: {
          create: {
            level,
            startsAt: new Date(now.getTime() - 86_400_000),
            endsAt: new Date(now.getTime() + 86_400_000),
          },
        },
      }),
      pushDevices: {
        create: { endpoint: `https://push.example/${run}/${name}`, p256dh: "k", auth: "a" },
      },
    },
  });
  ids[name] = u.id;
};

// The test makes fake keys; whatever the database held before is put back afterwards.
let savedKeys: { value: string } | null = null;

// Limits every audience to this test's users, so other data in the database does not count.
const mine = () => ({ id: { in: Object.values(ids) } });

beforeAll(async () => {
  savedKeys = await db.appSetting.findUnique({
    where: { key: "vapid-keys" },
    select: { value: true },
  });
  await db.appSetting.deleteMany({ where: { key: "vapid-keys" } });
  await user("olevelFree", "O_LEVEL", false);
  await user("olevelMember", "O_LEVEL", true);
  await user("alevelFree", "A_LEVEL", false);
});

beforeEach(() => {
  sendNotification.mockReset();
});

afterAll(async () => {
  await db.appSetting.deleteMany({ where: { key: "vapid-keys" } });
  if (savedKeys)
    await db.appSetting.create({ data: { key: "vapid-keys", value: savedKeys.value } });
  await db.user.deleteMany({ where: mine() });
  await db.$disconnect();
});

const reach = async (audience: Parameters<typeof audienceWhere>[0]) =>
  (
    await db.user.findMany({
      where: { AND: [audienceWhere(audience, now), mine()] },
      select: { name: true },
    })
  )
    .map((u) => u.name)
    .sort();

describe("audiences", () => {
  it("picks the right users", async () => {
    expect(await reach("ALL")).toEqual(["alevelFree", "olevelFree", "olevelMember"]);
    expect(await reach("O_LEVEL")).toEqual(["olevelFree", "olevelMember"]);
    expect(await reach("A_LEVEL")).toEqual(["alevelFree"]);
    expect(await reach("MEMBERS")).toEqual(["olevelMember"]);
    expect(await reach("FREE")).toEqual(["alevelFree", "olevelFree"]);
  });
});

describe("sendPush", () => {
  it("delivers to each device and removes devices that are gone", async () => {
    sendNotification.mockImplementation(async (sub: { endpoint: string }) => {
      if (sub.endpoint.endsWith("/alevelFree"))
        throw Object.assign(new Error("gone"), { statusCode: 410 });
    });
    const result = await sendPush(
      { title: "Test opens", body: "Saturday 4 pm", url: "/tests" },
      { AND: [audienceWhere("ALL", now), mine()] },
    );
    expect(result).toEqual({ devices: 3, delivered: 2 });
    const payload = JSON.parse(sendNotification.mock.calls[0]![1] as string);
    expect(payload).toMatchObject({ title: "Test opens", body: "Saturday 4 pm", url: "/tests" });
    const left = await db.pushSubscription.findMany({
      where: { userId: { in: Object.values(ids) } },
    });
    expect(left.map((d) => d.endpoint.split("/").pop()).sort()).toEqual([
      "olevelFree",
      "olevelMember",
    ]);
    expect(left.every((d) => d.lastSentAt !== null)).toBe(true);
  });

  it("keeps a device after a temporary failure", async () => {
    sendNotification.mockRejectedValue(Object.assign(new Error("busy"), { statusCode: 503 }));
    const result = await sendPush(
      { title: "t", body: "b", url: "/" },
      { AND: [audienceWhere("MEMBERS", now), mine()] },
    );
    expect(result).toEqual({ devices: 1, delivered: 0 });
    expect(await db.pushSubscription.count({ where: { userId: ids.olevelMember } })).toBe(1);
  });
});

describe("vapidKeys", () => {
  it("makes a key pair once and then always returns the same one", async () => {
    const first = await vapidKeys();
    const second = await vapidKeys();
    expect(second).toEqual(first);
  });
});
