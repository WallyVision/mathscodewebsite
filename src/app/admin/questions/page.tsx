import type { Metadata } from "next";
import Link from "next/link";
import type { Prisma } from "@prisma/client";
import {
  EmptyRow,
  PageHeader,
  StatusBadge,
  tableClass,
  tdClass,
  thClass,
} from "@/components/admin";
import { loadContentOptions } from "@/lib/admin/options";
import { contentScope, subjectIdFilter } from "@/lib/admin/scope";
import { requireRole, STAFF_ROLES } from "@/lib/auth/session";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Questions" };

const PAGE_SIZE = 50;

interface Props {
  searchParams: Promise<{ subject?: string; status?: string; q?: string; page?: string }>;
}

export default async function QuestionsPage({ searchParams }: Props) {
  const user = await requireRole(STAFF_ROLES);
  const scope = await contentScope(user);
  const { subject = "", status = "", q = "", page = "1" } = await searchParams;
  const pageNumber = Math.max(1, Number.parseInt(page, 10) || 1);

  const where: Prisma.QuestionWhereInput = {
    AND: [{ subjectId: subjectIdFilter(scope) }, subject ? { subjectId: subject } : {}],
    ...(status === "DRAFT" || status === "PUBLISHED" ? { status } : {}),
    ...(q ? { stem: { contains: q, mode: "insensitive" } } : {}),
  };

  const [subjects, questions, total] = await Promise.all([
    loadContentOptions(scope),
    db.question.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (pageNumber - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        stem: true,
        status: true,
        number: true,
        subject: { select: { name: true, level: true } },
        topic: { select: { name: true } },
        pastPaper: { select: { year: true, paperNumber: true } },
        _count: { select: { testQuestions: true } },
      },
    }),
    db.question.count({ where }),
  ]);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const query = (p: number) => `?${new URLSearchParams({ subject, status, q, page: String(p) })}`;

  return (
    <div>
      <PageHeader
        title="Questions"
        action={{ href: "/admin/questions/new", label: "New question" }}
      >
        {total} {total === 1 ? "question" : "questions"} ·{" "}
        <Link href="/admin/questions/import" className="text-brand-700 hover:underline">
          Import many at once
        </Link>
      </PageHeader>

      <form className="mb-4 flex flex-wrap gap-2 text-sm" role="search">
        <select
          name="subject"
          defaultValue={subject}
          className="rounded-md border border-slate-300 bg-white px-2 py-1.5"
        >
          <option value="">All subjects</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <select
          name="status"
          defaultValue={status}
          className="rounded-md border border-slate-300 bg-white px-2 py-1.5"
        >
          <option value="">Any status</option>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
        <input
          name="q"
          defaultValue={q}
          placeholder="Search question text"
          className="min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-2 py-1.5"
        />
        <button className="rounded-md bg-slate-800 px-3 py-1.5 font-medium text-white">
          Filter
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className={tableClass}>
          <thead>
            <tr>
              <th className={thClass}>Question</th>
              <th className={thClass}>Subject / topic</th>
              <th className={thClass}>Source</th>
              <th className={thClass}>Status</th>
            </tr>
          </thead>
          <tbody>
            {questions.length === 0 && <EmptyRow colSpan={4}>No questions match.</EmptyRow>}
            {questions.map((question) => (
              <tr key={question.id}>
                <td className={`${tdClass} max-w-md`}>
                  <Link
                    href={`/admin/questions/${question.id}`}
                    className="line-clamp-2 font-medium text-brand-700 hover:underline"
                  >
                    {question.stem}
                  </Link>
                </td>
                <td className={tdClass}>
                  {question.subject.name}
                  <span className="block text-xs text-slate-500">
                    {question.topic?.name ?? "No topic"}
                  </span>
                </td>
                <td className={`${tdClass} whitespace-nowrap`}>
                  {question.pastPaper
                    ? `${question.pastPaper.year} P${question.pastPaper.paperNumber} Q${question.number}`
                    : "Original"}
                  {question._count.testQuestions > 0 && (
                    <span className="block text-xs text-slate-500">
                      In {question._count.testQuestions}{" "}
                      {question._count.testQuestions === 1 ? "test" : "tests"}
                    </span>
                  )}
                </td>
                <td className={tdClass}>
                  <StatusBadge status={question.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <nav className="mt-4 flex items-center justify-between text-sm" aria-label="Pagination">
          {pageNumber > 1 ? (
            <Link href={query(pageNumber - 1)} className="text-brand-700 hover:underline">
              ← Previous
            </Link>
          ) : (
            <span />
          )}
          <span className="text-slate-500">
            Page {pageNumber} of {pages}
          </span>
          {pageNumber < pages ? (
            <Link href={query(pageNumber + 1)} className="text-brand-700 hover:underline">
              Next →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </div>
  );
}
