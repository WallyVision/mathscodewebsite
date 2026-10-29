import type { PaymentPurpose } from "@prisma/client";
import type { Metadata } from "next";
import Link from "next/link";
import { logout } from "@/app/(auth)/actions";
import { requireUser } from "@/lib/auth/session";
import { NotificationsToggle } from "@/components/notifications-toggle";
import { db } from "@/lib/db";
import { formatXaf, LEVEL_LABEL } from "@/lib/domain/pricing";
import { formatDate, formatDateTime } from "@/lib/format";
import { vapidKeys } from "@/lib/push";
import { PasswordForm } from "./password-form";

export const metadata: Metadata = { title: "Account" };

const PURPOSE_LABEL: Record<PaymentPurpose, string> = {
  SUBSCRIPTION: "Membership",
  COMPETITION_ENTRY: "Competition subject",
  QUESTION_SOLUTION: "Solution unlock",
  PAPER_SOLUTIONS: "Paper solutions",
};

export default async function AccountPage() {
  const user = await requireUser();
  const now = new Date();
  const [periods, entryPeriods, payments, keys] = await Promise.all([
    db.subscription.findMany({
      where: { userId: user.id, endsAt: { gt: now } },
      orderBy: { endsAt: "asc" },
      select: { level: true, endsAt: true },
    }),
    db.competitionEntry.findMany({
      where: { userId: user.id, endsAt: { gt: now } },
      orderBy: { endsAt: "asc" },
      select: { subjectId: true, endsAt: true, subject: { select: { name: true } } },
    }),
    db.payment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { id: true, amount: true, status: true, purpose: true, createdAt: true },
    }),
    vapidKeys(),
  ]);

  // Early renewals create back-to-back periods; show each level once, with its final end date.
  const subscriptions = [...new Map(periods.map((p) => [p.level, p])).values()];
  const entries = [...new Map(entryPeriods.map((e) => [e.subjectId, e])).values()];

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Your account</h1>
          <p className="text-slate-600">
            {user.name} · {LEVEL_LABEL[user.level]} · {user.phone ?? user.email}
          </p>
        </div>
        <form action={logout}>
          <button className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50">
            Log out
          </button>
        </form>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="font-semibold">Notifications</h2>
        <p className="mt-1 mb-3 text-sm text-slate-600">
          Get a notification on this phone or computer when a test opens, results are out or a new
          opportunity is posted.
        </p>
        <NotificationsToggle publicKey={keys.publicKey} variant="settings" />
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="font-semibold">Membership</h2>
        {subscriptions.length === 0 ? (
          <p className="mt-1 text-sm text-slate-600">
            No active membership.{" "}
            <Link href="/checkout" className="text-brand-700 underline">
              Become a member
            </Link>
          </p>
        ) : (
          subscriptions.map((s) => (
            <p key={s.level} className="mt-1 text-sm text-slate-600">
              {LEVEL_LABEL[s.level]}: active until {formatDate(s.endsAt)}.{" "}
              <Link href={`/checkout?plan=${s.level}`} className="text-brand-700 underline">
                Renew early
              </Link>
            </p>
          ))
        )}
        <h3 className="mt-4 text-sm font-semibold">Competition subjects</h3>
        {entries.length === 0 ? (
          <p className="mt-1 text-sm text-slate-600">None.</p>
        ) : (
          <ul className="mt-1 space-y-0.5 text-sm text-slate-600">
            {entries.map((e) => (
              <li key={e.subjectId}>
                {e.subject.name}: until {formatDate(e.endsAt)}
              </li>
            ))}
          </ul>
        )}
        <Link href="/tests" className="mt-2 inline-block text-sm text-brand-700 underline">
          Add a competition subject
        </Link>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="mb-3 font-semibold">Payments</h2>
        {payments.length === 0 ? (
          <p className="text-sm text-slate-600">No payments yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100 text-sm">
            {payments.map((p) => (
              <li key={p.id} className="flex justify-between gap-3 py-2">
                <Link href={`/payments/${p.id}`} className="text-brand-700 hover:underline">
                  {formatDateTime(p.createdAt)} · {PURPOSE_LABEL[p.purpose]}
                </Link>
                <span className="text-slate-600">
                  {formatXaf(p.amount)} · {p.status.toLowerCase()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="mb-4 font-semibold">Change password</h2>
        <div className="max-w-sm">
          <PasswordForm />
        </div>
      </section>
    </div>
  );
}
