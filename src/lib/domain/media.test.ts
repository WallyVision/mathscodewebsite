import { describe, expect, it } from "vitest";
import { checkImage, imageMarkdown, MAX_IMAGE_BYTES } from "./media";

const bytes = (...values: number[]) => new Uint8Array(values);
const text = (s: string) => new TextEncoder().encode(s);
const svg = (body: string) =>
  text(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">${body}</svg>`);

describe("checkImage", () => {
  it("recognises PNG, JPEG and WebP from their bytes", () => {
    expect(checkImage(bytes(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0))).toEqual({
      ok: true,
      contentType: "image/png",
    });
    expect(checkImage(bytes(0xff, 0xd8, 0xff, 0xe0))).toMatchObject({ contentType: "image/jpeg" });
    expect(checkImage(text("RIFF\0\0\0\0WEBPVP8 "))).toMatchObject({ contentType: "image/webp" });
  });

  it("accepts a plain SVG drawing, with or without an XML declaration", () => {
    expect(checkImage(svg('<line x1="0" y1="0" x2="10" y2="10" stroke="black"/>'))).toMatchObject({
      contentType: "image/svg+xml",
    });
    const declared = text(
      `<?xml version="1.0"?>\n<!-- drawn by hand -->\n${new TextDecoder().decode(svg(""))}`,
    );
    expect(checkImage(declared)).toMatchObject({ contentType: "image/svg+xml" });
    expect(checkImage(svg('<use href="#arrow"/>'))).toMatchObject({ ok: true });
  });

  it("refuses SVGs that could run code or load other content", () => {
    for (const body of [
      "<script>alert(1)</script>",
      '<rect onload="alert(1)"/>',
      '<a href="javascript:alert(1)"><text>x</text></a>',
      "<foreignObject><div>x</div></foreignObject>",
      '<image href="https://example.com/x.png"/>',
      '<image xlink:href="data:image/png;base64,AAAA"/>',
    ]) {
      expect(checkImage(svg(body)), body).toMatchObject({ ok: false });
    }
  });

  it("refuses other files, empty files and files over the size limit", () => {
    expect(checkImage(text("%PDF-1.7"))).toMatchObject({ ok: false });
    expect(checkImage(text("<html><svg></svg></html>"))).toMatchObject({ ok: false });
    expect(checkImage(new Uint8Array())).toMatchObject({ ok: false });
    const big = new Uint8Array(MAX_IMAGE_BYTES + 1);
    big.set([0xff, 0xd8, 0xff]);
    expect(checkImage(big)).toMatchObject({
      ok: false,
      message: expect.stringMatching(/limit is 300 KB/),
    });
  });
});

describe("imageMarkdown", () => {
  it("makes readable alt text from the file name", () => {
    expect(imageMarkdown("abc", "triangle_ABC-q7.png")).toBe("![triangle ABC q7](/media/abc)");
    expect(imageMarkdown("abc", "[x].svg")).toBe("![x](/media/abc)");
    expect(imageMarkdown("abc", ".png")).toBe("![Diagram](/media/abc)");
  });
});
