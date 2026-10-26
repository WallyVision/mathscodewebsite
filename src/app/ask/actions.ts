"use server";

import { revalidatePath } from "next/cache";
import { createStudentQuestion } from "@/lib/ask";
import { requireUser } from "@/lib/auth/session";
import { saveImage } from "@/lib/media";
import { consume, LIMITS, retryMessage } from "@/lib/rate-limit";

export interface AskState {
  message?: string;
  sent?: boolean;
  values?: { subjectId: string; body: string };
}

export async function askQuestion(_prev: AskState, formData: FormData): Promise<AskState> {
  const user = await requireUser();
  const values = {
    subjectId: String(formData.get("subjectId") ?? ""),
    body: String(formData.get("body") ?? ""),
  };
  const file = formData.get("image");
  const hasImage = file instanceof File && file.size > 0;
  if (!values.body.trim() && !hasImage) {
    return { message: "Type your question or attach a photo of it.", values };
  }

  const limited = await consume(`ask:user:${user.id}`, LIMITS.askPerUser);
  if (!limited.allowed) return { message: retryMessage(limited.retryAfterSeconds), values };

  let imageId: string | null = null;
  if (hasImage) {
    const saved = await saveImage(
      file.name || "question.jpg",
      new Uint8Array(await file.arrayBuffer()),
      user.id,
    );
    if (!saved.ok) return { message: saved.message, values };
    imageId = saved.id;
  }

  const result = await createStudentQuestion(user, { ...values, imageId });
  if (!result.ok) return { message: result.message, values };
  revalidatePath("/ask");
  return { sent: true };
}
