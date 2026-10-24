import type { Metadata } from "next";
import Link from "next/link";
import { logout } from "@/app/(auth)/actions";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { formatXaf, LEVEL_LABEL } from "@/lib/domain/pricing";
import { formatDateTime } from "@/lib/format";
import { PasswordForm } from "./password-form";

export const metadata: Metadata = { title: "Account" };

export default async function AccountPage() {
  const user = await requireUser();
  const now = new Date();
  const [periods, payments] = await Promise.all([
    db.subscription.findMany({
      where: { userId: user.id, endsAt: { gt: now } },
      orderBy: { endsAt: "asc" },
      select: { level: true, endsAt: true },
    }),
    db.payment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { id: true, amount: true, status: true, purpose: true, createdAt: true },
    }),
  ]);

  // Early renewals create back-to-back periods; show each level once, with its final end date.
  const subscriptions = [...new Map(periods.map((p) => [p.level, p])).values()];

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
        <h2 className="font-semibold">Subscription</h2>
        {subscriptions.length === 0 ? (
          <p className="mt-1 text-sm text-slate-600">
            No active subscription.{" "}
            <Link href="/checkout" className="text-brand-700 underline">
              Subscribe
            </Link>
          </p>
        ) : (
          subscriptions.map((s) => (
            <p key={s.level} className="mt-1 text-sm text-slate-600">
              {LEVEL_LABEL[s.level]}: active until {formatDateTime(s.endsAt)}.{" "}
              <Link href={`/checkout?plan=${s.level}`} className="text-brand-700 underline">
                Renew early
              </Link>
            </p>
          ))
        )}
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
                  {formatDateTime(p.createdAt)} ·{" "}
                  {p.purpose === "SUBSCRIPTION" ? "Subscription" : "Solution unlock"}
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
