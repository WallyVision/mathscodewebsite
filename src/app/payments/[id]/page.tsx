import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { checkoutPath, productFromPayment, safeReturnPath } from "@/lib/domain/checkout";
import { formatXaf, LEVEL_LABEL } from "@/lib/domain/pricing";
import { formatDateTime } from "@/lib/format";
import { refreshPayment } from "@/lib/payments/service";
import { PaymentPoller } from "./payment-status";

export const metadata: Metadata = { title: "Payment" };

export default async function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  let payment = await db.payment.findUnique({ where: { id } });
  if (!payment || payment.userId !== user.id) notFound();
  if (payment.status === "PENDING") {
    payment = (await refreshPayment(payment.id).catch(() => payment)) ?? payment;
  }

  const meta = (payment.metadata ?? {}) as {
    ussdCode?: string | null;
    operator?: string | null;
    returnTo?: string;
  };
  const product = productFromPayment(payment.purpose, payment.metadata);
  const returnTo = safeReturnPath(meta.returnTo ?? "");
  const grantsCompetition =
    product?.kind === "SUBSCRIPTION" || product?.kind === "COMPETITION_ENTRY";
  const [subscription, entry] =
    payment.status === "SUCCESSFUL" && grantsCompetition
      ? await Promise.all([
          db.subscription.findFirst({ where: { paymentId: payment.id }, select: { endsAt: true } }),
          db.competitionEntry.findFirst({
            where: { paymentId: payment.id },
            select: { endsAt: true, subject: { select: { name: true } } },
          }),
        ])
      : [null, null];

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      {payment.status === "PENDING" && (
        <>
          <h1 className="text-2xl font-bold">Confirm on your phone</h1>
          <p className="mt-3 text-slate-700">
            A Mobile Money prompt for <strong>{formatXaf(payment.amount)}</strong> has been sent to{" "}
            <strong>{payment.payerPhone}</strong>. Enter your PIN to confirm.
          </p>
          {meta.ussdCode && (
            <p className="mt-3 rounded-md bg-amber-50 px-4 py-3 text-sm text-amber-900">
              No prompt? Dial <strong className="font-mono">{meta.ussdCode}</strong> to approve the
              payment
              {meta.operator ? ` on ${meta.operator}` : ""}.
            </p>
          )}
          <div className="mt-6">
            <PaymentPoller paymentId={payment.id} />
          </div>
          <p className="mt-6 text-xs text-slate-500">
            You can leave this page; your access is activated as soon as the payment is confirmed.
          </p>
        </>
      )}

      {payment.status === "SUCCESSFUL" && (
        <>
          <h1 className="text-2xl font-bold text-emerald-700">Payment received ✓</h1>
          <p className="mt-3 text-slate-700">
            Thank you! {formatXaf(payment.amount)} paid
            {payment.completedAt && ` on ${formatDateTime(payment.completedAt)}`}.
          </p>
          {product?.kind === "SUBSCRIPTION" && (
            <p className="mt-2 text-slate-700">
              Your {LEVEL_LABEL[product.level]} membership is active
              {subscription && ` until ${formatDateTime(subscription.endsAt)}`}
              {entry && `, with ${entry.subject.name} as your competition subject`}.
            </p>
          )}
          {product?.kind === "COMPETITION_ENTRY" && entry && (
            <p className="mt-2 text-slate-700">
              You are entered in {entry.subject.name} until {formatDateTime(entry.endsAt)}.
            </p>
          )}
          {(product?.kind === "QUESTION_SOLUTION" || product?.kind === "PAPER_SOLUTIONS") && (
            <p className="mt-2 text-slate-700">
              The worked solution{product.kind === "PAPER_SOLUTIONS" && "s"} are now unlocked.
            </p>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            {returnTo && (
              <Link
                href={returnTo}
                className="rounded-md bg-brand-600 px-4 py-2 font-semibold text-white hover:bg-brand-700"
              >
                Continue
              </Link>
            )}
            <Link
              href={grantsCompetition ? "/tests" : "/learn"}
              className="rounded-md border border-slate-300 bg-white px-4 py-2 font-medium"
            >
              {grantsCompetition ? "Go to tests" : "Keep revising"}
            </Link>
          </div>
        </>
      )}

      {payment.status === "FAILED" && (
        <>
          <h1 className="text-2xl font-bold text-red-700">Payment not completed</h1>
          <p className="mt-3 text-slate-700">
            {payment.failureReason ?? "The payment did not go through."}
          </p>
          <p className="mt-2 text-sm text-slate-600">
            No money was taken unless your Mobile Money account shows it. If it does, contact us
            with this reference: <span className="font-mono">{payment.id}</span>
          </p>
          <Link
            href={product ? checkoutPath(product, returnTo ?? undefined) : "/checkout"}
            className="mt-6 inline-block rounded-md bg-brand-600 px-4 py-2 font-semibold text-white hover:bg-brand-700"
          >
            Try again
          </Link>
        </>
      )}
    </div>
  );
}
