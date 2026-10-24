import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

interface HastNode {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
}

const SAFE_URL = /^(https?:|mailto:|#|\/(?!\/))/i;

/** Removes link and image addresses that are not ordinary web, mail or same-site links. */
function rehypeSafeUrls() {
  const walk = (node: HastNode) => {
    if (node.type === "element" && node.properties) {
      for (const attr of ["href", "src"]) {
        const value = node.properties[attr];
        if (typeof value === "string" && !SAFE_URL.test(value.trim())) delete node.properties[attr];
      }
    }
    node.children?.forEach(walk);
  };
  return (tree: HastNode) => walk(tree);
}

// Raw HTML in the source is dropped by remark-rehype (no allowDangerousHtml), so
// authors cannot inject markup; maths is added afterwards by KaTeX.
const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkMath)
  .use(remarkRehype)
  .use(rehypeSafeUrls)
  .use(rehypeKatex)
  .use(rehypeStringify)
  .freeze();

const MAX_CACHED = 5000;
const cache = new Map<string, string>();

/**
 * Markdown with LaTeX maths to HTML. Results are cached, because rendering
 * maths is the most expensive work the server does and every student taking
 * a test sees the same questions.
 */
export function renderMarkdown(source: string): string {
  const hit = cache.get(source);
  if (hit !== undefined) {
    // Refresh its position so the most recently used entries are kept.
    cache.delete(source);
    cache.set(source, hit);
    return hit;
  }
  const html = String(processor.processSync(source));
  cache.set(source, html);
  if (cache.size > MAX_CACHED) cache.delete(cache.keys().next().value!);
  return html;
}
