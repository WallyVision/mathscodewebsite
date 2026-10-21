import Link from "next/link";
import { formatXaf, LEVEL_LABEL, SUBSCRIPTION_PRICE } from "@/lib/domain/pricing";
import { site } from "@/lib/site";

const steps = [
  {
    title: "Revise for free",
    body: "Topic notes and GCE past questions with answers, open to every registered student.",
  },
  {
    title: "Take the weekly test",
    body: "Timed MCQ tests in Mathematics and Physics, marked instantly, with your rank on the leaderboard.",
  },
  {
    title: "Win prizes",
    body: "Top students each month win cash prizes, paid by Mobile Money.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="bg-gradient-to-b from-brand-900 to-brand-700 text-white">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:py-24">
          <h1 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl">
            Revise smarter for your GCE. Compete every week.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-brand-100">{site.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/register"
              className="rounded-md bg-accent-500 px-5 py-3 font-semibold text-slate-900 hover:brightness-110"
            >
              Start revising free
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

      <section className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="text-2xl font-bold">How it works</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-3">
          {steps.map((step, i) => (
            <li key={step.title} className="rounded-lg border border-slate-200 bg-white p-5">
              <span className="text-sm font-semibold text-brand-600">Step {i + 1}</span>
              <h3 className="mt-1 font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16">
        <h2 className="text-2xl font-bold">Simple monthly pricing</h2>
        <p className="mt-2 text-slate-600">
          Pay with MTN Mobile Money or Orange Money. No card needed.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {(["O_LEVEL", "A_LEVEL"] as const).map((level) => (
            <div key={level} className="rounded-lg border border-slate-200 bg-white p-6">
              <h3 className="font-semibold">{LEVEL_LABEL[level]}</h3>
              <p className="mt-2 text-3xl font-bold">
                {formatXaf(SUBSCRIPTION_PRICE[level])}
                <span className="text-base font-normal text-slate-500"> / month</span>
              </p>
              <ul className="mt-4 space-y-1 text-sm text-slate-600">
                <li>✓ All weekly and monthly tests</li>
                <li>✓ Every worked solution</li>
                <li>✓ Leaderboard and monthly prizes</li>
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
