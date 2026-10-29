import "server-only";
import type { Prisma } from "@prisma/client";
import webpush from "web-push";
import { db } from "@/lib/db";
import { site } from "@/lib/site";

export const AUDIENCES = {
  ALL: "Everyone",
  O_LEVEL: "O Level students",
  A_LEVEL: "A Level students",
  MEMBERS: "Members (active membership)",
  FREE: "Free accounts (no active membership)",
} as const;
export type Audience = keyof typeof AUDIENCES;

export function isAudience(value: string): value is Audience {
  return value in AUDIENCES;
}

/** Which users a notification for this audience goes to. */
export function audienceWhere(audience: Audience, now: Date): Prisma.UserWhereInput {
  const member: Prisma.SubscriptionListRelationFilter = {
    some: { startsAt: { lte: now }, endsAt: { gt: now } },
  };
  switch (audience) {
    case "ALL":
      return {};
    case "O_LEVEL":
      return { level: "O_LEVEL" };
    case "A_LEVEL":
      return { level: "A_LEVEL" };
    case "MEMBERS":
      return { subscriptions: member };
    case "FREE":
      return { subscriptions: { none: { startsAt: { lte: now }, endsAt: { gt: now } } } };
  }
}

interface VapidKeys {
  publicKey: string;
  privateKey: string;
}

const SETTING_KEY = "vapid-keys";

/**
 * The site's push notification keys. Set VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY
 * to choose them; otherwise a pair is made on first use and kept in the
 * database, so there is nothing to configure. Changing the keys stops every
 * existing subscription from working, so they are never regenerated.
 */
export async function vapidKeys(): Promise<VapidKeys> {
  const { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY } = process.env;
  if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
    return { publicKey: VAPID_PUBLIC_KEY, privateKey: VAPID_PRIVATE_KEY };
  }
  const saved = await db.appSetting.findUnique({ where: { key: SETTING_KEY } });
  if (saved) return JSON.parse(saved.value) as VapidKeys;
  const fresh = webpush.generateVAPIDKeys();
  // If two requests race, both upserts keep the first stored pair.
  await db.appSetting.upsert({
    where: { key: SETTING_KEY },
    create: { key: SETTING_KEY, value: JSON.stringify(fresh) },
    update: {},
  });
  const stored = await db.appSetting.findUniqueOrThrow({ where: { key: SETTING_KEY } });
  return JSON.parse(stored.value) as VapidKeys;
}

export interface PushMessage {
  title: string;
  body: string;
  /** Page on this site to open when the notification is tapped, e.g. "/tests". */
  url: string;
}

/**
 * Sends a notification to every device of the matching users. Devices the
 * browser reports as gone (unsubscribed, app removed) are deleted.
 */
export async function sendPush(
  message: PushMessage,
  users: Prisma.UserWhereInput,
): Promise<{ devices: number; delivered: number }> {
  const keys = await vapidKeys();
  const subject = process.env.VAPID_SUBJECT ?? `https://${site.domain}`;
  const devices = await db.pushSubscription.findMany({
    where: { user: users },
    select: { id: true, endpoint: true, p256dh: true, auth: true },
  });
  const payload = JSON.stringify({ ...message, icon: "/icons/icon-192.png" });
  const gone: string[] = [];
  const sent: string[] = [];

  // Small batches keep memory and open connections modest on large audiences.
  for (let i = 0; i < devices.length; i += 50) {
    await Promise.all(
      devices.slice(i, i + 50).map(async (device) => {
        try {
          await webpush.sendNotification(
            { endpoint: device.endpoint, keys: { p256dh: device.p256dh, auth: device.auth } },
            payload,
            { vapidDetails: { subject, ...keys }, TTL: 60 * 60 * 24 * 3 },
          );
          sent.push(device.id);
        } catch (err) {
          const status = (err as { statusCode?: number }).statusCode;
          if (status === 404 || status === 410) gone.push(device.id);
        }
      }),
    );
  }
  await Promise.all([
    gone.length > 0 ? db.pushSubscription.deleteMany({ where: { id: { in: gone } } }) : null,
    sent.length > 0
      ? db.pushSubscription.updateMany({
          where: { id: { in: sent } },
          data: { lastSentAt: new Date() },
        })
      : null,
  ]);
  return { devices: devices.length, delivered: sent.length };
}
