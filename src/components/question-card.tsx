import Link from "next/link";
import type { PracticeQuestion } from "@/lib/content";
import { checkoutPath } from "@/lib/domain/checkout";
import { formatXaf, UNLOCK_PRICE } from "@/lib/domain/pricing";
import { Markdown } from "./markdown";

export function QuestionCard({
  question,
  index,
  returnTo,
}: {
  question: PracticeQuestion;
  index: number;
  /** Page to come back to after unlocking; the question's anchor is added. */
  returnTo?: string;
}) {
  const number = question.number ?? index + 1;
  return (
    <article
      id={`q-${question.id}`}
      className="rounded-lg border border-slate-200 bg-white p-5"
      aria-labelledby={`q-${question.id}-title`}
    >
      <h3 id={`q-${question.id}-title`} className="mb-2 text-sm font-semibold text-brand-700">
        Question {number}
      </h3>
      <Markdown>{question.stem}</Markdown>

      <ol className="mt-4 space-y-2">
        {question.options.map((option) => (
          <li
            key={option.label}
            className="flex gap-3 rounded-md border border-slate-200 px-3 py-2"
          >
            <span className="font-semibold text-slate-500">{option.label}</span>
            <Markdown>{option.text}</Markdown>
          </li>
        ))}
      </ol>

      {question.correctLabel && (
        <details className="group mt-4">
          <summary className="cursor-pointer text-sm font-medium text-brand-700 select-none hover:underline">
            Show answer
          </summary>
          <p className="mt-2 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            Correct answer: <strong>{question.correctLabel}</strong>
          </p>
        </details>
      )}

      <SolutionBlock
        question={question}
        returnTo={returnTo ? `${returnTo}#q-${question.id}` : undefined}
      />
    </article>
  );
}

function SolutionBlock({ question, returnTo }: { question: PracticeQuestion; returnTo?: string }) {
  const { solution } = question;
  if (solution === null) return null;

  if (solution === "locked") {
    const linkClass = "inline-block rounded-md px-3 py-1.5 text-sm font-semibold transition";
    return (
      <div className="mt-4 rounded-md border border-dashed border-amber-300 bg-amber-50 px-4 py-3 text-sm">
        <p className="font-medium text-amber-900">🔒 Worked solution</p>
        <p className="mt-1 text-amber-800">
          Included with a subscription, or unlock it on its own.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href={checkoutPath({ kind: "QUESTION_SOLUTION", questionId: question.id }, returnTo)}
            className={`${linkClass} bg-amber-500 text-slate-900 hover:bg-amber-400`}
          >
            Unlock for {formatXaf(UNLOCK_PRICE.questionSolution)}
          </Link>
          {question.pastPaperId && (
            <Link
              href={checkoutPath(
                { kind: "PAPER_SOLUTIONS", pastPaperId: question.pastPaperId },
                returnTo,
              )}
              className={`${linkClass} border border-amber-400 bg-white text-amber-900 hover:bg-amber-100`}
            >
              Whole paper: {formatXaf(UNLOCK_PRICE.paperSolutions)}
            </Link>
          )}
          <Link href="/checkout" className={`${linkClass} text-brand-700 hover:underline`}>
            Subscribe
          </Link>
        </div>
      </div>
    );
  }

  return (
    <details className="mt-3">
      <summary className="cursor-pointer text-sm font-medium text-brand-700 select-none hover:underline">
        Show worked solution
      </summary>
      <div className="mt-2 rounded-md bg-slate-50 px-4 py-3">
        <Markdown>{solution}</Markdown>
      </div>
    </details>
  );
}
