import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { db } from "@/lib/db";
import { hashPassword } from "./password";

export const RESET_LINK_HOURS = 24;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * Creates a one-time reset token for a user, replacing any unused ones.
 * Returns the raw token, which goes in the link and is not stored.
 */
export async function createResetToken(userId: string, createdById: string | null) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + RESET_LINK_HOURS * 60 * 60 * 1000);
  await db.$transaction([
    db.passwordResetToken.deleteMany({ where: { userId, usedAt: null } }),
    db.passwordResetToken.create({
      data: { id: hashToken(token), userId, expiresAt, createdById },
    }),
  ]);
  return { token, expiresAt };
}

/** The user a token belongs to, if it is unused and unexpired. */
export async function findValidResetToken(token: string) {
  const record = await db.passwordResetToken.findUnique({
    where: { id: hashToken(token) },
    select: { id: true, usedAt: true, expiresAt: true, user: { select: { id: true, name: true } } },
  });
  if (!record || record.usedAt || record.expiresAt <= new Date()) return null;
  return record;
}

/**
 * Sets a new password with a reset token. The token is used up and every
 * session for the account ends, so a stolen session cannot outlive the reset.
 * Returns false when the token is not valid.
 */
export async function resetPasswordWithToken(token: string, newPassword: string): Promise<boolean> {
  const passwordHash = await hashPassword(newPassword);
  return db.$transaction(async (tx) => {
    const claimed = await tx.passwordResetToken.updateMany({
      where: { id: hashToken(token), usedAt: null, expiresAt: { gt: new Date() } },
      data: { usedAt: new Date() },
    });
    if (claimed.count === 0) return false;
    const { userId } = await tx.passwordResetToken.findUniqueOrThrow({
      where: { id: hashToken(token) },
      select: { userId: true },
    });
    await tx.user.update({ where: { id: userId }, data: { passwordHash } });
    await tx.session.deleteMany({ where: { userId } });
    return true;
  });
}
