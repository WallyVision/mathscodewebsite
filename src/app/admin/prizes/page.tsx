import type { Metadata } from "next";
import Link from "next/link";
import {
  EmptyRow,
  PageHeader,
  StatusBadge,
  tableClass,
  tdClass,
  thClass,
} from "@/components/admin";
import { loadMonthlyPrizes } from "@/lib/admin/prizes";
import { ADMIN_ONLY, requireRole } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { periodOf, previousPeriod } from "@/lib/domain/period";
import { DEFAULT_PRIZE_POLICY } from "@/lib/domain/prizes";
import { DEFAULT_REVENUE_POLICY } from "@/lib/domain/revenue";
import { formatXaf, LEVEL_LABEL } from "@/lib/domain/pricing";
import { formatDateTime, formatSeconds } from "@/lib/format";
import { AwardActions, CreateAwardsButton, DiscardAwardsButton } from "./prize-buttons";

export const metadata: Metadata = { title: "Prizes" };

const SHOWN_STANDINGS = 20;

interface Props {
  searchParams: Promise<{ period?: string; subject?: string }>;
}

export default async function PrizesPage({ searchParams }: Props) {
  await requireRole(ADMIN_ONLY);
  const params = await searchParams;
  const subjects = await db.subject.findMany({
    orderBy: [{ level: "asc" }, { name: "asc" }],
    select: { id: true, name: true, level: true },
  });
  // Default to last month: the most recent month whose prizes can be awarded.
  const period = params.period ?? previousPeriod(periodOf(new Date()));
  const subjectId = params.subject ?? subjects[0]?.id ?? "";
  const data = subjectId ? await loadMonthlyPrizes(period, subjectId) : null;
  const { minimumPool, placeShares, bestTests } = DEFAULT_PRIZE_POLICY;
  const { prizeShare } = DEFAULT_REVENUE_POLICY;

  return (
    <div className="space-y-8">
      <PageHeader title="Monthly prizes">
        Pool per subject: {prizeShare * 100}% of the subject&apos;s income from competition entries
        after payment fees, at least {formatXaf(minimumPool)}. Split{" "}
        {placeShares.map((s) => `${s * 100}%`).join(" / ")}. Each student&apos;s best {bestTests}{" "}
        tests of the month count; students who sat fewer are not eligible.
      </PageHeader>

      <form className="flex flex-wrap items-end gap-2 text-sm">
        <label className="space-y-1">
          <span className="block font-medium text-slate-700">Month</span>
          <input
            type="month"
            name="period"
            defaultValue={period}
            className="rounded-md border border-slate-300 bg-white px-2 py-1.5"
          />
        </label>
        <label className="space-y-1">
          <span className="block font-medium text-slate-700">Subject</span>
          <select
            name="subject"
            defaultValue={subjectId}
            className="rounded-md border border-slate-300 bg-white px-2 py-1.5"
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {LEVEL_LABEL[s.level]} {s.name}
              </option>
            ))}
          </select>
        </label>
        <button className="rounded-md bg-slate-800 px-3 py-1.5 font-medium text-white">Show</button>
      </form>

      {!data ? (
        <p className="text-slate-600">Choose a valid month and subject.</p>
      ) : (
        <>
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["Subject income (after fees)", formatXaf(data.split.net)],
              [
                data.split.topUp > 0 ? "Prize pool (topped up to minimum)" : "Prize pool",
                formatXaf(data.pool),
              ],
              ["1st / 2nd / 3rd", data.amounts.map((a) => formatXaf(a)).join(" / ")],
              ["Tests this month", String(data.tests.length)],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-slate-200 bg-white p-4">
                <dd className="font-bold">{value}</dd>
                <dt className="text-xs text-slate-500">{label}</dt>
              </div>
            ))}
          </dl>

          <section>
            <h2 className="mb-3 text-lg font-semibold">Prize awards</h2>
            {data.awards.length === 0 ? (
              data.monthEnded ? (
                <CreateAwardsButton period={period} subjectId={data.subject.id} />
              ) : (
                <p className="text-sm text-slate-600">
                  Awards can be created after the month ends ({formatDateTime(data.range.end)}).
                  Standings below are provisional.
                </p>
              )
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className={tableClass}>
                    <thead>
                      <tr>
                        <th className={thClass}>Place</th>
                        <th className={thClass}>Student</th>
                        <th className={thClass}>Amount</th>
                        <th className={thClass}>Status</th>
                        <th className={thClass} />
                      </tr>
                    </thead>
                    <tbody>
                      {data.awards.map((award) => (
                        <tr key={award.id}>
                          <td className={tdClass}>{award.rank}</td>
                          <td className={tdClass}>
                            <Link
                              href={`/admin/students/${award.user.id}`}
                              className="text-brand-700 hover:underline"
                            >
                              {award.user.name}
                            </Link>
                            <span className="block text-xs text-slate-500">
                              MoMo: {award.user.phone ?? "no phone"}
                            </span>
                            {award.notes && (
                              <span className="block text-xs text-slate-500">
                                Note: {award.notes}
                              </span>
                            )}
                          </td>
                          <td className={tdClass}>{formatXaf(award.amount)}</td>
                          <td className={tdClass}>
                            <StatusBadge status={award.status} />
                            {award.paidAt && (
                              <span className="block text-xs text-slate-500">
                                {formatDateTime(award.paidAt)}
                              </span>
                            )}
                          </td>
                          <td className={tdClass}>
                            <AwardActions awardId={award.id} status={award.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {data.awards.every((a) => a.status !== "PAID") && (
                  <div className="mt-3">
                    <DiscardAwardsButton period={period} subjectId={data.subject.id} />
                  </div>
                )}
              </>
            )}
          </section>

          <section>
            <h2 className="mb-1 text-lg font-semibold">Standings</h2>
            <p className="mb-3 text-sm text-slate-600">
              Total score across {data.tests.map((t) => t.title).join(", ") || "no closed tests"}.
              Disqualify attempts on the test page to remove them.
            </p>
            <div className="overflow-x-auto">
              <table className={tableClass}>
                <thead>
                  <tr>
                    <th className={thClass}>#</th>
                    <th className={thClass}>Student</th>
                    <th className={thClass}>Total</th>
                    <th className={thClass}>Time</th>
                    <th className={thClass}>Tests</th>
                    <th className={thClass}>Left page</th>
                  </tr>
                </thead>
                <tbody>
                  {data.standings.length === 0 && (
                    <EmptyRow colSpan={6}>No attempts this month.</EmptyRow>
                  )}
                  {data.standings.slice(0, SHOWN_STANDINGS).map((s) => (
                    <tr key={s.userId} className={s.eligible ? "" : "text-slate-400"}>
                      <td className={tdClass}>{s.rank ?? "–"}</td>
                      <td className={tdClass}>
                        <Link href={`/admin/students/${s.userId}`} className="hover:underline">
                          {s.user.name}
                        </Link>
                        {!s.eligible && (
                          <span className="block text-xs">
                            Sat fewer than {s.testsCounted} tests
                          </span>
                        )}
                      </td>
                      <td className={`${tdClass} tabular-nums`}>{s.totalScore}</td>
                      <td className={`${tdClass} tabular-nums`}>{formatSeconds(s.totalTime)}</td>
                      <td className={tdClass}>
                        {s.testsTaken}/{data.tests.length}
                      </td>
                      <td
                        className={`${tdClass} tabular-nums ${s.focusLosses >= 3 ? "font-semibold text-red-700" : ""}`}
                      >
                        {s.focusLosses}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
