import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { loadViewerAccess } from "@/lib/access";
import { requireUser } from "@/lib/auth/session";
import { EnterCompetition } from "@/components/enter-competition";
import { canEnterTest } from "@/lib/domain/entitlements";
import { hasActiveSubscription } from "@/lib/domain/subscription";
import { formatDateTime } from "@/lib/format";
import { getOwnAttempt, getTestForUser } from "@/lib/tests";
import { StartButton } from "./start-button";

export const metadata: Metadata = { title: "Test" };

interface Props {
  params: Promise<{ testId: string }>;
}

export default async function TestPage({ params }: Props) {
  const user = await requireUser();
  const { testId } = await params;
  const test = await getTestForUser(testId, user);
  if (!test) notFound();

  const [attempt, access] = await Promise.all([
    getOwnAttempt(test.id, user.id),
    loadViewerAccess(user),
  ]);
  const now = new Date();
  const isOpen = test.opensAt <= now && now < test.closesAt;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumbs items={[{ label: "Tests", href: "/tests" }, { label: test.title }]} />
      <h1 className="text-2xl font-bold">{test.title}</h1>

      <dl className="mt-4 grid grid-cols-2 gap-3 rounded-lg border border-slate-200 bg-white p-5 text-sm sm:grid-cols-4">
        <Fact label="Subject" value={test.subject.name} />
        <Fact
          label="Questions"
          value={String(test.drawCount && !test.drawnAt ? test.drawCount : test._count.questions)}
        />
        <Fact label="Time allowed" value={`${test.durationMinutes} min`} />
        <Fact label="Closes" value={formatDateTime(test.closesAt)} />
      </dl>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="font-semibold">Rules</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
          <li>You have one attempt. The timer starts when you press Start and cannot be paused.</li>
          <li>Your answers are saved as you go. If your connection drops, reopen the test.</li>
          <li>When time runs out, your saved answers are submitted automatically.</li>
          <li>Leaving the test page is recorded and is checked before prizes are paid.</li>
          <li>Correct answers and solutions are shown when the test closes.</li>
        </ul>
      </section>

      <div className="mt-6">
        {attempt?.status === "IN_PROGRESS" ? (
          <Link
            href={`/tests/${test.id}/take`}
            className="inline-block rounded-md bg-brand-600 px-5 py-3 font-semibold text-white hover:bg-brand-700"
          >
            Continue test →
          </Link>
        ) : attempt ? (
          <Link
            href={`/tests/${test.id}/results`}
            className="inline-block rounded-md bg-brand-600 px-5 py-3 font-semibold text-white hover:bg-brand-700"
          >
            View your result →
          </Link>
        ) : now < test.opensAt ? (
          <p className="text-slate-700">Opens {formatDateTime(test.opensAt)}.</p>
        ) : !isOpen ? (
          <p className="text-slate-700">
            This test has closed.{" "}
            <Link href={`/tests/${test.id}/results`} className="text-brand-700 underline">
              See the leaderboard
            </Link>
          </p>
        ) : canEnterTest(access, test.subjectId, now) ? (
          <StartButton testId={test.id} />
        ) : (
          <EnterCompetition
            subject={{ id: test.subjectId, name: test.subject.name, level: test.subject.level }}
            isMember={hasActiveSubscription(access.subscriptions, test.subject.level, now)}
            returnTo={`/tests/${test.id}`}
          />
        )}
      </div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
