import type { Level } from "@prisma/client";
import Link from "next/link";
import { checkoutPath } from "@/lib/domain/checkout";
import { EXTRA_SUBJECT_PRICE, formatXaf, SUBSCRIPTION_PRICE } from "@/lib/domain/pricing";

/**
 * Shown where a student cannot sit a subject's competitive tests yet. Members
 * add the subject as an extra; everyone else becomes a member with this
 * subject as the one included.
 */
export function EnterCompetition({
  subject,
  isMember,
  returnTo,
}: {
  subject: { id: string; name: string; level: Level };
  isMember: boolean;
  returnTo?: string;
}) {
  const product = isMember
    ? ({ kind: "COMPETITION_ENTRY", level: subject.level, subjectId: subject.id } as const)
    : ({ kind: "SUBSCRIPTION", level: subject.level, subjectId: subject.id } as const);
  return (
    <div className="rounded-lg border border-amber-300 bg-amber-50 p-5 text-sm text-amber-900">
      <p className="font-semibold">Enter the {subject.name} competition to take this test</p>
      <p className="mt-1">
        {isMember
          ? `Add ${subject.name} to your membership for ${formatXaf(EXTRA_SUBJECT_PRICE[subject.level])} for 30 days: its weekly tests, leaderboard and monthly prizes.`
          : `Membership costs ${formatXaf(SUBSCRIPTION_PRICE[subject.level])} a month: every note and worked solution, scholarships and jobs, and the ${subject.name} competition with its monthly prizes.`}
      </p>
      <Link
        href={checkoutPath(product, returnTo)}
        className="mt-3 inline-block rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
      >
        {isMember ? `Enter ${subject.name}` : "Become a member"}
      </Link>
    </div>
  );
}
