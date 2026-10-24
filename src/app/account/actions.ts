"use server";

import { verifyPassword, hashPassword } from "@/lib/auth/password";
import { createSession, requireUser } from "@/lib/auth/session";
import { passwordSchema } from "@/lib/auth/validation";
import { db } from "@/lib/db";
import { consume, LIMITS, retryMessage } from "@/lib/rate-limit";

export interface PasswordFormState {
  message?: string;
  ok?: boolean;
  errors?: { current?: string; password?: string };
}

/** Changes the password and signs out every other device. */
export async function changePassword(
  _prev: PasswordFormState,
  formData: FormData,
): Promise<PasswordFormState> {
  const user = await requireUser();
  const limited = await consume(`password-change:${user.id}`, LIMITS.passwordChangePerUser);
  if (!limited.allowed) return { message: retryMessage(limited.retryAfterSeconds) };

  const current = String(formData.get("current") ?? "");
  const password = String(formData.get("password") ?? "");
  const parsed = passwordSchema.safeParse(password);
  if (!parsed.success) return { errors: { password: parsed.error.issues[0]?.message } };
  if (password !== formData.get("confirm"))
    return { errors: { password: "The two passwords do not match." } };

  const record = await db.user.findUniqueOrThrow({
    where: { id: user.id },
    select: { passwordHash: true },
  });
  if (!(await verifyPassword(current, record.passwordHash))) {
    return { errors: { current: "Your current password is not correct." } };
  }

  await db.$transaction([
    db.user.update({
      where: { id: user.id },
      data: { passwordHash: await hashPassword(parsed.data) },
    }),
    db.session.deleteMany({ where: { userId: user.id } }),
  ]);
  // Keep this device signed in with a fresh session.
  await createSession(user.id);
  return { ok: true, message: "Password changed. Other devices have been signed out." };
}
