import type { Metadata } from "next";
import Link from "next/link";
import { EmptyRow, PageHeader, tableClass, tdClass, thClass } from "@/components/admin";
import { ADMIN_ONLY, requireRole } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { LEVEL_LABEL } from "@/lib/domain/pricing";
import { NewSubjectForm } from "./subject-forms";

export const metadata: Metadata = { title: "Subjects" };

export default async function SubjectsPage() {
  await requireRole(ADMIN_ONLY);
  const now = new Date();
  const subjects = await db.subject.findMany({
    orderBy: [{ level: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      level: true,
      competitionOpen: true,
      _count: {
        select: {
          topics: true,
          questions: true,
          entries: { where: { startsAt: { lte: now }, endsAt: { gt: now } } },
        },
      },
    },
  });

  return (
    <div className="space-y-8">
      <PageHeader title="Subjects">
        Each subject has its own topics, notes (lessons), questions, competitive tests and prize
        pool. Students choose which subjects to compete in.
      </PageHeader>

      <table className={tableClass}>
        <thead>
          <tr>
            <th className={thClass}>Subject</th>
            <th className={thClass}>Topics</th>
            <th className={thClass}>Questions</th>
            <th className={thClass}>Entered now</th>
            <th className={thClass}>Competition</th>
          </tr>
        </thead>
        <tbody>
          {subjects.length === 0 && <EmptyRow colSpan={5}>No subjects yet.</EmptyRow>}
          {subjects.map((s) => (
            <tr key={s.id}>
              <td className={tdClass}>
                <Link
                  href={`/admin/subjects/${s.id}`}
                  className="font-medium text-brand-700 hover:underline"
                >
                  {LEVEL_LABEL[s.level]} {s.name}
                </Link>
              </td>
              <td className={tdClass}>{s._count.topics}</td>
              <td className={tdClass}>{s._count.questions}</td>
              <td className={tdClass}>{s._count.entries}</td>
              <td className={tdClass}>
                {s.competitionOpen ? (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800">
                    Open
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                    Closed
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="mb-1 font-semibold">Add a subject</h2>
        <p className="mb-4 text-sm text-slate-600">
          New subjects start closed, so you can add topics, notes and questions before students can
          choose it.
        </p>
        <NewSubjectForm />
      </section>
    </div>
  );
}
