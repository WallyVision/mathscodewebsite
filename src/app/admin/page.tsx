import Link from "next/link";
import { PageHeader } from "@/components/admin";
import { requireRole, STAFF_ROLES } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { formatDateTime } from "@/lib/format";

export default async function AdminHome() {
  const user = await requireRole(STAFF_ROLES);
  const now = new Date();

  const [students, subscribers, draftQuestions, publishedQuestions, draftNotes, upcoming] =
    await Promise.all([
      db.user.count({ where: { role: "STUDENT" } }),
      db.user.count({
        where: { subscriptions: { some: { startsAt: { lte: now }, endsAt: { gt: now } } } },
      }),
      db.question.count({ where: { status: "DRAFT" } }),
      db.question.count({ where: { status: "PUBLISHED" } }),
      db.note.count({ where: { status: "DRAFT" } }),
      db.test.findMany({
        where: { closesAt: { gt: now } },
        orderBy: { opensAt: "asc" },
        take: 5,
        select: { id: true, title: true, status: true, opensAt: true, closesAt: true },
      }),
    ]);

  const stats = [
    { label: "Students", value: students, adminOnly: true },
    { label: "Active subscribers", value: subscribers, adminOnly: true },
    {
      label: "Published questions",
      value: publishedQuestions,
      href: "/admin/questions?status=PUBLISHED",
    },
    { label: "Draft questions", value: draftQuestions, href: "/admin/questions?status=DRAFT" },
    { label: "Draft notes", value: draftNotes, href: "/admin/notes" },
  ].filter((s) => !s.adminOnly || user.role === "ADMIN");

  return (
    <div>
      <PageHeader title={`Hello, ${user.name.split(" ")[0]}`}>
        Signed in as {user.role === "ADMIN" ? "an administrator" : "an author"}.
      </PageHeader>

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {stats.map((s) => {
          const body = (
            <>
              <dd className="text-2xl font-bold">{s.value}</dd>
              <dt className="text-xs text-slate-500">{s.label}</dt>
            </>
          );
          return s.href ? (
            <Link
              key={s.label}
              href={s.href}
              className="rounded-lg border border-slate-200 bg-white p-4 hover:border-brand-600"
            >
              {body}
            </Link>
          ) : (
            <div key={s.label} className="rounded-lg border border-slate-200 bg-white p-4">
              {body}
            </div>
          );
        })}
      </dl>

      {user.role === "ADMIN" && (
        <section className="mt-8">
          <h2 className="mb-3 font-semibold">Open and upcoming tests</h2>
          {upcoming.length === 0 ? (
            <p className="text-sm text-slate-600">
              None.{" "}
              <Link href="/admin/tests/new" className="text-brand-700 underline">
                Schedule a test
              </Link>
              .
            </p>
          ) : (
            <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white text-sm">
              {upcoming.map((t) => (
                <li key={t.id}>
                  <Link
                    href={`/admin/tests/${t.id}`}
                    className="flex justify-between gap-3 p-3 hover:bg-slate-50"
                  >
                    <span className="font-medium">{t.title}</span>
                    <span className="text-slate-500">
                      {t.status === "DRAFT" ? "Draft · " : ""}
                      {formatDateTime(t.opensAt)} → {formatDateTime(t.closesAt)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
