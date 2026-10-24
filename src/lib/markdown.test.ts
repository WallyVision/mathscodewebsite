import { describe, expect, it } from "vitest";
import { renderMarkdown } from "./markdown";

describe("renderMarkdown", () => {
  it("renders inline and display maths with KaTeX", () => {
    expect(renderMarkdown("Solve $3x - 7 = 11$.")).toContain('class="katex"');
    expect(renderMarkdown("$$\nx^2\n$$")).toContain("katex-display");
  });

  it("renders Markdown formatting and tables", () => {
    const html = renderMarkdown("**bold**\n\n| a | b |\n| - | - |\n| 1 | 2 |");
    expect(html).toContain("<strong>bold</strong>");
    expect(html).toContain("<table>");
  });

  it("drops raw HTML so content cannot inject markup", () => {
    const html = renderMarkdown('Hi <script>alert(1)</script><img src=x onerror="alert(1)">');
    expect(html).not.toContain("<script");
    expect(html).not.toContain("onerror");
  });

  it("removes unsafe link addresses and keeps normal ones", () => {
    expect(renderMarkdown("[x](javascript:alert(1))")).not.toContain("javascript:");
    expect(renderMarkdown("[x](//evil.example)")).not.toContain("evil.example");
    expect(renderMarkdown("[x](https://example.org)")).toContain('href="https://example.org"');
    expect(renderMarkdown("[x](/learn)")).toContain('href="/learn"');
  });

  it("returns the cached result for repeated content", () => {
    const source = `Cache check $${Math.random()}$`;
    expect(renderMarkdown(source)).toBe(renderMarkdown(source));
  });
});
