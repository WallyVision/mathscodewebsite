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
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = { title: "Notes" };

export default async function NotesPage() {
  const user = await requireRole(STAFF_ROLES);
  const scope = await contentScope(user);
  const notes = await db.note.findMany({
    where: { topic: { subjectId: subjectIdFilter(scope) } },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      status: true,
      updatedAt: true,
      topic: { select: { name: true, subject: { select: { name: true, level: true } } } },
    },
  });

  return (
    <div>
      <PageHeader title="Notes" action={{ href: "/admin/notes/new", label: "New note" }}>
        {notes.length} {notes.length === 1 ? "note" : "notes"} ·{" "}
        <Link href="/admin/notes/import" className="text-brand-700 hover:underline">
          Import many at once
        </Link>
      </PageHeader>
      <div className="overflow-x-auto">
        <table className={tableClass}>
          <thead>
            <tr>
              <th className={thClass}>Title</th>
              <th className={thClass}>Subject / topic</th>
              <th className={thClass}>Updated</th>
              <th className={thClass}>Status</th>
            </tr>
          </thead>
          <tbody>
            {notes.length === 0 && <EmptyRow colSpan={4}>No notes yet.</EmptyRow>}
            {notes.map((note) => (
              <tr key={note.id}>
                <td className={tdClass}>
                  <Link
                    href={`/admin/notes/${note.id}`}
                    className="font-medium text-brand-700 hover:underline"
                  >
                    {note.title}
                  </Link>
                </td>
                <td className={tdClass}>
                  {LEVEL_LABEL[note.topic.subject.level]} {note.topic.subject.name}
                  <span className="block text-xs text-slate-500">{note.topic.name}</span>
                </td>
                <td className={`${tdClass} whitespace-nowrap`}>{formatDateTime(note.updatedAt)}</td>
                <td className={tdClass}>
                  <StatusBadge status={note.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
