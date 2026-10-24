import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Verifies an HS256 JSON Web Token, as CamPay sends in the `signature` field
 * of its payment notifications, signed with the app's webhook key.
 * Returns the payload when valid, or null.
 */
export function verifyHs256(
  token: string,
  key: string,
  now = new Date(),
): Record<string, unknown> | null {
  const parts = token.split(".");
  if (parts.length !== 3 || !key) return null;
  const [header, payload, signature] = parts as [string, string, string];

  let parsedHeader: unknown;
  let parsedPayload: unknown;
  try {
    parsedHeader = JSON.parse(Buffer.from(header, "base64url").toString("utf8"));
    parsedPayload = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    return null;
  }
  // Only HS256 is accepted, so a token cannot choose "none" or another algorithm.
  if ((parsedHeader as { alg?: unknown })?.alg !== "HS256") return null;
  if (typeof parsedPayload !== "object" || parsedPayload === null) return null;

  const expected = createHmac("sha256", key).update(`${header}.${payload}`).digest();
  const actual = Buffer.from(signature, "base64url");
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;

  const exp = (parsedPayload as { exp?: unknown }).exp;
  if (typeof exp === "number" && exp * 1000 < now.getTime()) return null;
  return parsedPayload as Record<string, unknown>;
}
