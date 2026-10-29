import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader, SavedBanner, StatusBadge } from "@/components/admin";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { loadContentOptions } from "@/lib/admin/options";
import { contentScope, inScope } from "@/lib/admin/scope";
import { requireRole, STAFF_ROLES } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { publishDraftQuestions } from "../../questions/actions";
import { PaperForm } from "../paper-form";

export const metadata: Metadata = { title: "Edit past paper" };

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; published?: string }>;
}

export default async function EditPaperPage({ params, searchParams }: Props) {
  const user = await requireRole(STAFF_ROLES);
  const scope = await contentScope(user);
  const [{ id }, { saved, published }] = await Promise.all([params, searchParams]);
  const [paper, subjects] = await Promise.all([
    db.pastPaper.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { number: "asc" },
          select: { id: true, number: true, stem: true, status: true },
        },
      },
    }),
    loadContentOptions(scope),
  ]);
  if (!paper || !inScope(scope, paper.subjectId)) notFound();
  const drafts = paper.questions.filter((q) => q.status === "DRAFT").length;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <Breadcrumbs
          items={[{ label: "Past papers", href: "/admin/papers" }, { label: paper.title }]}
        />
        <PageHeader title="Edit past paper" />
        <SavedBanner show={saved === "1"} />
        <PaperForm
          key={paper.title + paper.status}
          subjects={subjects}
          initial={{
            id: paper.id,
            subjectId: paper.subjectId,
            year: String(paper.year),
            paperNumber: String(paper.paperNumber),
            title: paper.title,
            status: paper.status,
          }}
        />
      </div>
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Questions ({paper.questions.length})</h2>
          <span className="flex flex-wrap gap-2">
            <Link
              href={`/admin/questions/import?subject=${paper.subjectId}&paper=${paper.id}`}
              className="rounded-md border border-brand-600 px-3 py-1.5 text-sm font-semibold text-brand-700 hover:bg-brand-50"
            >
              Import many
            </Link>
            <Link
              href={`/admin/questions/new?subject=${paper.subjectId}&paper=${paper.id}`}
              className="rounded-md bg-brand-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Add question
            </Link>
          </span>
        </div>
        <SavedBanner show={published !== undefined}>
          {published === "1" ? "1 question" : `${published} questions`} published.
        </SavedBanner>
        {drafts > 0 && (
          <form
            action={publishDraftQuestions}
            className="mb-3 flex flex-wrap items-center gap-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm"
          >
            <input type="hidden" name="pastPaperId" value={paper.id} />
            <p className="min-w-0 flex-1 text-amber-900">
              {drafts} {drafts === 1 ? "question is" : "questions are"} still a draft, so students
              cannot see {drafts === 1 ? "it" : "them"}. Publishing the paper does not publish its
              questions.
            </p>
            <button
              type="submit"
              className="rounded-md bg-brand-600 px-3 py-1.5 font-semibold text-white hover:bg-brand-700"
            >
              Publish all {drafts} {drafts === 1 ? "draft" : "drafts"}
            </button>
          </form>
        )}
        {paper.questions.length === 0 ? (
          <p className="text-sm text-slate-600">No questions yet.</p>
        ) : (
          <ol className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white text-sm">
            {paper.questions.map((q) => (
              <li key={q.id}>
                <Link
                  href={`/admin/questions/${q.id}`}
                  className="flex items-start gap-3 p-3 hover:bg-slate-50"
                >
                  <span className="w-8 shrink-0 font-semibold text-slate-500">Q{q.number}</span>
                  <span className="line-clamp-2 flex-1">{q.stem}</span>
                  <StatusBadge status={q.status} />
                </Link>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
