import type { Metadata } from "next";
import Link from "next/link";
import { CategoryButtons } from "@/components/opportunities";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { formatXaf, LEVEL_LABEL, SUBSCRIPTION_PRICE } from "@/lib/domain/pricing";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const user = await requireUser();
  const now = new Date();

  const [subscription, upcomingTests] = await Promise.all([
    // Renewals start when the current period ends, so the latest end date is when access stops.
    db.subscription.findFirst({
      where: { userId: user.id, level: user.level, endsAt: { gt: now } },
      orderBy: { endsAt: "desc" },
      select: { endsAt: true },
    }),
    db.test.findMany({
      where: { status: "SCHEDULED", closesAt: { gt: now }, subject: { level: user.level } },
      orderBy: { opensAt: "asc" },
      take: 5,
      select: {
        id: true,
        title: true,
        opensAt: true,
        closesAt: true,
        durationMinutes: true,
        subject: { select: { name: true } },
      },
    }),
  ]);

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold">Welcome, {user.name.split(" ")[0]}</h1>
        <p className="text-slate-600">{LEVEL_LABEL[user.level]}</p>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="font-semibold">Subscription</h2>
        {subscription ? (
          <p className="mt-1 text-sm text-slate-600">
            Active until {formatDateTime(subscription.endsAt)}.
          </p>
        ) : (
          <p className="mt-1 text-sm text-slate-600">
            You are on the free plan. Subscribe for{" "}
            <strong>{formatXaf(SUBSCRIPTION_PRICE[user.level])}/month</strong> to enter tests,
            unlock every solution and compete for prizes.
          </p>
        )}
        {!subscription && (
          <Link
            href="/checkout"
            className="mt-3 inline-block rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Subscribe with Mobile Money
          </Link>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-semibold">Upcoming tests</h2>
        {upcomingTests.length === 0 ? (
          <p className="text-sm text-slate-600">No tests scheduled yet. Check back soon.</p>
        ) : (
          <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
            {upcomingTests.map((test) => (
              <li key={test.id}>
                <Link href={`/tests/${test.id}`} className="block p-4 hover:bg-slate-50">
                  <p className="font-medium">{test.title}</p>
                  <p className="text-sm text-slate-600">
                    {test.subject.name} · {test.durationMinutes} min · opens{" "}
                    {formatDateTime(test.opensAt)}, closes {formatDateTime(test.closesAt)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="font-semibold">Beyond the GCE</h2>
          <Link href="/opportunities" className="text-sm text-brand-700 hover:underline">
            See all
          </Link>
        </div>
        <CategoryButtons compact />
      </section>
    </div>
  );
}
