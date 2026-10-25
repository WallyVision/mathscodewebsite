"use server";

import { revalidatePath } from "next/cache";
import { requireRole, STAFF_ROLES } from "@/lib/auth/session";
import { saveImage } from "@/lib/media";

export interface UploadState {
  message?: string;
  image?: { id: string; markdown: string; reused: boolean };
}

export async function uploadImage(_prev: UploadState, formData: FormData): Promise<UploadState> {
  const user = await requireRole(STAFF_ROLES);
  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) return { message: "Choose an image first." };
  const result = await saveImage(file.name, new Uint8Array(await file.arrayBuffer()), user.id);
  if (!result.ok) return { message: result.message };
  revalidatePath("/admin/media");
  return { image: { id: result.id, markdown: result.markdown, reused: result.reused } };
}
