"use server";

import { redirect } from "next/navigation";
import { resetPasswordWithToken } from "@/lib/auth/password-reset";
import { passwordSchema } from "@/lib/auth/validation";
import { clientIp, consume, LIMITS, retryMessage } from "@/lib/rate-limit";

export interface ResetFormState {
  message?: string;
  passwordError?: string;
}

export async function resetPassword(
  _prev: ResetFormState,
  formData: FormData,
): Promise<ResetFormState> {
  const limited = await consume(`reset:ip:${await clientIp()}`, LIMITS.passwordResetPerIp);
  if (!limited.allowed) return { message: retryMessage(limited.retryAfterSeconds) };

  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const parsed = passwordSchema.safeParse(password);
  if (!parsed.success) return { passwordError: parsed.error.issues[0]?.message };
  if (password !== formData.get("confirm"))
    return { passwordError: "The two passwords do not match." };

  if (!(await resetPasswordWithToken(token, parsed.data))) {
    return { message: "This reset link has expired or was already used. Ask for a new one." };
  }
  redirect("/login?reset=1");
}
