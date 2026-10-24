import type { Metadata } from "next";
import Link from "next/link";
import { GcePricing, GceSteps } from "@/components/sections";
import { getCurrentUser, type CurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { formatXaf, LEVEL_LABEL, SUBSCRIPTION_PRICE } from "@/lib/domain/pricing";
import { formatDateTime } from "@/lib/format";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: site.gcePrep.name,
  description: `${site.gcePrep.slogan} ${site.gcePrep.tagline}`,
};

export default async function GcePage() {
  const user = await getCurrentUser();
  return user ? <GceHome user={user} /> : <GceIntro />;
}

/** For visitors: what GCEPrep237 is. */
function GceIntro() {
  return (
    <>
      <section className="bg-gradient-to-b from-brand-900 to-brand-700 text-white">
        <div className="mx-auto max-w-5xl px-4 py-14">
          <p className="text-sm font-semibold tracking-wide text-accent-500 uppercase">
            📚 {site.gcePrep.name}
          </p>
          <h1 className="mt-2 max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl">
            {site.gcePrep.slogan}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-brand-100">{site.gcePrep.tagline}</p>
          <Link
            href="/register?next=%2Fgce"
            className="mt-8 inline-block rounded-md bg-accent-500 px-5 py-3 font-semibold text-slate-900 hover:brightness-110"
          >
            Start revising free
          </Link>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="text-2xl font-bold">How it works</h2>
        <div className="mt-6">
          <GceSteps />
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-4 pb-16">
        <h2 className="text-2xl font-bold">Pricing</h2>
        <div className="mt-6">
          <GcePricing />
        </div>
      </section>
    </>
  );
}

/** For signed-in students: their GCE revision home. */
async function GceHome({ user }: { user: CurrentUser }) {
  const now = new Date();
  const [subscription, upcomingTests] = await Promise.all([
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
        <h1 className="text-2xl font-bold">{site.gcePrep.name}</h1>
        <p className="text-slate-600">
          {site.gcePrep.slogan} · {LEVEL_LABEL[user.level]}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/learn"
          className="rounded-lg border border-slate-200 bg-white p-5 hover:border-brand-600"
        >
          <span className="text-2xl" aria-hidden>
            📖
          </span>
          <span className="mt-1 block font-semibold">Revise</span>
          <span className="text-sm text-slate-600">Notes, practice and past papers</span>
        </Link>
        <Link
          href="/tests"
          className="rounded-lg border border-slate-200 bg-white p-5 hover:border-brand-600"
        >
          <span className="text-2xl" aria-hidden>
            ⏱️
          </span>
          <span className="mt-1 block font-semibold">Tests</span>
          <span className="text-sm text-slate-600">Weekly tests, results and prizes</span>
        </Link>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="font-semibold">Subscription</h2>
        {subscription ? (
          <p className="mt-1 text-sm text-slate-600">
            Active until {formatDateTime(subscription.endsAt)}.
          </p>
        ) : (
          <>
            <p className="mt-1 text-sm text-slate-600">
              You are on the free plan. Subscribe for{" "}
              <strong>{formatXaf(SUBSCRIPTION_PRICE[user.level])}/month</strong> to enter tests,
              unlock every solution, compete for prizes and read every opportunity.
            </p>
            <Link
              href="/checkout"
              className="mt-3 inline-block rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Subscribe with Mobile Money
            </Link>
          </>
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
    </div>
  );
}
