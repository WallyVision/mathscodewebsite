import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  EmptyRow,
  PageHeader,
  StatusBadge,
  tableClass,
  tdClass,
  thClass,
} from "@/components/admin";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ADMIN_ONLY, requireRole } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { formatXaf, LEVEL_LABEL, SUBSCRIPTION_PRICE } from "@/lib/domain/pricing";
import { formatDateTime } from "@/lib/format";
import { GrantForm, ResetLinkPanel, RoleForm } from "./student-forms";

export const metadata: Metadata = { title: "Student" };

export default async function StudentPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole(ADMIN_ONLY);
  const { id } = await params;
  const user = await db.user.findUnique({
    where: { id },
    include: {
      subscriptions: { orderBy: { endsAt: "desc" } },
      payments: { orderBy: { createdAt: "desc" }, take: 20 },
      attempts: {
        orderBy: { startedAt: "desc" },
        take: 20,
        include: { test: { select: { id: true, title: true } } },
      },
    },
  });
  if (!user) notFound();
  const now = new Date();

  return (
    <div className="space-y-8">
      <div>
        <Breadcrumbs
          items={[{ label: "Students", href: "/admin/students" }, { label: user.name }]}
        />
        <PageHeader title={user.name}>
          {LEVEL_LABEL[user.level]} · {user.phone ?? "no phone"} · {user.email ?? "no email"}
          {user.school && ` · ${user.school}`} · joined {formatDateTime(user.createdAt)}
        </PageHeader>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="mb-1 font-semibold">Record a payment</h2>
          <p className="mb-4 text-sm text-slate-600">
            For payments taken by hand (cash or a direct MoMo transfer). Adds 30 days after any
            current subscription.
          </p>
          <GrantForm userId={user.id} level={user.level} prices={SUBSCRIPTION_PRICE} />
        </section>
        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="mb-4 font-semibold">Access</h2>
          <RoleForm key={user.role} userId={user.id} role={user.role} />
          <div className="mt-6 border-t border-slate-200 pt-5">
            <h3 className="mb-1 text-sm font-semibold">Forgotten password</h3>
            <p className="mb-3 text-sm text-slate-600">
              Check it is really the student (e.g. a call from their number), then send them a reset
              link.
            </p>
            <ResetLinkPanel userId={user.id} />
          </div>
        </section>
      </div>

      <section>
        <h2 className="mb-3 font-semibold">Subscriptions</h2>
        <table className={tableClass}>
          <thead>
            <tr>
              <th className={thClass}>Level</th>
              <th className={thClass}>From</th>
              <th className={thClass}>Until</th>
              <th className={thClass} />
            </tr>
          </thead>
          <tbody>
            {user.subscriptions.length === 0 && <EmptyRow colSpan={4}>Never subscribed.</EmptyRow>}
            {user.subscriptions.map((s) => (
              <tr key={s.id}>
                <td className={tdClass}>{LEVEL_LABEL[s.level]}</td>
                <td className={tdClass}>{formatDateTime(s.startsAt)}</td>
                <td className={tdClass}>{formatDateTime(s.endsAt)}</td>
                <td className={tdClass}>
                  {s.startsAt <= now && now < s.endsAt
                    ? "Active"
                    : s.startsAt > now
                      ? "Upcoming"
                      : "Ended"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="mb-3 font-semibold">Payments</h2>
        <table className={tableClass}>
          <thead>
            <tr>
              <th className={thClass}>Date</th>
              <th className={thClass}>For</th>
              <th className={thClass}>Amount</th>
              <th className={thClass}>Method</th>
              <th className={thClass}>Status</th>
            </tr>
          </thead>
          <tbody>
            {user.payments.length === 0 && <EmptyRow colSpan={5}>No payments.</EmptyRow>}
            {user.payments.map((p) => {
              const meta = (p.metadata ?? {}) as { reference?: string };
              return (
                <tr key={p.id}>
                  <td className={tdClass}>{formatDateTime(p.createdAt)}</td>
                  <td className={tdClass}>{p.purpose.replaceAll("_", " ").toLowerCase()}</td>
                  <td className={tdClass}>{formatXaf(p.amount)}</td>
                  <td className={tdClass}>
                    {p.provider}
                    {meta.reference && (
                      <span className="block text-xs text-slate-500">{meta.reference}</span>
                    )}
                  </td>
                  <td className={tdClass}>
                    <StatusBadge status={p.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="mb-3 font-semibold">Recent tests</h2>
        <table className={tableClass}>
          <thead>
            <tr>
              <th className={thClass}>Test</th>
              <th className={thClass}>Score</th>
              <th className={thClass}>Left page</th>
              <th className={thClass}>Status</th>
            </tr>
          </thead>
          <tbody>
            {user.attempts.length === 0 && <EmptyRow colSpan={4}>No tests taken.</EmptyRow>}
            {user.attempts.map((a) => (
              <tr key={a.id}>
                <td className={tdClass}>
                  <Link
                    href={`/admin/tests/${a.test.id}`}
                    className="text-brand-700 hover:underline"
                  >
                    {a.test.title}
                  </Link>
                </td>
                <td className={tdClass}>{a.score === null ? "–" : `${a.score}/${a.maxScore}`}</td>
                <td className={tdClass}>{a.focusLosses}</td>
                <td className={tdClass}>
                  <StatusBadge status={a.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
