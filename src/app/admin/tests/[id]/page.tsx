import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  EmptyRow,
  PageHeader,
  SavedBanner,
  StatusBadge,
  tableClass,
  tdClass,
  thClass,
} from "@/components/admin";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { loadTestFormOptions } from "@/lib/admin/tests";
import { ADMIN_ONLY, requireRole } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { formatDateTime, formatSeconds, toDoualaInput } from "@/lib/format";
import { ensureTestDrawn, finalizeExpiredAttempts } from "@/lib/tests";
import { TestForm } from "../test-form";
import { DisqualifyButton } from "./attempt-actions";

export const metadata: Metadata = { title: "Edit test" };

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}

/** Below a quarter of the time allowed for a high score is worth a second look. */
function isSuspiciouslyFast(
  timeTaken: number,
  durationMinutes: number,
  score: number,
  maxScore: number,
) {
  return maxScore > 0 && score / maxScore >= 0.8 && timeTaken < durationMinutes * 60 * 0.25;
}

export default async function EditTestPage({ params, searchParams }: Props) {
  await requireRole(ADMIN_ONLY);
  const [{ id }, { saved }] = await Promise.all([params, searchParams]);
  await ensureTestDrawn(id);
  await finalizeExpiredAttempts(id);
  const [test, options] = await Promise.all([
    db.test.findUnique({
      where: { id },
      include: {
        questions: { orderBy: { position: "asc" }, select: { questionId: true } },
        attempts: {
          orderBy: [{ score: "desc" }, { timeTaken: "asc" }],
          include: { user: { select: { name: true, phone: true, email: true } } },
        },
      },
    }),
    loadTestFormOptions(),
  ]);
  if (!test) notFound();

  return (
    <div className="space-y-10">
      <div className="max-w-3xl">
        <Breadcrumbs items={[{ label: "Tests", href: "/admin/tests" }, { label: test.title }]} />
        <PageHeader title="Edit test">
          <Link href={`/tests/${test.id}`} className="text-brand-700 underline">
            View as a student
          </Link>
          <span className="mt-1 block text-sm text-slate-600">
            {test.openNotifiedAt
              ? `🔔 Students were notified that it opened, ${formatDateTime(test.openNotifiedAt)}.`
              : test.status === "SCHEDULED"
                ? "🔔 Students who turned notifications on are notified automatically when it opens."
                : "🔔 Set it to Scheduled: students are notified automatically when it opens."}
          </span>
        </PageHeader>
        <SavedBanner show={saved === "1"} />
        <TestForm
          key={`${test.title}-${test.status}-${test.opensAt.getTime()}-${test.closesAt.getTime()}`}
          subjects={options.subjects}
          questions={options.questions}
          unusedBank={options.unusedBank}
          locked={test.attempts.length > 0 || test.drawnAt !== null}
          drawnQuestions={test.drawnAt ? test.questions.map((q) => q.questionId) : undefined}
          initial={{
            id: test.id,
            subjectId: test.subjectId,
            title: test.title,
            kind: test.kind,
            status: test.status === "DRAFT" ? "DRAFT" : "SCHEDULED",
            opensAt: toDoualaInput(test.opensAt),
            closesAt: toDoualaInput(test.closesAt),
            durationMinutes: String(test.durationMinutes),
            questionIds: test.questions.map((q) => q.questionId).join(","),
            questionMode: test.drawCount ? "DRAW" : "PICK",
            drawCount: test.drawCount ? String(test.drawCount) : "",
          }}
        />
      </div>

      <section>
        <h2 className="mb-1 text-lg font-semibold">Attempts ({test.attempts.length})</h2>
        <p className="mb-3 text-sm text-slate-600">
          Check high scores before paying prizes: frequent page leaving or very fast perfect scores
          are worth a call to the student.
        </p>
        <div className="overflow-x-auto">
          <table className={tableClass}>
            <thead>
              <tr>
                <th className={thClass}>Student</th>
                <th className={thClass}>Score</th>
                <th className={thClass}>Time</th>
                <th className={thClass}>Left page</th>
                <th className={thClass}>Finished</th>
                <th className={thClass}>Status</th>
                <th className={thClass} />
              </tr>
            </thead>
            <tbody>
              {test.attempts.length === 0 && <EmptyRow colSpan={7}>No attempts yet.</EmptyRow>}
              {test.attempts.map((a) => {
                const fast =
                  a.score !== null &&
                  a.maxScore !== null &&
                  a.timeTaken !== null &&
                  isSuspiciouslyFast(a.timeTaken, test.durationMinutes, a.score, a.maxScore);
                return (
                  <tr key={a.id} className={a.status === "DISQUALIFIED" ? "opacity-60" : ""}>
                    <td className={tdClass}>
                      {a.user.name}
                      <span className="block text-xs text-slate-500">
                        {a.user.phone ?? a.user.email}
                      </span>
                    </td>
                    <td className={`${tdClass} tabular-nums`}>
                      {a.score === null ? "–" : `${a.score}/${a.maxScore}`}
                    </td>
                    <td
                      className={`${tdClass} tabular-nums ${fast ? "font-semibold text-amber-700" : ""}`}
                    >
                      {a.timeTaken === null ? "–" : formatSeconds(a.timeTaken)}
                      {fast && " ⚠"}
                    </td>
                    <td
                      className={`${tdClass} tabular-nums ${a.focusLosses >= 3 ? "font-semibold text-red-700" : ""}`}
                    >
                      {a.focusLosses}
                    </td>
                    <td className={`${tdClass} whitespace-nowrap`}>
                      {a.submittedAt ? formatDateTime(a.submittedAt) : "–"}
                    </td>
                    <td className={tdClass}>
                      <StatusBadge status={a.status} />
                    </td>
                    <td className={tdClass}>
                      {a.status !== "IN_PROGRESS" && (
                        <DisqualifyButton
                          attemptId={a.id}
                          disqualified={a.status === "DISQUALIFIED"}
                        />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
