/** Image storage against a real database (DATABASE_URL). */
import { randomBytes } from "node:crypto";
import { afterAll, describe, expect, it } from "vitest";
import { db } from "@/lib/db";
import { getImage, saveImage } from "./media";

// A unique PNG: the signature followed by random bytes.
const png = () =>
  new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, ...randomBytes(32)]);
const created: string[] = [];

afterAll(async () => {
  await db.media.deleteMany({ where: { id: { in: created } } });
  await db.$disconnect();
});

describe("image storage", () => {
  it("stores an image once and returns the line to paste", async () => {
    const bytes = png();
    const first = await saveImage("Circuit 1.png", bytes, "user-1");
    expect(first).toMatchObject({ ok: true, reused: false });
    if (!first.ok) return;
    created.push(first.id);
    expect(first.markdown).toBe(`![Circuit 1](/media/${first.id})`);

    const again = await saveImage("copy.png", bytes, "user-2");
    expect(again).toMatchObject({ ok: true, id: first.id, reused: true });

    const stored = await getImage(first.id);
    expect(stored?.contentType).toBe("image/png");
    expect(new Uint8Array(stored!.data)).toEqual(bytes);
  });

  it("refuses unsafe or unsupported files without storing them", async () => {
    const before = await db.media.count();
    const bad = new TextEncoder().encode(
      '<svg xmlns="http://www.w3.org/2000/svg"><script>x</script></svg>',
    );
    expect(await saveImage("bad.svg", bad, "user-1")).toMatchObject({ ok: false });
    expect(
      await saveImage("doc.pdf", new TextEncoder().encode("%PDF-1.7"), "user-1"),
    ).toMatchObject({
      ok: false,
    });
    expect(await db.media.count()).toBe(before);
  });
});
