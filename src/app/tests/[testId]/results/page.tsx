import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Markdown } from "@/components/markdown";
import { requireUser } from "@/lib/auth/session";
import { percentage } from "@/lib/domain/scoring";
import { formatDateTime, formatSeconds } from "@/lib/format";
import {
  getAttemptReview,
  getLeaderboard,
  getOwnAttempt,
  getTestForUser,
  isRevealed,
  type LeaderboardRow,
  type ReviewQuestion,
} from "@/lib/tests";

export const metadata: Metadata = { title: "Results" };

const LEADERBOARD_SIZE = 10;

interface Props {
  params: Promise<{ testId: string }>;
}

export default async function ResultsPage({ params }: Props) {
  const user = await requireUser();
  const { testId } = await params;
  const test = await getTestForUser(testId, user);
  if (!test) notFound();

  const attempt = await getOwnAttempt(test.id, user.id);
  if (attempt?.status === "IN_PROGRESS") redirect(`/tests/${test.id}/take`);

  const now = new Date();
  const revealed = isRevealed(test, now);
  if (!attempt && !revealed) redirect(`/tests/${test.id}`);

  const [leaderboard, review] = await Promise.all([
    getLeaderboard(test.id),
    attempt && revealed ? getAttemptReview(attempt) : Promise.resolve(null),
  ]);
  const mine = leaderboard.find((r) => r.userId === user.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumbs
        items={[
          { label: "Tests", href: "/tests" },
          { label: test.title, href: `/tests/${test.id}` },
          { label: "Results" },
        ]}
      />
      <h1 className="text-2xl font-bold">{test.title}</h1>

      {attempt && attempt.score !== null && attempt.maxScore !== null && (
        <section className="mt-6 grid grid-cols-3 gap-3 rounded-lg border border-slate-200 bg-white p-5 text-center">
          <Stat label="Score" value={`${attempt.score}/${attempt.maxScore}`} />
          <Stat label="Percentage" value={`${percentage(attempt.score, attempt.maxScore)}%`} />
          <Stat
            label={revealed ? "Rank" : "Rank so far"}
            value={mine ? `${mine.rank} of ${leaderboard.length}` : "–"}
          />
          <p className="col-span-3 text-sm text-slate-600">
            {attempt.status === "EXPIRED" ? "Time ran out; your saved answers were marked. " : ""}
            Time taken: {formatSeconds(attempt.timeTaken ?? 0)}
          </p>
        </section>
      )}

      {attempt && attempt.focusLosses > 0 && (
        <p className="mt-3 rounded-md bg-amber-50 px-4 py-2 text-sm text-amber-900">
          You left the test page {attempt.focusLosses}{" "}
          {attempt.focusLosses === 1 ? "time" : "times"}. This is reviewed before prizes are paid.
        </p>
      )}

      {!revealed && (
        <p className="mt-6 rounded-md bg-brand-50 px-4 py-3 text-sm text-brand-900">
          Correct answers and worked solutions will appear here when the test closes on{" "}
          {formatDateTime(test.closesAt)}. Ranks can change until then.
        </p>
      )}

      <Leaderboard rows={leaderboard} userId={user.id} final={revealed} />

      {review && (
        <section className="mt-10">
          <h2 className="mb-3 text-lg font-semibold">Review your answers</h2>
          <div className="space-y-4">
            {review.map((q, i) => (
              <ReviewCard key={q.id} question={q} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}

function Leaderboard({
  rows,
  userId,
  final,
}: {
  rows: LeaderboardRow[];
  userId: string;
  final: boolean;
}) {
  if (rows.length === 0) return null;
  const top = rows.slice(0, LEADERBOARD_SIZE);
  const mine = rows.find((r) => r.userId === userId);
  const shown = mine && !top.includes(mine) ? [...top, mine] : top;

  return (
    <section className="mt-8">
      <h2 className="mb-3 text-lg font-semibold">
        {final ? "Leaderboard" : "Leaderboard so far"}{" "}
        <span className="text-sm font-normal text-slate-500">({rows.length} students)</span>
      </h2>
      <table className="w-full overflow-hidden rounded-lg border border-slate-200 bg-white text-sm">
        <thead className="bg-slate-50 text-left text-slate-500">
          <tr>
            <th className="px-3 py-2 font-medium">#</th>
            <th className="px-3 py-2 font-medium">Student</th>
            <th className="px-3 py-2 text-right font-medium">Score</th>
            <th className="px-3 py-2 text-right font-medium">Time</th>
          </tr>
        </thead>
        <tbody>
          {shown.map((row) => (
            <tr
              key={row.userId}
              className={`border-t border-slate-100 ${row.userId === userId ? "bg-brand-50 font-semibold" : ""}`}
            >
              <td className="px-3 py-2">
                {row.rank <= 3 ? ["🥇", "🥈", "🥉"][row.rank - 1] : row.rank}
              </td>
              <td className="px-3 py-2">
                {row.name}
                {row.userId === userId && " (you)"}
              </td>
              <td className="px-3 py-2 text-right tabular-nums">{row.score}</td>
              <td className="px-3 py-2 text-right tabular-nums">{formatSeconds(row.timeTaken)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function ReviewCard({ question, index }: { question: ReviewQuestion; index: number }) {
  const correct = question.options.find((o) => o.isCorrect);
  const gotIt = correct !== undefined && question.selectedOptionId === correct.id;
  const status =
    question.selectedOptionId === null ? "Not answered" : gotIt ? "Correct" : "Incorrect";

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-brand-700">Question {index + 1}</h3>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${gotIt ? "bg-emerald-100 text-emerald-800" : question.selectedOptionId === null ? "bg-slate-100 text-slate-600" : "bg-red-100 text-red-700"}`}
        >
          {gotIt ? "✓ " : question.selectedOptionId === null ? "" : "✗ "}
          {status}
        </span>
      </div>
      <Markdown>{question.stem}</Markdown>
      <ol className="mt-4 space-y-2">
        {question.options.map((option) => {
          const chosen = option.id === question.selectedOptionId;
          return (
            <li
              key={option.id}
              className={`flex gap-3 rounded-md border px-3 py-2 ${option.isCorrect ? "border-emerald-500 bg-emerald-50" : chosen ? "border-red-400 bg-red-50" : "border-slate-200"}`}
            >
              <span className="font-semibold text-slate-500">{option.label}</span>
              <span className="min-w-0 flex-1">
                <Markdown>{option.text}</Markdown>
              </span>
              {option.isCorrect && (
                <span className="text-xs font-medium text-emerald-700">Correct</span>
              )}
              {chosen && !option.isCorrect && (
                <span className="text-xs font-medium text-red-700">Your answer</span>
              )}
            </li>
          );
        })}
      </ol>
      {question.solution && (
        <details className="mt-3">
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
