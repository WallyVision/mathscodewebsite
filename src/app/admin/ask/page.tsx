import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, SavedBanner } from "@/components/admin";
import { QuestionThread } from "@/components/question-thread";
import { contentScope } from "@/lib/admin/scope";
import { inboxQuestions } from "@/lib/ask";
import { requireRole, STAFF_ROLES } from "@/lib/auth/session";
import { LEVEL_LABEL } from "@/lib/domain/pricing";
import { formatDateTime } from "@/lib/format";
import { ReplyForm, StatusButton } from "./ask-admin-forms";

export const metadata: Metadata = { title: "Student questions" };

const TABS = [
  { status: "OPEN", label: "Waiting" },
  { status: "ANSWERED", label: "Answered" },
  { status: "CLOSED", label: "Closed" },
] as const;

export default async function StudentQuestionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; sent?: string }>;
}) {
  const user = await requireRole(STAFF_ROLES);
  const { status: requested, sent } = await searchParams;
  const status = TABS.find((t) => t.status === requested)?.status ?? "OPEN";
  const questions = await inboxQuestions(await contentScope(user), status);

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader title="Student questions">
        Questions members send about {user.role === "ADMIN" ? "every subject" : "your subjects"}.
        Reply within two days; the student sees your answer in their account.
      </PageHeader>

      <SavedBanner show={sent === "1"}>
        Reply sent. The student sees it in their account, and the question moved to Answered.
      </SavedBanner>

      <nav className="flex gap-2 text-sm" aria-label="Question status">
        {TABS.map((tab) => (
          <Link
            key={tab.status}
            href={`/admin/ask?status=${tab.status}`}
            aria-current={tab.status === status ? "page" : undefined}
            className={`rounded-full px-3 py-1 ${tab.status === status ? "bg-slate-800 text-white" : "border border-slate-300 hover:bg-slate-50"}`}
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      {questions.length === 0 ? (
        <p className="text-sm text-slate-600">Nothing here.</p>
      ) : (
        <ul className="space-y-5">
          {questions.map((q) => (
            <li key={q.id} className="space-y-4 rounded-lg border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-600">
                <strong className="text-slate-900">{q.user.name}</strong> ·{" "}
                {LEVEL_LABEL[q.subject.level]} {q.subject.name} · {formatDateTime(q.createdAt)}
              </p>
              <QuestionThread question={q} />
              {q.status !== "CLOSED" && <ReplyForm questionId={q.id} />}
              <div className="flex gap-2">
                {q.status === "CLOSED" ? (
                  <StatusButton questionId={q.id} status="OPEN" label="Reopen" />
                ) : (
                  <StatusButton questionId={q.id} status="CLOSED" label="Close without reply" />
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
