import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

/**
 * Renders authored Markdown with LaTeX maths ($...$ and $$...$$).
 * Raw HTML in the source is not rendered, so content cannot inject markup.
 */
export function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <div className={`prose-content ${className ?? ""}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
