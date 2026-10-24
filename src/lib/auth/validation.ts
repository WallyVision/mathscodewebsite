import { z } from "zod";
import { normalizeCameroonPhone } from "@/lib/domain/phone";

const phone = z
  .string()
  .trim()
  .transform((value, ctx) => {
    const normalized = normalizeCameroonPhone(value);
    if (!normalized) {
      ctx.addIssue({ code: "custom", message: "Enter a valid Cameroon number, e.g. 677 12 34 56" });
      return z.NEVER;
    }
    return normalized;
  });

export const passwordSchema = z
  .string()
  .min(8, "Use at least 8 characters")
  .max(128, "Use at most 128 characters");

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(80),
  phone,
  email: z
    .union([z.literal(""), z.email("Enter a valid email address")])
    .transform((v) => (v === "" ? null : v.toLowerCase())),
  level: z.enum(["O_LEVEL", "A_LEVEL"], { error: "Choose your level" }),
  password: passwordSchema,
});

export const loginSchema = z.object({
  // Phone number or email address
  identifier: z.string().trim().min(1, "Enter your phone number or email"),
  password: z.string().min(1, "Enter your password"),
});

/** Interprets a login identifier as an email or a Cameroon phone number. */
export function parseIdentifier(identifier: string): { email: string } | { phone: string } | null {
  if (identifier.includes("@")) return { email: identifier.toLowerCase() };
  const normalized = normalizeCameroonPhone(identifier);
  return normalized ? { phone: normalized } : null;
}
