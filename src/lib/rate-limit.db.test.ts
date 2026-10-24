import { randomUUID } from "node:crypto";
import { afterAll, describe, expect, it } from "vitest";
import { db } from "@/lib/db";
import { consume, reset, retryMessage } from "./rate-limit";

const prefix = `test:${randomUUID().slice(0, 8)}`;

afterAll(async () => {
  await db.rateLimit.deleteMany({ where: { key: { startsWith: prefix } } });
  await db.$disconnect();
});

describe("rate limits", () => {
  it("allows up to the limit, then refuses with a wait time", async () => {
    const key = `${prefix}:a`;
    const limit = { max: 3, windowSeconds: 600 };
    const results = [];
    for (let i = 0; i < 4; i++) results.push(await consume(key, limit));
    expect(results.slice(0, 3).every((r) => r.allowed)).toBe(true);
    expect(results[3]).toMatchObject({ allowed: false });
    const wait = results[3]!.allowed ? 0 : results[3]!.retryAfterSeconds;
    expect(wait).toBeGreaterThan(590);
    expect(wait).toBeLessThanOrEqual(600);
  });

  it("counts concurrent attempts exactly", async () => {
    const key = `${prefix}:b`;
    const limit = { max: 5, windowSeconds: 600 };
    const results = await Promise.all(Array.from({ length: 12 }, () => consume(key, limit)));
    expect(results.filter((r) => r.allowed)).toHaveLength(5);
  });

  it("starts a new window once the old one has passed", async () => {
    const key = `${prefix}:c`;
    const limit = { max: 1, windowSeconds: 60 };
    await consume(key, limit);
    await db.rateLimit.update({
      where: { key },
      data: { windowStart: new Date(Date.now() - 61_000) },
    });
    expect(await consume(key, limit)).toEqual({ allowed: true });
  });

  it("can be reset", async () => {
    const key = `${prefix}:d`;
    const limit = { max: 1, windowSeconds: 600 };
    await consume(key, limit);
    await reset(key);
    expect(await consume(key, limit)).toEqual({ allowed: true });
  });

  it("explains the wait in minutes", () => {
    expect(retryMessage(30)).toBe("Too many attempts. Please try again in 1 minute.");
    expect(retryMessage(600)).toBe("Too many attempts. Please try again in 10 minutes.");
  });
});
