import type { Metadata } from "next";
import Link from "next/link";
import { EmptyRow, PageHeader, tableClass, tdClass, thClass } from "@/components/admin";
import { requireRole, STAFF_ROLES } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { parsePeriod, periodOf, previousPeriod } from "@/lib/domain/period";
import { formatXaf, LEVEL_LABEL } from "@/lib/domain/pricing";
import { DEFAULT_REVENUE_POLICY } from "@/lib/domain/revenue";
import { authorEarnings, monthEarnings, type SubjectEarnings } from "@/lib/earnings";
import { formatDate } from "@/lib/format";
import { CreatePayoutsButton, MarkPaidForm } from "./earnings-forms";

export const metadata: Metadata = { title: "Earnings" };

const percent = (share: number) => `${Math.round(share * 100)}%`;
const monthName = (period: string) =>
  new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${period}-15T00:00:00Z`),
  );

export default async function EarningsPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const user = await requireRole(STAFF_ROLES);
  const current = periodOf(new Date());
  const requested = (await searchParams).period;
  const period = requested && parsePeriod(requested) ? requested : current;
  return user.role === "ADMIN" ? (
    <AdminEarnings period={period} current={current} />
  ) : (
    <AuthorEarnings user={user} period={current} />
  );
}

/** The rule, in one line, so everyone reads the same thing. */
function Rule() {
  const p = DEFAULT_REVENUE_POLICY;
  return (
    <>
      Each subject&apos;s income is what students paid to compete in it. After payment fees it is
      shared {percent(p.platformShare)} platform, {percent(p.teamShare)} subject team,{" "}
      {percent(p.prizeShare)} prizes. Months end on the last day; payouts are made by the 15th of
      the next month.
    </>
  );
}

async function AuthorEarnings({
  user,
  period,
}: {
  user: Parameters<typeof authorEarnings>[0];
  period: string;
}) {
  const { month, payouts } = await authorEarnings(user, period);
  const subjects = month?.subjects ?? [];
  const mine = (s: SubjectEarnings) => s.members.find((m) => m.userId === user.id)?.amount ?? 0;
  const total = subjects.reduce((sum, s) => sum + mine(s), 0);

  return (
    <div className="space-y-8">
      <PageHeader title="My earnings">
        <Rule />
      </PageHeader>

      <section className="rounded-lg border border-brand-600 bg-white p-5">
        <p className="text-sm text-slate-600">{monthName(period)} so far (estimate)</p>
        <p className="mt-1 text-4xl font-bold text-brand-700">{formatXaf(total)}</p>
        <p className="mt-1 text-sm text-slate-600">
          Grows with every payment in your subjects. Final on the 1st; paid by the 15th.
        </p>
      </section>

      {subjects.length === 0 ? (
        <p className="text-sm text-slate-600">
          You are not in a subject team yet. Ask the admin to add you.
        </p>
      ) : (
        <table className={tableClass}>
          <thead>
            <tr>
              <th className={thClass}>Subject</th>
              <th className={thClass}>Students entered</th>
              <th className={thClass}>Subject income</th>
              <th className={thClass}>Team share</th>
              <th className={thClass}>Your share</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((s) => {
              const me = s.members.find((m) => m.userId === user.id);
              const weights = s.members.reduce((sum, m) => sum + m.weight, 0) || 1;
              return (
                <tr key={s.subject.id}>
                  <td className={tdClass}>
                    {LEVEL_LABEL[s.subject.level]} {s.subject.name}
                  </td>
                  <td className={tdClass}>{s.entrants}</td>
                  <td className={tdClass}>{formatXaf(s.split.net)}</td>
                  <td className={tdClass}>{formatXaf(s.split.team)}</td>
                  <td className={tdClass}>
                    <strong>{formatXaf(me?.amount ?? 0)}</strong>
                    <span className="block text-xs text-slate-500">
                      {me ? `${Math.round((me.weight / weights) * 100)}% of the team share` : ""}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <section>
        <h2 className="mb-3 font-semibold">Past months</h2>
        <PayoutTable payouts={payouts} showMember={false} />
      </section>
    </div>
  );
}

async function AdminEarnings({ period, current }: { period: string; current: string }) {
  const [month, payouts] = await Promise.all([
    monthEarnings(period),
    db.teamPayout.findMany({
      where: { period },
      orderBy: [{ subjectId: "asc" }, { amount: "desc" }],
      include: {
        subject: { select: { name: true, level: true } },
        user: { select: { name: true, phone: true } },
      },
    }),
  ]);
  if (!month) return null;
  const totals = month.subjects.reduce(
    (t, s) => ({
      gross: t.gross + s.split.gross,
      fees: t.fees + s.split.fees,
      team: t.team + s.split.team,
      prizes: t.prizes + s.split.prizePool,
      platform: t.platform + s.split.platform,
    }),
    { gross: 0, fees: 0, team: 0, prizes: 0, platform: 0 },
  );

  return (
    <div className="space-y-8">
      <PageHeader title="Earnings and payouts">
        <Rule />
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
        <button className="rounded-md bg-slate-800 px-3 py-1.5 font-medium text-white">Show</button>
        {period !== current && (
          <Link href="/admin/earnings" className="px-2 py-1.5 text-brand-700 hover:underline">
            This month
          </Link>
        )}
        {period === current && (
          <Link
            href={`/admin/earnings?period=${previousPeriod(current)}`}
            className="px-2 py-1.5 text-brand-700 hover:underline"
          >
            Last month
          </Link>
        )}
      </form>

      <p className="text-sm text-slate-600">
        {monthName(period)}: {month.ended ? "final figures." : "live estimate, still growing."}
      </p>

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {[
          ["Paid by students", totals.gross],
          ["Payment fees (est.)", totals.fees],
          ["Teams", totals.team],
          ["Prizes", totals.prizes],
          ["You keep", totals.platform],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-slate-200 bg-white p-4">
            <dd className="font-bold">{formatXaf(value as number)}</dd>
            <dt className="text-xs text-slate-500">{label}</dt>
          </div>
        ))}
      </dl>

      <div className="overflow-x-auto">
        <table className={tableClass}>
          <thead>
            <tr>
              <th className={thClass}>Subject</th>
              <th className={thClass}>Entered</th>
              <th className={thClass}>Income after fees</th>
              <th className={thClass}>Team</th>
              <th className={thClass}>Prizes</th>
              <th className={thClass}>You keep</th>
              <th className={thClass}>Team members</th>
            </tr>
          </thead>
          <tbody>
            {month.subjects.length === 0 && <EmptyRow colSpan={7}>No subjects.</EmptyRow>}
            {month.subjects.map((s) => (
              <tr key={s.subject.id}>
                <td className={tdClass}>
                  {LEVEL_LABEL[s.subject.level]} {s.subject.name}
                </td>
                <td className={tdClass}>{s.entrants}</td>
                <td className={tdClass}>{formatXaf(s.split.net)}</td>
                <td className={tdClass}>{formatXaf(s.split.team)}</td>
                <td className={tdClass}>
                  {formatXaf(s.split.prizePool)}
                  {s.split.topUp > 0 && (
                    <span className="block text-xs text-amber-700">
                      incl. {formatXaf(s.split.topUp)} top-up
                    </span>
                  )}
                </td>
                <td className={tdClass}>{formatXaf(s.split.platform)}</td>
                <td className={tdClass}>
                  {s.members.length === 0 ? (
                    <span className="text-slate-500">No team: its share stays with you</span>
                  ) : (
                    s.members.map((m) => (
                      <span key={m.userId} className="block">
                        {m.name}: {formatXaf(m.amount)}
                      </span>
                    ))
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="space-y-3">
        <h2 className="font-semibold">Team payouts for {monthName(period)}</h2>
        {month.ended ? (
          <CreatePayoutsButton period={period} />
        ) : (
          <p className="text-sm text-slate-600">
            Payouts can be fixed once the month has ended, from the 1st of next month.
          </p>
        )}
        <PayoutTable payouts={payouts} showMember />
      </section>
    </div>
  );
}

function PayoutTable({
  payouts,
  showMember,
}: {
  payouts: {
    id: string;
    period: string;
    amount: number;
    status: "PENDING" | "PAID";
    paidAt: Date | null;
    reference: string | null;
    subject: { name: string; level: "O_LEVEL" | "A_LEVEL" };
    user?: { name: string; phone: string | null };
  }[];
  showMember: boolean;
}) {
  return (
    <div className="overflow-x-auto">
      <table className={tableClass}>
        <thead>
          <tr>
            <th className={thClass}>Month</th>
            <th className={thClass}>Subject</th>
            {showMember && <th className={thClass}>Member</th>}
            <th className={thClass}>Amount</th>
            <th className={thClass}>Status</th>
          </tr>
        </thead>
        <tbody>
          {payouts.length === 0 && (
            <EmptyRow colSpan={showMember ? 5 : 4}>No payouts yet.</EmptyRow>
          )}
          {payouts.map((p) => (
            <tr key={p.id}>
              <td className={tdClass}>{monthName(p.period)}</td>
              <td className={tdClass}>
                {LEVEL_LABEL[p.subject.level]} {p.subject.name}
              </td>
              {showMember && (
                <td className={tdClass}>
                  {p.user?.name}
                  <span className="block text-xs text-slate-500">{p.user?.phone}</span>
                </td>
              )}
              <td className={tdClass}>{formatXaf(p.amount)}</td>
              <td className={tdClass}>
                {p.status === "PAID" ? (
                  <span className="text-emerald-700">
                    Paid {p.paidAt && formatDate(p.paidAt)}
                    {p.reference && (
                      <span className="block text-xs text-slate-500">{p.reference}</span>
                    )}
                  </span>
                ) : showMember ? (
                  <MarkPaidForm id={p.id} />
                ) : (
                  <span className="text-amber-700">To be paid by the 15th</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
