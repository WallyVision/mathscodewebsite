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
import { contentScope, subjectIdFilter } from "@/lib/admin/scope";
import { requireRole, STAFF_ROLES } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { LEVEL_LABEL } from "@/lib/domain/pricing";

export const metadata: Metadata = { title: "Past papers" };

export default async function PapersPage() {
  const user = await requireRole(STAFF_ROLES);
  const scope = await contentScope(user);
  const papers = await db.pastPaper.findMany({
    where: { subjectId: subjectIdFilter(scope) },
    orderBy: [{ year: "desc" }, { paperNumber: "asc" }],
    select: {
      id: true,
      title: true,
      year: true,
      paperNumber: true,
      status: true,
      subject: { select: { name: true, level: true } },
      _count: { select: { questions: true } },
    },
  });

  return (
    <div>
      <PageHeader title="Past papers" action={{ href: "/admin/papers/new", label: "New paper" }} />
      <div className="overflow-x-auto">
        <table className={tableClass}>
          <thead>
            <tr>
              <th className={thClass}>Paper</th>
              <th className={thClass}>Subject</th>
              <th className={thClass}>Questions</th>
              <th className={thClass}>Status</th>
            </tr>
          </thead>
          <tbody>
            {papers.length === 0 && <EmptyRow colSpan={4}>No past papers yet.</EmptyRow>}
            {papers.map((paper) => (
              <tr key={paper.id}>
                <td className={tdClass}>
                  <Link
                    href={`/admin/papers/${paper.id}`}
                    className="font-medium text-brand-700 hover:underline"
                  >
                    {paper.title}
                  </Link>
                  <span className="block text-xs text-slate-500">
                    {paper.year} · Paper {paper.paperNumber}
                  </span>
                </td>
                <td className={tdClass}>
                  {LEVEL_LABEL[paper.subject.level]} {paper.subject.name}
                </td>
                <td className={tdClass}>{paper._count.questions}</td>
                <td className={tdClass}>
                  <StatusBadge status={paper.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
