import type { ReactNode } from "react";
import { site } from "@/lib/site";
import { CameroonFlag, FlagStripe } from "./brand";

const BENEFITS = [
  {
    icon: "📘",
    title: "Revise smarter",
    text: "Notes and GCE past papers with step-by-step solutions.",
  },
  { icon: "🏆", title: "Compete and win", text: "Weekly timed tests and monthly cash prizes." },
  { icon: "🎓", title: "Open doors", text: "Scholarships, jobs and career guidance." },
];

/** The frame of the log in and sign up pages: a welcome panel beside the form card. */
export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="relative isolate overflow-hidden bg-gradient-to-br from-slate-900 via-brand-900 to-brand-700 lg:flex lg:min-h-[calc(100dvh-10.5rem)] lg:items-center">
      {/* Soft glows in the flag's colours. */}
      <div className="pointer-events-none absolute -top-24 -left-24 -z-10 h-72 w-72 rounded-full bg-cm-green/30 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-20 -z-10 h-72 w-72 rounded-full bg-cm-red/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-1/3 -z-10 h-72 w-72 rounded-full bg-cm-yellow/20 blur-3xl" />

      <div className="mx-auto grid w-full max-w-5xl items-center gap-6 px-4 py-8 sm:gap-8 sm:py-16 lg:grid-cols-2 lg:gap-14">
        <section className="text-white">
          <div className="hidden items-center gap-3 sm:flex">
            <CameroonFlag className="h-6 w-9" />
            <span className="text-sm font-semibold tracking-wide text-brand-100 uppercase">
              {site.name}
            </span>
          </div>
          <p className="text-2xl leading-tight font-bold sm:mt-4 sm:text-4xl">
            <span className="italic">“{site.slogan}”</span>
          </p>
          <p className="mt-2 max-w-md text-sm text-brand-100 sm:mt-3 sm:text-base">
            {site.tagline}
          </p>
          <ul className="mt-8 hidden space-y-4 lg:block">
            {BENEFITS.map((b) => (
              <li key={b.title} className="flex gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-xl ring-1 ring-white/15">
                  {b.icon}
                </span>
                <span>
                  <span className="block font-semibold">{b.title}</span>
                  <span className="text-sm text-brand-100">{b.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
          <FlagStripe className="h-1.5" />
          <div className="p-6 sm:p-8">
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            {subtitle && <div className="mt-1 text-sm text-slate-600">{subtitle}</div>}
            <div className="mt-6">{children}</div>
          </div>
        </section>
      </div>
    </div>
  );
}
