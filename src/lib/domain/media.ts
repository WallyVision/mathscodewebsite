/**
 * Rules for uploaded images. The type is decided from the file's bytes, never
 * from its name or the browser's claim, and drawings (SVG) that could run
 * code are refused.
 */

/** Small enough to load quickly on a phone with a slow connection. */
export const MAX_IMAGE_BYTES = 300 * 1024;

export type ImageType = "image/png" | "image/jpeg" | "image/webp" | "image/svg+xml";

export type ImageCheck = { ok: true; contentType: ImageType } | { ok: false; message: string };

const startsWith = (bytes: Uint8Array, signature: number[], offset = 0) =>
  signature.every((b, i) => bytes[offset + i] === b);

const ascii = (s: string) => [...s].map((c) => c.charCodeAt(0));

// Anything in an SVG that can run script, load other files or embed HTML.
const UNSAFE_SVG = [
  /<script/i,
  /<foreignObject/i,
  /<iframe|<embed|<object/i,
  /\son[a-z]+\s*=/i,
  /javascript:/i,
  /<!ENTITY/i,
  /(?:href|src)\s*=\s*["']?\s*(?!#)[a-z]+:/i,
];

export function checkImage(bytes: Uint8Array): ImageCheck {
  if (bytes.length === 0) return { ok: false, message: "The file is empty." };
  if (bytes.length > MAX_IMAGE_BYTES) {
    return {
      ok: false,
      message: `The image is ${Math.ceil(bytes.length / 1024)} KB; the limit is ${MAX_IMAGE_BYTES / 1024} KB. Make it smaller or save it as JPG or WebP.`,
    };
  }
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return { ok: true, contentType: "image/png" };
  }
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) return { ok: true, contentType: "image/jpeg" };
  if (startsWith(bytes, ascii("RIFF")) && startsWith(bytes, ascii("WEBP"), 8)) {
    return { ok: true, contentType: "image/webp" };
  }

  const text = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
  const head = text.replace(/^﻿/, "").trimStart();
  if (/^(<\?xml[^>]*>\s*)?(<!--[\s\S]*?-->\s*)*(<!DOCTYPE svg[^>]*>\s*)?<svg[\s>]/i.test(head)) {
    if (UNSAFE_SVG.some((pattern) => pattern.test(text))) {
      return {
        ok: false,
        message:
          "This SVG contains scripts, links to other files or embedded HTML, which are not allowed.",
      };
    }
    return { ok: true, contentType: "image/svg+xml" };
  }
  return { ok: false, message: "Only PNG, JPG, WebP and SVG images can be uploaded." };
}

/** Text an author pastes into a question, note or post to show the image. */
export function imageMarkdown(id: string, name: string): string {
  const alt = name
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/[[\]]/g, "")
    .trim();
  return `![${alt || "Diagram"}](/media/${id})`;
}
