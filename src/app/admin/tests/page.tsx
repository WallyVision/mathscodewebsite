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
import { ADMIN_ONLY, requireRole } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { LEVEL_LABEL } from "@/lib/domain/pricing";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = { title: "Tests" };

export default async function AdminTestsPage() {
  await requireRole(ADMIN_ONLY);
  const now = new Date();
  const tests = await db.test.findMany({
    orderBy: { opensAt: "desc" },
    take: 100,
    select: {
      id: true,
      title: true,
      status: true,
      opensAt: true,
      closesAt: true,
      subject: { select: { name: true, level: true } },
      _count: { select: { questions: true, attempts: true } },
    },
  });

  return (
    <div>
      <PageHeader title="Tests" action={{ href: "/admin/tests/new", label: "New test" }}>
        Times are Cameroon time.
      </PageHeader>
      <div className="overflow-x-auto">
        <table className={tableClass}>
          <thead>
            <tr>
              <th className={thClass}>Test</th>
              <th className={thClass}>Window</th>
              <th className={thClass}>Questions</th>
              <th className={thClass}>Attempts</th>
              <th className={thClass}>Status</th>
            </tr>
          </thead>
          <tbody>
            {tests.length === 0 && <EmptyRow colSpan={5}>No tests yet.</EmptyRow>}
            {tests.map((test) => {
              const phase =
                test.status === "DRAFT"
                  ? "DRAFT"
                  : now < test.opensAt
                    ? "SCHEDULED"
                    : now < test.closesAt
                      ? "OPEN"
                      : "CLOSED";
              return (
                <tr key={test.id}>
                  <td className={tdClass}>
                    <Link
                      href={`/admin/tests/${test.id}`}
                      className="font-medium text-brand-700 hover:underline"
                    >
                      {test.title}
                    </Link>
                    <span className="block text-xs text-slate-500">
                      {LEVEL_LABEL[test.subject.level]} {test.subject.name}
                    </span>
                  </td>
                  <td className={`${tdClass} whitespace-nowrap`}>
                    {formatDateTime(test.opensAt)}
                    <span className="block text-xs text-slate-500">
                      to {formatDateTime(test.closesAt)}
                    </span>
                  </td>
                  <td className={tdClass}>{test._count.questions}</td>
                  <td className={tdClass}>{test._count.attempts}</td>
                  <td className={tdClass}>
                    <StatusBadge status={phase} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
