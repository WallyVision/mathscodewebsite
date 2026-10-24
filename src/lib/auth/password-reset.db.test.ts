import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { db } from "@/lib/db";
import { verifyPassword } from "./password";
import { createResetToken, findValidResetToken, resetPasswordWithToken } from "./password-reset";

let userId: string;

beforeAll(async () => {
  const user = await db.user.create({
    data: {
      name: "Forgetful Student",
      email: `reset-${randomUUID()}@example.test`,
      passwordHash: "x",
      level: "O_LEVEL",
    },
  });
  userId = user.id;
});

afterAll(async () => {
  await db.user.delete({ where: { id: userId } });
  await db.$disconnect();
});

describe("password reset links", () => {
  it("set a new password once, ending every session", async () => {
    await db.session.create({
      data: { id: `s-${randomUUID()}`, userId, expiresAt: new Date(Date.now() + 86_400_000) },
    });
    const { token } = await createResetToken(userId, null);
    expect(await findValidResetToken(token)).not.toBeNull();

    expect(await resetPasswordWithToken(token, "brand-new-password")).toBe(true);
    const user = await db.user.findUniqueOrThrow({ where: { id: userId } });
    expect(await verifyPassword("brand-new-password", user.passwordHash)).toBe(true);
    expect(await db.session.count({ where: { userId } })).toBe(0);

    // The same link cannot be used again.
    expect(await resetPasswordWithToken(token, "another-password")).toBe(false);
    expect(await findValidResetToken(token)).toBeNull();
  });

  it("only the newest link works", async () => {
    const first = await createResetToken(userId, null);
    const second = await createResetToken(userId, null);
    expect(await findValidResetToken(first.token)).toBeNull();
    expect(await findValidResetToken(second.token)).not.toBeNull();
  });

  it("expire", async () => {
    const { token } = await createResetToken(userId, null);
    await db.passwordResetToken.updateMany({
      where: { userId, usedAt: null },
      data: { expiresAt: new Date(Date.now() - 1000) },
    });
    expect(await findValidResetToken(token)).toBeNull();
    expect(await resetPasswordWithToken(token, "too-late-password")).toBe(false);
  });

  it("reject made-up tokens", async () => {
    expect(await resetPasswordWithToken("not-a-real-token", "whatever-password")).toBe(false);
  });
});
