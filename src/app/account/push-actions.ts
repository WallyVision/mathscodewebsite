"use server";

import { z } from "zod";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";

const subscriptionSchema = z.object({
  endpoint: z.string().url().startsWith("https://").max(2000),
  keys: z.object({ p256dh: z.string().min(1).max(200), auth: z.string().min(1).max(100) }),
});

/** Keeps this device's push subscription on the signed-in account. */
export async function savePushSubscription(input: unknown, userAgent: string): Promise<boolean> {
  const user = await requireUser();
  const parsed = subscriptionSchema.safeParse(input);
  if (!parsed.success) return false;
  const { endpoint, keys } = parsed.data;
  // A shared phone moves to whoever is signed in now.
  await db.pushSubscription.upsert({
    where: { endpoint },
    create: {
      userId: user.id,
      endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
      userAgent: userAgent.slice(0, 300),
    },
    update: { userId: user.id, p256dh: keys.p256dh, auth: keys.auth },
  });
  return true;
}

export async function removePushSubscription(endpoint: string): Promise<void> {
  const user = await requireUser();
  await db.pushSubscription.deleteMany({ where: { endpoint, userId: user.id } });
}
