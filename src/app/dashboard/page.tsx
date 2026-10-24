import type { Metadata } from "next";
import Link from "next/link";
import { CategoryButtons } from "@/components/opportunities";
import { SectionTile } from "@/components/sections";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { LEVEL_LABEL } from "@/lib/domain/pricing";
import { formatDateTime } from "@/lib/format";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Home" };

export default async function DashboardPage() {
  const user = await requireUser();
  const now = new Date();

  const [subscription, nextTest] = await Promise.all([
    // Renewals start when the current period ends, so the latest end date is when access stops.
    db.subscription.findFirst({
      where: { userId: user.id, endsAt: { gt: now } },
      orderBy: { endsAt: "desc" },
      select: { endsAt: true, level: true },
    }),
    db.test.findFirst({
      where: { status: "SCHEDULED", closesAt: { gt: now }, subject: { level: user.level } },
      orderBy: { opensAt: "asc" },
      select: { title: true, opensAt: true, closesAt: true },
    }),
  ]);

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold">Welcome, {user.name.split(" ")[0]}</h1>
        <p className="text-slate-600">
          {site.slogan}.{" "}
          {subscription ? (
            <>Subscribed until {formatDateTime(subscription.endsAt)}.</>
          ) : (
            <Link href="/checkout" className="font-medium text-brand-700 underline">
              Subscribe to unlock everything
            </Link>
          )}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <SectionTile
          href="/gce"
          icon="📚"
          name={site.gcePrep.name}
          slogan={site.gcePrep.slogan}
          cta="Open"
          tone="brand"
        >
          {LEVEL_LABEL[user.level]} ·{" "}
          {nextTest
            ? nextTest.opensAt <= now
              ? `${nextTest.title} is open now, closes ${formatDateTime(nextTest.closesAt)}`
              : `Next: ${nextTest.title}, opens ${formatDateTime(nextTest.opensAt)}`
            : "Revise notes and past questions"}
        </SectionTile>
        <SectionTile
          href="/opportunities"
          icon="🌍"
          name={site.opportunities.name}
          slogan="Scholarships · Jobs · Travel · Finance · Careers"
          cta="Explore"
          tone="accent"
        >
          {site.opportunities.tagline}
        </SectionTile>
      </div>

      <section>
        <h2 className="mb-3 font-semibold">Opportunities</h2>
        <CategoryButtons compact />
      </section>
    </div>
  );
}
