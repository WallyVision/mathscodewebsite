import { renderMarkdown } from "@/lib/markdown";

/**
 * Renders authored Markdown with LaTeX maths ($...$ and $$...$$). The HTML
 * comes from renderMarkdown, which drops raw HTML and unsafe links.
 */
export function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <div
      className={`prose-content ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: renderMarkdown(children) }}
    />
  );
}
