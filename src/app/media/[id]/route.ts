import { getImage } from "@/lib/media";

// Uploaded images never change: a new upload gets a new address.
const CACHE = "public, max-age=31536000, immutable";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const image = /^[a-z0-9]{10,40}$/.test(id) ? await getImage(id) : null;
  if (!image) return new Response("Not found", { status: 404 });

  const etag = `"${image.sha256}"`;
  const headers = new Headers({
    "Content-Type": image.contentType,
    "Cache-Control": CACHE,
    ETag: etag,
    "X-Content-Type-Options": "nosniff",
    // Opened directly, an image can never run script or load anything else.
    "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox",
  });
  if (request.headers.get("if-none-match") === etag)
    return new Response(null, { status: 304, headers });
  return new Response(new Uint8Array(image.data), { headers });
}
