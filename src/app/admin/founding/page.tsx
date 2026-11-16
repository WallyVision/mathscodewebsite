import type { Metadata } from "next";
import Link from "next/link";
import { EmptyRow, PageHeader, tableClass, tdClass, thClass } from "@/components/admin";
import { ADMIN_ONLY, requireRole } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { FOUNDING, foundingProgress } from "@/lib/domain/founding";
import { formatXaf, LEVEL_LABEL } from "@/lib/domain/pricing";
import { formatDate, formatDateTime } from "@/lib/format";
import { OpenFoundingButton, RecordFoundingForm } from "./founding-forms";

export const metadata: Metadata = { title: "Founding members" };

export default async function AdminFoundingPage() {
  await requireRole(ADMIN_ONLY);
  const [members, subjects] = await Promise.all([
    db.foundingMember.findMany({
      orderBy: { number: "asc" },
      select: {
        id: true,
        number: true,
        createdAt: true,
        activatedAt: true,
        user: { select: { id: true, name: true, phone: true, email: true } },
        subject: { select: { name: true, level: true } },
        payment: { select: { amount: true, metadata: true } },
      },
    }),
    db.subject.findMany({
      orderBy: [{ level: "asc" }, { name: "asc" }],
      select: { id: true, name: true, level: true },
    }),
  ]);
  const progress = foundingProgress(members.length);
  const collected = members.reduce((sum, m) => sum + m.payment.amount, 0);
  const waiting = members.filter((m) => !m.activatedAt).length;
  const opened = members.some((m) => m.activatedAt);

  return (
    <div className="space-y-6">
      <PageHeader title="Founding members">
        {progress.taken} of {FOUNDING.places} places taken · {formatXaf(collected)} collected ·{" "}
        <Link href="/founding" className="text-brand-700 underline">
          See the public page
        </Link>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="mb-1 font-semibold">Record a founding member</h2>
          <p className="mb-4 text-sm text-slate-600">
            When a student has paid {formatXaf(FOUNDING.price)} by Mobile Money or cash, record it
            here. They get the next founding number.{" "}
            {opened
              ? `Founding memberships have started, so theirs starts at once (${FOUNDING.days} days).`
              : "Their membership starts when you start founding memberships."}
          </p>
          {progress.full ? (
            <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-900">
              All {FOUNDING.places} places are taken.
            </p>
          ) : (
            <RecordFoundingForm
              price={FOUNDING.price}
              subjects={subjects.map((s) => ({
                id: s.id,
                label: `${LEVEL_LABEL[s.level]} · ${s.name}`,
              }))}
            />
          )}
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="mb-1 font-semibold">Launch day</h2>
          {waiting === 0 ? (
            <p className="text-sm text-slate-600">
              {opened
                ? "Founding memberships have started. New founding members start at once."
                : "No founding members yet. When there are some, you start their memberships here on launch day."}
            </p>
          ) : (
            <>
              <p className="mb-4 text-sm text-slate-600">
                {waiting} founding {waiting === 1 ? "member is" : "members are"} waiting. Until you
                start them, they have their founding number but not yet their {FOUNDING.days} days
                of membership.
              </p>
              <OpenFoundingButton waiting={waiting} days={FOUNDING.days} />
            </>
          )}
        </section>
      </div>

      <div className="overflow-x-auto">
        <table className={tableClass}>
          <thead>
            <tr>
              <th className={thClass}>#</th>
              <th className={thClass}>Student</th>
              <th className={thClass}>Subject</th>
              <th className={thClass}>Paid</th>
              <th className={thClass}>Joined</th>
              <th className={thClass}>Membership</th>
            </tr>
          </thead>
          <tbody>
            {members.length === 0 && <EmptyRow colSpan={6}>No founding members yet.</EmptyRow>}
            {members.map((m) => {
              const reference = (m.payment.metadata as { reference?: string } | null)?.reference;
              return (
                <tr key={m.id}>
                  <td className={tdClass}>{m.number}</td>
                  <td className={tdClass}>
                    <Link
                      href={`/admin/students/${m.user.id}`}
                      className="text-brand-700 underline"
                    >
                      {m.user.name}
                    </Link>
                    <div className="text-xs text-slate-500">{m.user.phone ?? m.user.email}</div>
                  </td>
                  <td className={tdClass}>
                    {LEVEL_LABEL[m.subject.level]} · {m.subject.name}
                  </td>
                  <td className={tdClass}>
                    {formatXaf(m.payment.amount)}
                    {reference && <div className="text-xs text-slate-500">{reference}</div>}
                  </td>
                  <td className={tdClass}>{formatDateTime(m.createdAt)}</td>
                  <td className={tdClass}>
                    {m.activatedAt ? `Started ${formatDate(m.activatedAt)}` : "Waiting for launch"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
