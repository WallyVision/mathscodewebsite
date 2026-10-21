import type { PracticeQuestion } from "@/lib/content";
import { formatXaf, UNLOCK_PRICE } from "@/lib/domain/pricing";
import { Markdown } from "./markdown";

export function QuestionCard({ question, index }: { question: PracticeQuestion; index: number }) {
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

      <SolutionBlock solution={question.solution} paperBased={question.fromPastPaper} />
    </article>
  );
}

function SolutionBlock({
  solution,
  paperBased,
}: {
  solution: PracticeQuestion["solution"];
  paperBased: boolean;
}) {
  if (solution === null) return null;

  if (solution === "locked") {
    return (
      <div className="mt-4 rounded-md border border-dashed border-amber-300 bg-amber-50 px-4 py-3 text-sm">
        <p className="font-medium text-amber-900">🔒 Worked solution</p>
        <p className="mt-1 text-amber-800">
          Included with a subscription, or unlock this one for{" "}
          {formatXaf(UNLOCK_PRICE.questionSolution)}
          {paperBased && <> (or the whole paper for {formatXaf(UNLOCK_PRICE.paperSolutions)})</>}.
          Mobile Money payments are coming soon.
        </p>
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
