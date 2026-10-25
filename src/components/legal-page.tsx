import { Markdown } from "@/components/markdown";

/** Layout for the terms, privacy and refund pages: title, date and Markdown body. */
export function LegalPage({
  title,
  updated,
  body,
}: {
  title: string;
  updated: string;
  body: string;
}) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="mt-1 text-sm text-slate-500">Last updated {updated}</p>
      <Markdown className="mt-6">{body}</Markdown>
    </article>
  );
}
