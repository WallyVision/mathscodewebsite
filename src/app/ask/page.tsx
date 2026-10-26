import type { Metadata } from "next";
import Link from "next/link";
import { QuestionThread } from "@/components/question-thread";
import { askableSubjects, ownQuestions } from "@/lib/ask";
import { requireUser } from "@/lib/auth/session";
import { formatXaf, LEVEL_LABEL, SUBSCRIPTION_PRICE } from "@/lib/domain/pricing";
import { formatDateTime } from "@/lib/format";
import { AskForm } from "./ask-form";

export const metadata: Metadata = { title: "Ask a question" };

const STATUS_LABEL = { OPEN: "Waiting for a reply", ANSWERED: "Answered", CLOSED: "Closed" };
const STATUS_CLASS = {
  OPEN: "bg-amber-100 text-amber-800",
  ANSWERED: "bg-emerald-100 text-emerald-800",
  CLOSED: "bg-slate-100 text-slate-600",
};

export default async function AskPage() {
  const user = await requireUser();
  const [subjects, questions] = await Promise.all([askableSubjects(user), ownQuestions(user.id)]);

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold">Ask a question</h1>
        <p className="text-slate-600">
          Stuck on a question? Send it to the subject&apos;s teachers. They reply here, usually
          within two days.
        </p>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        {subjects.length > 0 ? (
          <AskForm
            subjects={subjects.map((s) => ({
              id: s.id,
              label: `${LEVEL_LABEL[s.level]} ${s.name}`,
            }))}
          />
        ) : (
          <div className="text-sm text-slate-700">
            <p className="font-semibold">Asking questions is for members.</p>
            <p className="mt-1">
              Membership costs {formatXaf(SUBSCRIPTION_PRICE[user.level])} a month and includes
              every worked solution, the competition and questions to our teachers.
            </p>
            <Link
              href="/checkout"
              className="mt-3 inline-block rounded-md bg-brand-600 px-4 py-2 font-semibold text-white hover:bg-brand-700"
            >
              Become a member
            </Link>
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Your questions</h2>
        {questions.length === 0 ? (
          <p className="text-sm text-slate-600">You have not asked anything yet.</p>
        ) : (
          <ul className="space-y-4">
            {questions.map((q) => (
              <li key={q.id} className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span className="font-medium">
                    {LEVEL_LABEL[q.subject.level]} {q.subject.name}
                    <span className="ml-2 font-normal text-slate-500">
                      {formatDateTime(q.createdAt)}
                    </span>
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_CLASS[q.status]}`}>
                    {STATUS_LABEL[q.status]}
                  </span>
                </div>
                <QuestionThread question={q} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
