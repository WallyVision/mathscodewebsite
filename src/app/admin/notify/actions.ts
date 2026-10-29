"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { formValues, invalid, type AdminFormState } from "@/lib/admin/form";
import { ADMIN_ONLY, requireRole } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { AUDIENCES, audienceWhere, sendPush, type Audience } from "@/lib/push";

const notifySchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Write a short title")
    .max(60, "Keep the title under 60 characters"),
  body: z
    .string()
    .trim()
    .min(2, "Write the message")
    .max(200, "Keep the message under 200 characters"),
  url: z
    .string()
    .trim()
    .transform((v) => v || "/dashboard")
    .refine(
      (v) => /^\/(?!\/)[^\s]*$/.test(v),
      "Use a page on this site, starting with /, e.g. /tests",
    ),
  audience: z.enum(Object.keys(AUDIENCES) as [Audience, ...Audience[]]),
});

export async function sendNotification(
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const user = await requireRole(ADMIN_ONLY);
  const values = formValues(formData);
  const parsed = notifySchema.safeParse(values);
  if (!parsed.success) return invalid(parsed.error, values);
  const { title, body, url, audience } = parsed.data;

  const result = await sendPush({ title, body, url }, audienceWhere(audience, new Date()));
  await db.notificationLog.create({
    data: { title, body, url, audience, ...result, createdById: user.id },
  });
  redirect(`/admin/notify?sent=${result.delivered}&of=${result.devices}`);
}
