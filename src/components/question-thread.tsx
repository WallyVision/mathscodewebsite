import { Markdown } from "@/components/markdown";
import { formatDateTime } from "@/lib/format";

/** A student's question and its replies, as students and staff both see it. */
export function QuestionThread({
  question,
}: {
  question: {
    body: string;
    imageId: string | null;
    createdAt: Date;
    replies: { id: string; body: string; createdAt: Date; author: { name: string } }[];
  };
}) {
  return (
    <div className="space-y-3">
      {question.body && (
        // Student text is shown as typed: never rendered as Markdown or HTML.
        <p className="text-sm whitespace-pre-wrap">{question.body}</p>
      )}
      {question.imageId && (
        <a href={`/media/${question.imageId}`} target="_blank" rel="noopener noreferrer">
          {/* eslint-disable-next-line @next/next/no-img-element -- served from our own /media route */}
          <img
            src={`/media/${question.imageId}`}
            alt="Photo of the question"
            loading="lazy"
            className="max-h-72 rounded border border-slate-200"
          />
        </a>
      )}
      {question.replies.map((reply) => (
        <div key={reply.id} className="rounded-md border-l-4 border-brand-600 bg-brand-50 p-3">
          <p className="mb-1 text-xs text-slate-600">
            {reply.author.name} · {formatDateTime(reply.createdAt)}
          </p>
          <Markdown className="text-sm">{reply.body}</Markdown>
        </div>
      ))}
    </div>
  );
}
