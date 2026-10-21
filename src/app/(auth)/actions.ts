"use server";

import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { z } from "zod";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSession, destroySession } from "@/lib/auth/session";
import { loginSchema, parseIdentifier, registerSchema } from "@/lib/auth/validation";
import { db } from "@/lib/db";

export interface FormState {
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  values?: Record<string, string>;
}

function formValues(formData: FormData, keys: readonly string[]): Record<string, string> {
  return Object.fromEntries(keys.map((k) => [k, String(formData.get(k) ?? "")]));
}

export async function register(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = formValues(formData, ["name", "phone", "email", "level"]);
  const parsed = registerSchema.safeParse({ ...values, password: formData.get("password") });
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors, values };
  }
  const { password, ...data } = parsed.data;

  let userId: string;
  try {
    const user = await db.user.create({
      data: { ...data, passwordHash: await hashPassword(password) },
      select: { id: true },
    });
    userId = user.id;
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      const target = String(err.meta?.target ?? "");
      const field = target.includes("email") ? "email" : "phone";
      return {
        fieldErrors: { [field]: [`An account with this ${field} already exists. Log in instead.`] },
        values,
      };
    }
    throw err;
  }

  await createSession(userId);
  redirect("/dashboard");
}

// Compared against when no user matches, so response time does not reveal which accounts exist.
const DUMMY_HASH = hashPassword("dummy-password-for-timing");

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = formValues(formData, ["identifier"]);
  const parsed = loginSchema.safeParse({ ...values, password: formData.get("password") });
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors, values };
  }

  const where = parseIdentifier(parsed.data.identifier);
  const user = where
    ? await db.user.findUnique({ where, select: { id: true, passwordHash: true } })
    : null;
  const valid = await verifyPassword(
    parsed.data.password,
    user?.passwordHash ?? (await DUMMY_HASH),
  );
  if (!user || !valid) {
    return { message: "Incorrect phone number, email or password.", values };
  }

  await createSession(user.id);
  redirect("/dashboard");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/");
}
