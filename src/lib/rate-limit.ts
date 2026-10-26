import "server-only";
import { headers } from "next/headers";
import { db } from "@/lib/db";

export interface Limit {
  /** Maximum attempts in one window. */
  max: number;
  windowSeconds: number;
}

/** Limits for repeated actions. Each is counted per key (an IP, a phone number, an account). */
export const LIMITS = {
  loginPerIdentifier: { max: 5, windowSeconds: 15 * 60 },
  loginPerIp: { max: 30, windowSeconds: 15 * 60 },
  registerPerIp: { max: 10, windowSeconds: 60 * 60 },
  checkoutPerUser: { max: 6, windowSeconds: 10 * 60 },
  // Payment prompts sent to one number, whoever asks: stops prompt spam to someone else's phone.
  checkoutPerPhone: { max: 5, windowSeconds: 60 * 60 },
  passwordResetPerIp: { max: 10, windowSeconds: 60 * 60 },
  passwordChangePerUser: { max: 5, windowSeconds: 15 * 60 },
  askPerUser: { max: 5, windowSeconds: 24 * 60 * 60 },
} satisfies Record<string, Limit>;

export type RateResult = { allowed: true } | { allowed: false; retryAfterSeconds: number };

/**
 * Counts one attempt against `key` and says whether it is allowed. The count
 * and the window reset happen in one SQL statement, so concurrent requests
 * cannot both slip under the limit.
 */
export async function consume(key: string, limit: Limit): Promise<RateResult> {
  const rows = await db.$queryRaw<{ count: number; windowStart: Date }[]>`
    INSERT INTO "RateLimit" ("key", "windowStart", "count")
    VALUES (${key}, now(), 1)
    ON CONFLICT ("key") DO UPDATE SET
      "count" = CASE
        WHEN "RateLimit"."windowStart" < now() - make_interval(secs => ${limit.windowSeconds}) THEN 1
        ELSE "RateLimit"."count" + 1
      END,
      "windowStart" = CASE
        WHEN "RateLimit"."windowStart" < now() - make_interval(secs => ${limit.windowSeconds}) THEN now()
        ELSE "RateLimit"."windowStart"
      END
    RETURNING "count", "windowStart"`;
  const row = rows[0];
  if (!row || row.count <= limit.max) return { allowed: true };
  const resetAt = row.windowStart.getTime() + limit.windowSeconds * 1000;
  return {
    allowed: false,
    retryAfterSeconds: Math.max(1, Math.ceil((resetAt - Date.now()) / 1000)),
  };
}

/** Clears a counter, e.g. after a successful login. */
export async function reset(key: string): Promise<void> {
  await db.rateLimit.deleteMany({ where: { key } });
}

/** Consumes several limits; the first one exceeded wins. All are counted. */
export async function consumeAll(entries: [string, Limit][]): Promise<RateResult> {
  const results = await Promise.all(entries.map(([key, limit]) => consume(key, limit)));
  return results.find((r) => !r.allowed) ?? { allowed: true };
}

/** The client's IP as reported by the hosting proxy, or "unknown". */
export async function clientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || h.get("x-real-ip") || "unknown";
}

export function retryMessage(seconds: number): string {
  const minutes = Math.ceil(seconds / 60);
  return `Too many attempts. Please try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`;
}
