import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader, SavedBanner } from "@/components/admin";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { WrittenQuestionCard } from "@/components/written-question-card";
import { contentScope, inScope } from "@/lib/admin/scope";
import { requireRole, STAFF_ROLES } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { deleteWrittenQuestion } from "../actions";
import { WrittenQuestionForm } from "../written-form";

export const metadata: Metadata = { title: "Edit written question" };

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}

export default async function EditWrittenQuestionPage({ params, searchParams }: Props) {
  const user = await requireRole(STAFF_ROLES);
  const [{ id }, { saved }] = await Promise.all([params, searchParams]);
  const question = await db.writtenQuestion.findUnique({
    where: { id },
    include: {
      pastPaper: {
        select: {
          id: true,
          title: true,
          year: true,
          paperNumber: true,
          subjectId: true,
          subject: {
            select: { topics: { orderBy: { position: "asc" }, select: { id: true, name: true } } },
          },
        },
      },
    },
  });
  if (!question || !inScope(await contentScope(user), question.pastPaper.subjectId)) notFound();
  const paper = question.pastPaper;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <Breadcrumbs
          items={[
            { label: "Past papers", href: "/admin/papers" },
            { label: paper.title, href: `/admin/papers/${paper.id}` },
            { label: question.label },
          ]}
        />
        <PageHeader title={`Written question ${question.label}`}>
          {paper.year} Paper {paper.paperNumber}: {paper.title}
        </PageHeader>
        <SavedBanner show={saved === "1"} />
        <WrittenQuestionForm
          key={question.updatedAt.toISOString()}
          topics={paper.subject.topics}
          initial={{
            id: question.id,
            pastPaperId: paper.id,
            label: question.label,
            section: question.section ?? "",
            marks: question.marks?.toString() ?? "",
            topicId: question.topicId ?? "",
            body: question.body,
            solution: question.solution ?? "",
            status: question.status,
          }}
        />
        <form action={deleteWrittenQuestion} className="mt-10 border-t border-slate-200 pt-4">
          <input type="hidden" name="id" value={question.id} />
          <button type="submit" className="text-sm font-medium text-red-700 hover:underline">
            Delete this question
          </button>
        </form>
      </div>
      <aside className="lg:sticky lg:top-4 lg:self-start">
        <h2 className="mb-3 text-sm font-semibold text-slate-500 uppercase">
          Student preview (last saved)
        </h2>
        <WrittenQuestionCard
          question={{
            id: question.id,
            label: question.label,
            marks: question.marks,
            body: question.body,
            pastPaperId: paper.id,
            solution: question.solution,
          }}
        />
      </aside>
    </div>
  );
}
