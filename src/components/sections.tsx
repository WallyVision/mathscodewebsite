import Link from "next/link";
import type { ReactNode } from "react";
import {
  formatXaf,
  LEVEL_LABEL,
  EXTRA_SUBJECT_PRICE,
  SUBSCRIPTION_PRICE,
} from "@/lib/domain/pricing";
import { site } from "@/lib/site";

const ART = {
  books: {
    src: "/illustrations/open-books.svg",
    alt: "Three open books in green, red and yellow, with a pen",
    width: 260,
    height: 120,
    className: "h-28 sm:h-32",
  },
  world: {
    src: "/illustrations/globe-to-the-world.svg",
    alt: "Globe showing Africa with Cameroon in its flag colours, and arrows to the rest of the world",
    width: 260,
    height: 170,
    className: "h-36 sm:h-40",
  },
} as const;

/** The picture on a section tile: open books for GCE Prep, the globe with Cameroon for Opportunities. */
export function SectionArt({ kind }: { kind: keyof typeof ART }) {
  const art = ART[kind];
  return (
    // Both pictures get the same space, so the tiles' titles line up.
    <div className="flex h-36 items-center justify-center sm:h-40">
      {/* eslint-disable-next-line @next/next/no-img-element -- small static SVG with its own animation */}
      <img
        src={art.src}
        alt={art.alt}
        width={art.width}
        height={art.height}
        className={`w-auto ${art.className}`}
      />
    </div>
  );
}

/** One of the platform's two big sections. */
export function SectionTile({
  href,
  icon,
  name,
  slogan,
  children,
  cta,
  tone,
}: {
  href: string;
  /** An emoji, or a picture such as <SectionArt />. */
  icon: ReactNode;
  name: string;
  slogan: string;
  children?: ReactNode;
  cta: string;
  tone: "brand" | "accent";
}) {
  const styles =
    tone === "brand"
      ? "from-brand-700 to-brand-900 text-white"
      : "from-emerald-600 to-emerald-800 text-white";
  return (
    <Link
      href={href}
      className={`group flex flex-col rounded-2xl bg-gradient-to-br p-6 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg ${styles}`}
    >
      {typeof icon === "string" ? (
        <span className="text-4xl" aria-hidden>
          {icon}
        </span>
      ) : (
        icon
      )}
      <span className="mt-3 text-2xl font-bold">{name}</span>
      <span className="mt-1 font-medium text-white/90">{slogan}</span>
      {children && <div className="mt-3 text-sm text-white/85">{children}</div>}
      <span className="mt-5 inline-flex w-fit items-center gap-1 rounded-md bg-white/15 px-4 py-2 text-sm font-semibold group-hover:bg-white/25">
        {cta} →
      </span>
    </Link>
  );
}

export function GcePricing() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {(["O_LEVEL", "A_LEVEL"] as const).map((level) => (
        <div key={level} className="rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="font-semibold">
            {site.gcePrep.name} {LEVEL_LABEL[level]}
          </h3>
          <p className="mt-2 text-3xl font-bold">
            {formatXaf(SUBSCRIPTION_PRICE[level])}
            <span className="text-base font-normal text-slate-500"> / month</span>
          </p>
          <ul className="mt-4 space-y-1 text-sm text-slate-600">
            <li>✓ Every note, past question and worked solution</li>
            <li>✓ All scholarships, jobs and career guides</li>
            <li>✓ One competition subject: weekly tests and monthly prizes</li>
            <li>✓ More subjects: {formatXaf(EXTRA_SUBJECT_PRICE[level])} each</li>
          </ul>
          <Link
            href={`/checkout?plan=${level}`}
            className="mt-5 inline-block rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Become a member
          </Link>
        </div>
      ))}
    </div>
  );
}

const STEPS = [
  {
    title: "Revise for free",
    body: "Topic notes and GCE past questions with answers, open to every registered student.",
  },
  {
    title: "Compete in your subjects",
    body: "Choose your competition subjects and sit their timed weekly tests, marked instantly, with your rank on each subject's leaderboard.",
  },
  {
    title: "Win prizes",
    body: "The top students in each subject win cash prizes every month, paid by Mobile Money.",
  },
];

export function GceSteps() {
  return (
    <ol className="grid gap-4 sm:grid-cols-3">
      {STEPS.map((step, i) => (
        <li key={step.title} className="rounded-lg border border-slate-200 bg-white p-5">
          <span className="text-sm font-semibold text-brand-600">Step {i + 1}</span>
          <h3 className="mt-1 font-semibold">{step.title}</h3>
          <p className="mt-2 text-sm text-slate-600">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}
