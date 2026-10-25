import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { formatWhatsApp, supportEmail, supportWhatsApp, whatsAppLink } from "@/lib/support";

export const metadata: Metadata = { title: "Contact us" };

export default function ContactPage() {
  const whatsapp = supportWhatsApp();
  const email = supportEmail();
  const { name, rccm, city } = site.operator;
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold">Contact us</h1>
      <p className="mt-2 text-slate-600">
        Questions about your account, a payment, a test or a prize? We are happy to help.
      </p>

      <div className="mt-6 space-y-4">
        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="font-semibold">WhatsApp (fastest)</h2>
          <p className="mt-1 text-sm text-slate-600">
            {formatWhatsApp(whatsapp)}. Write from the phone number on your account so we can find
            it quickly.
          </p>
          <a
            href={whatsAppLink(whatsapp, `Hello ${site.name}, `)}
            className="mt-3 inline-block rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Chat on WhatsApp
          </a>
        </section>

        {email && (
          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="font-semibold">Email</h2>
            <a href={`mailto:${email}`} className="mt-1 block text-sm text-brand-700 underline">
              {email}
            </a>
          </section>
        )}

        <section className="rounded-lg border border-slate-200 bg-white p-5 text-sm">
          <h2 className="font-semibold">When writing about a payment</h2>
          <p className="mt-1 text-slate-600">
            Include the date, the amount, the Mobile Money number used and the transaction reference
            from your Mobile Money SMS. See the{" "}
            <Link href="/refunds" className="text-brand-700 underline">
              Refund Policy
            </Link>
            .
          </p>
        </section>

        <section className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          <h2 className="font-semibold">Beware of scams</h2>
          <p className="mt-1">
            We never ask for your Mobile Money PIN or your password, and we never ask for money to
            get you a scholarship, job or visa. Report anyone who does to us on WhatsApp.
          </p>
        </section>
      </div>

      <p className="mt-8 text-sm text-slate-500">
        {name}
        {rccm ? ` · RCCM ${rccm}` : ""} · {city}
      </p>
    </div>
  );
}
