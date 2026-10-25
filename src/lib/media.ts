import "server-only";
import { createHash } from "node:crypto";
import { db } from "@/lib/db";
import { checkImage, imageMarkdown } from "@/lib/domain/media";

export type SaveImageResult =
  { ok: true; id: string; markdown: string; reused: boolean } | { ok: false; message: string };

/** Checks and stores an uploaded image. The same file uploaded twice is stored once. */
export async function saveImage(
  name: string,
  bytes: Uint8Array,
  uploadedBy: string,
): Promise<SaveImageResult> {
  const check = checkImage(bytes);
  if (!check.ok) return check;

  const sha256 = createHash("sha256").update(bytes).digest("hex");
  const cleanName = name.replace(/[^\w.\- ]+/g, "").slice(0, 120) || "image";
  const existing = await db.media.findUnique({ where: { sha256 }, select: { id: true } });
  if (existing) {
    return {
      ok: true,
      id: existing.id,
      markdown: imageMarkdown(existing.id, cleanName),
      reused: true,
    };
  }
  const media = await db.media.upsert({
    where: { sha256 },
    create: {
      name: cleanName,
      contentType: check.contentType,
      size: bytes.length,
      data: Buffer.from(bytes),
      sha256,
      uploadedBy,
    },
    update: {},
    select: { id: true },
  });
  return { ok: true, id: media.id, markdown: imageMarkdown(media.id, cleanName), reused: false };
}

export function getImage(id: string) {
  return db.media.findUnique({
    where: { id },
    select: { data: true, contentType: true, sha256: true },
  });
}

export async function listImages(take = 60) {
  const images = await db.media.findMany({
    orderBy: { createdAt: "desc" },
    take,
    select: { id: true, name: true, size: true, contentType: true, createdAt: true },
  });
  return images.map((image) => ({ ...image, markdown: imageMarkdown(image.id, image.name) }));
}
