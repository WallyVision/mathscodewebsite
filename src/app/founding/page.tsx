import type { Metadata } from "next";
import Link from "next/link";
import { FlagStripe } from "@/components/brand";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { FOUNDING, foundingProgress } from "@/lib/domain/founding";
import { formatXaf, SUBSCRIPTION_DAYS, SUBSCRIPTION_PRICE } from "@/lib/domain/pricing";
import { site } from "@/lib/site";
import { formatWhatsApp, supportWhatsApp, whatsAppLink } from "@/lib/support";

export const metadata: Metadata = {
  title: "Founding Members",
  description: `Be one of the first ${FOUNDING.places} members of ${site.name}. Pay ${FOUNDING.price} FCFA once and get ${FOUNDING.days} days of full membership at launch.`,
};

export const dynamic = "force-dynamic";

const months = Math.round(FOUNDING.days / SUBSCRIPTION_DAYS);

export default async function FoundingPage() {
  const user = await getCurrentUser();
  const [taken, mine] = await Promise.all([
    db.foundingMember.count(),
    user
      ? db.foundingMember.findUnique({
          where: { userId: user.id },
          select: { number: true, activatedAt: true, subject: { select: { name: true } } },
        })
      : null,
  ]);
  const progress = foundingProgress(taken);
  const whatsapp = supportWhatsApp();
  const account = user ? (user.phone ?? user.email ?? user.name) : null;
  const message = account
    ? `Hello ${site.name}, I want to become a Founding Member. My account is ${account}.`
    : `Hello ${site.name}, I want to become a Founding Member.`;
  const normalPrice = months * SUBSCRIPTION_PRICE.O_LEVEL;

  return (
    <>
      <section className="bg-gradient-to-b from-slate-900 to-brand-900 text-white">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
          <p className="text-sm font-semibold tracking-wide text-accent-500 uppercase">
            Limited to {FOUNDING.places} students
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">
            Become a Founding Member
          </h1>
          <p className="mt-4 max-w-xl text-lg text-brand-100">
            Help {site.name} launch. Pay {formatXaf(FOUNDING.price)} once and get {months} months of
            full membership from launch day, with your founding number for life.
          </p>

          <div className="mt-8 rounded-xl bg-white/10 p-5">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-2xl font-bold">
                {progress.taken} <span className="text-base font-medium">of {FOUNDING.places}</span>
              </p>
              <p className="text-sm text-brand-100">
                {progress.full
                  ? "All places are taken"
                  : `${progress.left} ${progress.left === 1 ? "place" : "places"} left`}
              </p>
            </div>
            <div
              className="mt-3 h-4 overflow-hidden rounded-full bg-white/20"
              role="progressbar"
              aria-label="Founding places taken"
              aria-valuemin={0}
              aria-valuemax={FOUNDING.places}
              aria-valuenow={progress.taken}
            >
              <div
                className="h-full rounded-full bg-accent-500"
                style={{ width: `${Math.max(progress.percent, progress.taken > 0 ? 3 : 0)}%` }}
              />
            </div>
            <p className="mt-3 text-sm text-brand-100">
              {formatXaf(progress.raised)} raised of {formatXaf(progress.goal)}, to register the
              business and open Mobile Money payments on the site.
            </p>
          </div>
        </div>
        <FlagStripe />
      </section>

      <div className="mx-auto max-w-3xl space-y-10 px-4 py-10">
        {mine && (
          <section className="rounded-xl border-2 border-accent-500 bg-amber-50 p-5">
            <p className="text-sm font-semibold tracking-wide text-amber-800 uppercase">
              Thank you, {user?.name.split(" ")[0]}
            </p>
            <p className="mt-1 text-2xl font-bold">You are Founding Member #{mine.number}</p>
            <p className="mt-1 text-slate-700">
              {mine.activatedAt
                ? `Your membership has started, with ${mine.subject.name} as your competition subject.`
                : `Your ${months} months of membership, with ${mine.subject.name} as your competition subject, start on launch day. Turn on notifications in your account so you hear first.`}
            </p>
          </section>
        )}

        <section>
          <h2 className="text-2xl font-bold">What you get</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              [
                `${months} months of full membership`,
                `${FOUNDING.days} days from launch day. The normal price is ${formatXaf(normalPrice)} or more.`,
              ],
              [
                "Everything on the site",
                "GCE past questions with step-by-step solutions, notes, and every Opportunities article.",
              ],
              ["One competition subject", "Sit its weekly tests and compete for the cash prizes."],
              [
                "Your founding number",
                `A number from 1 to ${FOUNDING.places}, shown on your account. Only the first ${FOUNDING.places} students ever get one.`,
              ],
            ].map(([title, text]) => (
              <li key={title} className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="font-semibold">{title}</p>
                <p className="mt-1 text-sm text-slate-600">{text}</p>
              </li>
            ))}
          </ul>
        </section>

        {!mine && (
          <section>
            <h2 className="text-2xl font-bold">How to join</h2>
            {progress.full ? (
              <p className="mt-3 text-slate-700">
                All {FOUNDING.places} founding places are taken. Thank you! You can still{" "}
                <Link href="/register" className="text-brand-700 underline">
                  join free
                </Link>{" "}
                and become a member at launch.
              </p>
            ) : (
              <>
                <ol className="mt-4 space-y-3">
                  <li className="rounded-lg border border-slate-200 bg-white p-4">
                    <p className="font-semibold">1. Create your free account</p>
                    <p className="mt-1 text-sm text-slate-600">
                      {user ? (
                        <>Done. You are signed in as {user.name}.</>
                      ) : (
                        <>
                          <Link
                            href="/register?next=%2Ffounding"
                            className="text-brand-700 underline"
                          >
                            Sign up here
                          </Link>{" "}
                          with your name and phone number. It takes one minute.
                        </>
                      )}
                    </p>
                  </li>
                  <li className="rounded-lg border border-slate-200 bg-white p-4">
                    <p className="font-semibold">2. Message us on WhatsApp</p>
                    <p className="mt-1 text-sm text-slate-600">
                      Tell us you want to be a Founding Member. We reply with how to pay{" "}
                      {formatXaf(FOUNDING.price)} by Mobile Money, and ask which subject you want to
                      compete in.
                    </p>
                  </li>
                  <li className="rounded-lg border border-slate-200 bg-white p-4">
                    <p className="font-semibold">3. Get your founding number</p>
                    <p className="mt-1 text-sm text-slate-600">
                      Once we see your payment, your number appears on this page and on your
                      account.
                    </p>
                  </li>
                </ol>
                <a
                  href={whatsAppLink(whatsapp, message)}
                  className="mt-5 inline-block rounded-md bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700"
                >
                  Message us on WhatsApp
                </a>
                <p className="mt-2 text-sm text-slate-600">
                  WhatsApp: {formatWhatsApp(whatsapp)}. Only pay to the number we give you in that
                  chat.
                </p>
              </>
            )}
          </section>
        )}

        <section>
          <h2 className="text-2xl font-bold">Questions</h2>
          <dl className="mt-4 space-y-4">
            <div>
              <dt className="font-semibold">When does my membership start?</dt>
              <dd className="mt-1 text-sm text-slate-600">
                On launch day, for every Founding Member at the same time. You lose no days by
                joining early. Until then you can already revise for free with your account.
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Is this a share in the business?</dt>
              <dd className="mt-1 text-sm text-slate-600">
                No. A founding membership is an early membership at a special price. It is not a
                share or an investment, and it pays no profit.
              </dd>
            </div>
            <div>
              <dt className="font-semibold">What is the money used for?</dt>
              <dd className="mt-1 text-sm text-slate-600">
                To register the business and complete what is needed to accept Mobile Money payments
                directly on the site.
              </dd>
            </div>
            <div>
              <dt className="font-semibold">What happens after my {months} months?</dt>
              <dd className="mt-1 text-sm text-slate-600">
                You can continue with a normal membership ({formatXaf(SUBSCRIPTION_PRICE.O_LEVEL)} a
                month for O Level, {formatXaf(SUBSCRIPTION_PRICE.A_LEVEL)} for A Level). You keep
                your founding number.
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </>
  );
}
