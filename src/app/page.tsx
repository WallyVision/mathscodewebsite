import Link from "next/link";
import { CategoryButtons } from "@/components/opportunities";
import { GcePricing, GceSteps, SectionArt, SectionTile } from "@/components/sections";
import { db } from "@/lib/db";
import { FOUNDING, foundingProgress } from "@/lib/domain/founding";
import { formatXaf } from "@/lib/domain/pricing";
import { site } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <section className="bg-gradient-to-b from-slate-900 to-brand-900 text-white">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:py-20">
          <p className="text-sm font-semibold tracking-wide text-accent-500 uppercase">
            {site.name}
          </p>
          <h1 className="mt-2 max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl">
            {site.slogan}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-brand-100">{site.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/register"
              className="rounded-md bg-accent-500 px-5 py-3 font-semibold text-slate-900 hover:brightness-110"
            >
              Join free
            </Link>
            <Link
              href="/login"
              className="rounded-md border border-white/40 px-5 py-3 font-semibold hover:bg-white/10"
            >
              Log in
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-8 grid max-w-5xl gap-4 px-4 sm:grid-cols-2">
        <SectionTile
          href="/gce"
          icon={<SectionArt kind="books" />}
          name={site.gcePrep.name}
          slogan={site.gcePrep.slogan}
          cta="Open GCEPrep237"
          tone="brand"
        >
          {site.gcePrep.tagline}
        </SectionTile>
        <SectionTile
          href="/opportunities"
          icon={<SectionArt kind="world" />}
          name={site.opportunities.name}
          slogan="Scholarships · Jobs · Travel · Finance · Careers"
          cta="Explore opportunities"
          tone="accent"
        >
          {site.opportunities.tagline}
        </SectionTile>
      </section>

      <FoundingBanner />

      <section className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="text-2xl font-bold">
          {site.gcePrep.name}: {site.gcePrep.slogan}
        </h2>
        <div className="mt-6">
          <GceSteps />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-12">
        <h2 className="text-2xl font-bold">Opportunities</h2>
        <p className="mt-2 text-slate-600">
          Scholarships, jobs and guides for what comes next. Included with every membership.
        </p>
        <div className="mt-6">
          <CategoryButtons />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16">
        <h2 className="text-2xl font-bold">Simple monthly pricing</h2>
        <p className="mt-2 text-slate-600">
          Pay with MTN Mobile Money or Orange Money. No card needed.
        </p>
        <div className="mt-6">
          <GcePricing />
        </div>
      </section>
    </>
  );
}

/** Invites students to the founding offer while places remain. */
async function FoundingBanner() {
  const progress = foundingProgress(await db.foundingMember.count());
  if (progress.full) return null;
  return (
    <section className="mx-auto mt-6 max-w-5xl px-4">
      <Link
        href="/founding"
        className="flex flex-wrap items-center justify-between gap-3 rounded-xl border-2 border-accent-500 bg-amber-50 px-5 py-4 hover:bg-amber-100"
      >
        <span>
          <span className="block font-bold">Become a Founding Member</span>
          <span className="block text-sm text-slate-700">
            {formatXaf(FOUNDING.price)} once for {Math.round(FOUNDING.days / 30)} months of full
            membership at launch. {progress.left} of {FOUNDING.places} places left.
          </span>
        </span>
        <span className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white">
          See the offer
        </span>
      </Link>
    </section>
  );
}
