import type { Metadata } from "next";
import Link from "next/link";
import { loadViewerAccess } from "@/lib/access";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { checkoutPath } from "@/lib/domain/checkout";
import { EXTRA_SUBJECT_PRICE, formatXaf } from "@/lib/domain/pricing";
import { hasActiveEntry, hasActiveSubscription } from "@/lib/domain/subscription";
import { formatDate, formatDateTime } from "@/lib/format";
import { listTestsForUser } from "@/lib/tests";

export const metadata: Metadata = { title: "Tests" };

type TestItem = Awaited<ReturnType<typeof listTestsForUser>>[number];

export default async function TestsPage() {
  const user = await requireUser();
  const [tests, access, subjects] = await Promise.all([
    listTestsForUser(user),
    loadViewerAccess(user),
    db.subject.findMany({
      where: { level: user.level, competitionOpen: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, level: true },
    }),
  ]);
  const now = new Date();
  const isMember = hasActiveSubscription(access.subscriptions, user.level, now);

  const open = tests.filter((t) => t.opensAt <= now && now < t.closesAt);
  const upcoming = tests.filter((t) => now < t.opensAt).reverse();
  const closed = tests.filter((t) => t.closesAt <= now);

  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold">Tests</h1>
        <p className="text-slate-600">
          Timed MCQ tests in each competition subject. One attempt each. Top scorers in each subject
          win its monthly prizes.
        </p>
      </div>
      {user.role === "STUDENT" && subjects.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">Your competition subjects</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {subjects.map((subject) => {
              const entry = access.entries
                .filter((e) => e.subjectId === subject.id && e.endsAt > now)
                .sort((a, b) => b.endsAt.getTime() - a.endsAt.getTime())[0];
              const entered = hasActiveEntry(access.entries, subject.id, now);
              return (
                <li
                  key={subject.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3 text-sm"
                >
                  <span>
                    <span className="block font-medium">{subject.name}</span>
                    <span className="text-slate-600">
                      {entered && entry
                        ? `Entered until ${formatDate(entry.endsAt)}`
                        : entry
                          ? `Starts ${formatDate(entry.startsAt)}`
                          : "Not entered"}
                    </span>
                  </span>
                  {!entry && (
                    <Link
                      href={checkoutPath(
                        isMember
                          ? {
                              kind: "COMPETITION_ENTRY",
                              level: subject.level,
                              subjectId: subject.id,
                            }
                          : { kind: "SUBSCRIPTION", level: subject.level, subjectId: subject.id },
                        "/tests",
                      )}
                      className="shrink-0 rounded-md border border-brand-600 px-3 py-1.5 font-medium text-brand-700 hover:bg-brand-50"
                    >
                      {isMember
                        ? `Enter · ${formatXaf(EXTRA_SUBJECT_PRICE[subject.level])}`
                        : "Become a member"}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}
      <TestSection title="Open now" tests={open} empty="No test is open right now." />
      <TestSection title="Coming up" tests={upcoming} empty="No upcoming tests yet." />
      <TestSection title="Past tests" tests={closed} empty="No past tests yet." />
    </div>
  );
}

function TestSection({ title, tests, empty }: { title: string; tests: TestItem[]; empty: string }) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold">{title}</h2>
      {tests.length === 0 ? (
        <p className="text-sm text-slate-600">{empty}</p>
      ) : (
        <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
          {tests.map((test) => (
            <li key={test.id}>
              <Link
                href={`/tests/${test.id}`}
                className="flex items-center justify-between gap-4 p-4 hover:bg-slate-50"
              >
                <span>
                  <span className="block font-medium">{test.title}</span>
                  <span className="text-sm text-slate-600">
                    {test.subject.name} · {test.durationMinutes} min · closes{" "}
                    {formatDateTime(test.closesAt)}
                  </span>
                </span>
                <AttemptBadge attempt={test.attempt} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function AttemptBadge({ attempt }: { attempt: TestItem["attempt"] }) {
  if (!attempt) return null;
  if (attempt.status === "IN_PROGRESS") {
    return (
      <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
        In progress
      </span>
    );
  }
  return (
    <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
      {attempt.score}/{attempt.maxScore}
    </span>
  );
}
