import type { Metadata } from "next";
import {
  EmptyRow,
  PageHeader,
  SavedBanner,
  tableClass,
  tdClass,
  thClass,
} from "@/components/admin";
import { ADMIN_ONLY, requireRole } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { formatDateTime } from "@/lib/format";
import { AUDIENCES, audienceWhere, isAudience, type Audience } from "@/lib/push";
import { NotifyForm } from "./notify-form";

export const metadata: Metadata = { title: "Notify" };

export default async function NotifyPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; of?: string }>;
}) {
  await requireRole(ADMIN_ONLY);
  const { sent, of } = await searchParams;
  const now = new Date();
  const audiences = Object.keys(AUDIENCES) as Audience[];
  const [counts, history] = await Promise.all([
    Promise.all(
      audiences.map((a) => db.pushSubscription.count({ where: { user: audienceWhere(a, now) } })),
    ),
    db.notificationLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 30,
      select: {
        id: true,
        title: true,
        body: true,
        audience: true,
        devices: true,
        delivered: true,
        createdAt: true,
        createdById: true,
      },
    }),
  ]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
      <div>
        <PageHeader title="Send a notification">
          It appears on the phones and computers of students who turned notifications on.{" "}
          <strong>{counts[0]}</strong> {counts[0] === 1 ? "device has" : "devices have"} them on.
        </PageHeader>
        <SavedBanner show={sent !== undefined}>
          Sent to {sent} of {of} {of === "1" ? "device" : "devices"}.
        </SavedBanner>
        <NotifyForm
          audiences={audiences.map((a, i) => ({
            value: a,
            label: `${AUDIENCES[a]} · ${counts[i]} ${counts[i] === 1 ? "device" : "devices"}`,
          }))}
        />
        <p className="mt-6 text-sm text-slate-600">
          Send few, useful messages: tests opening, results, deadlines. Students who get too many
          turn notifications off.
        </p>
      </div>
      <section>
        <h2 className="mb-3 font-semibold">Sent</h2>
        <div className="overflow-x-auto">
          <table className={tableClass}>
            <thead>
              <tr>
                <th className={thClass}>Message</th>
                <th className={thClass}>To</th>
                <th className={thClass}>Delivered</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 && <EmptyRow colSpan={3}>Nothing sent yet.</EmptyRow>}
              {history.map((n) => (
                <tr key={n.id}>
                  <td className={tdClass}>
                    <span className="font-medium">{n.title}</span>
                    <span className="block text-xs text-slate-500">{n.body}</span>
                    <span className="block text-xs text-slate-400">
                      {formatDateTime(n.createdAt)}
                    </span>
                  </td>
                  <td className={`${tdClass} text-xs`}>
                    {isAudience(n.audience)
                      ? AUDIENCES[n.audience]
                      : n.audience === "TEST_TAKERS"
                        ? "Students who sat the test"
                        : n.audience}
                    {!n.createdById && <span className="block text-slate-400">Automatic</span>}
                  </td>
                  <td className={`${tdClass} whitespace-nowrap`}>
                    {n.delivered} / {n.devices}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
