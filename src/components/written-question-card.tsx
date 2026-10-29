import Link from "next/link";
import { checkoutPath } from "@/lib/domain/checkout";
import { formatXaf, UNLOCK_PRICE } from "@/lib/domain/pricing";
import { Markdown } from "./markdown";

export interface WrittenQuestionView {
  id: string;
  label: string;
  marks: number | null;
  body: string;
  pastPaperId: string;
  /** Worked solution when the viewer may see it; "locked" when they may not; null when none written. */
  solution: string | "locked" | null;
}

/** A structured (Paper 2 style) question: work it out on paper, then compare with the solution. */
export function WrittenQuestionCard({
  question,
  returnTo,
}: {
  question: WrittenQuestionView;
  /** Page to come back to after unlocking; the question's anchor is added. */
  returnTo?: string;
}) {
  const back = returnTo ? `${returnTo}#w-${question.id}` : undefined;
  return (
    <article
      id={`w-${question.id}`}
      className="rounded-lg border border-slate-200 bg-white p-5"
      aria-labelledby={`w-${question.id}-title`}
    >
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <h3 id={`w-${question.id}-title`} className="text-sm font-semibold text-brand-700">
          Question {question.label}
        </h3>
        {question.marks !== null && (
          <span className="shrink-0 text-sm text-slate-500">
            {question.marks} {question.marks === 1 ? "mark" : "marks"}
          </span>
        )}
      </div>
      <Markdown>{question.body}</Markdown>

      {question.solution === "locked" && (
        <div className="mt-4 rounded-md border border-dashed border-amber-300 bg-amber-50 px-4 py-3 text-sm">
          <p className="font-medium text-amber-900">🔒 Worked solution</p>
          <p className="mt-1 text-amber-800">
            Included with membership, or unlock every solution of this paper.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href={checkoutPath(
                { kind: "PAPER_SOLUTIONS", pastPaperId: question.pastPaperId },
                back,
              )}
              className="inline-block rounded-md bg-amber-500 px-3 py-1.5 text-sm font-semibold text-slate-900 transition hover:bg-amber-400"
            >
              Whole paper: {formatXaf(UNLOCK_PRICE.paperSolutions)}
            </Link>
            <Link
              href="/checkout"
              className="inline-block rounded-md px-3 py-1.5 text-sm font-semibold text-brand-700 hover:underline"
            >
              Become a member
            </Link>
          </div>
        </div>
      )}
      {question.solution !== null && question.solution !== "locked" && (
        <details className="mt-4">
          <summary className="cursor-pointer text-sm font-medium text-brand-700 select-none hover:underline">
            Show worked solution
          </summary>
          <div className="mt-2 rounded-md bg-slate-50 px-4 py-3">
            <Markdown>{question.solution}</Markdown>
          </div>
        </details>
      )}
    </article>
  );
}
