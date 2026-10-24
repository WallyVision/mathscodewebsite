import type { Metadata } from "next";
import Link from "next/link";
import { Markdown } from "@/components/markdown";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { productAmount, safeReturnPath, type Product } from "@/lib/domain/checkout";
import { formatXaf, LEVEL_LABEL } from "@/lib/domain/pricing";
import { formatDateTime } from "@/lib/format";
import { getPaymentProvider } from "@/lib/payments/campay";
import { site } from "@/lib/site";
import { CheckoutForm } from "./checkout-form";

export const metadata: Metadata = { title: "Checkout" };

interface Props {
  searchParams: Promise<{ plan?: string; question?: string; paper?: string; returnTo?: string }>;
}

export default async function CheckoutPage({ searchParams }: Props) {
  const user = await requireUser();
  const params = await searchParams;
  const returnTo = safeReturnPath(params.returnTo ?? "") ?? "";

  let product: Product;
  let title: string;
  let details: string[];
  let hidden: Record<string, string>;
  let preview: string | null = null;

  if (params.question) {
    const q = await db.question.findUnique({
      where: { id: params.question },
      select: { id: true, stem: true, subject: { select: { name: true, level: true } } },
    });
    if (!q) return <NotFound />;
    product = { kind: "QUESTION_SOLUTION", questionId: q.id };
    title = "Unlock one worked solution";
    details = [`${LEVEL_LABEL[q.subject.level]} ${q.subject.name}`];
    preview = q.stem;
    hidden = { kind: product.kind, questionId: q.id };
  } else if (params.paper) {
    const paper = await db.pastPaper.findUnique({
      where: { id: params.paper },
      select: { id: true, title: true, subject: { select: { name: true, level: true } } },
    });
    if (!paper) return <NotFound />;
    product = { kind: "PAPER_SOLUTIONS", pastPaperId: paper.id };
    title = "Unlock every solution in a past paper";
    details = [
      `${LEVEL_LABEL[paper.subject.level]} ${paper.subject.name}`,
      paper.title,
      "Yours to keep",
    ];
    hidden = { kind: product.kind, pastPaperId: paper.id };
  } else {
    const level = params.plan === "A_LEVEL" || params.plan === "O_LEVEL" ? params.plan : user.level;
    product = { kind: "SUBSCRIPTION", level };
    const current = await db.subscription.findFirst({
      where: { userId: user.id, level, endsAt: { gt: new Date() } },
      orderBy: { endsAt: "desc" },
      select: { endsAt: true },
    });
    title = `${site.gcePrep.name} ${LEVEL_LABEL[level]}: 30 days`;
    details = [
      "Every weekly and monthly test",
      "Every worked solution",
      "Leaderboard and monthly cash prizes",
      "Scholarships, jobs, travel, finance and career guides",
      ...(current
        ? [`Adds 30 days after your current subscription ends (${formatDateTime(current.endsAt)})`]
        : []),
    ];
    hidden = { kind: product.kind, level };
  }

  const amount = productAmount(product);
  const available = getPaymentProvider() !== null;

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-bold">{title}</h1>
      <ul className="mt-3 space-y-1 text-sm text-slate-700">
        {details.map((d) => (
          <li key={d}>• {d}</li>
        ))}
      </ul>
      {preview && (
        <div className="mt-3 line-clamp-4 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm">
          <Markdown>{preview}</Markdown>
        </div>
      )}
      <p className="mt-5 text-3xl font-bold">{formatXaf(amount)}</p>

      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
        {available ? (
          <CheckoutForm
            hidden={{ ...hidden, ...(returnTo ? { returnTo } : {}) }}
            defaultPhone={user.phone?.replace(/^\+237/, "") ?? ""}
            amountLabel={formatXaf(amount)}
          />
        ) : (
          <p className="text-sm text-slate-700">
            Online payment is not available yet. Please check back soon.
          </p>
        )}
      </div>
      <p className="mt-4 text-center text-xs text-slate-500">
        Secure payment by Mobile Money via CamPay.
      </p>
      {returnTo && (
        <p className="mt-2 text-center text-sm">
          <Link href={returnTo} className="text-brand-700 hover:underline">
            ← Back
          </Link>
        </p>
      )}
    </div>
  );
}

function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <p className="text-slate-700">This item is no longer available.</p>
    </div>
  );
}
