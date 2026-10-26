import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader, SavedBanner } from "@/components/admin";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { QuestionCard } from "@/components/question-card";
import { loadContentOptions } from "@/lib/admin/options";
import { contentScope, inScope } from "@/lib/admin/scope";
import { requireRole, STAFF_ROLES } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { QuestionForm } from "../question-form";

export const metadata: Metadata = { title: "Edit question" };

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}

export default async function EditQuestionPage({ params, searchParams }: Props) {
  const user = await requireRole(STAFF_ROLES);
  const scope = await contentScope(user);
  const [{ id }, { saved }] = await Promise.all([params, searchParams]);
  const [question, subjects] = await Promise.all([
    db.question.findUnique({
      where: { id },
      include: {
        options: { orderBy: { label: "asc" } },
        testQuestions: { select: { test: { select: { id: true, title: true } } } },
        _count: { select: { answers: true } },
      },
    }),
    loadContentOptions(scope),
  ]);
  if (!question || !inScope(scope, question.subjectId)) notFound();

  const optionText = Object.fromEntries(question.options.map((o) => [`option${o.label}`, o.text]));
  const initial: Record<string, string> = {
    id: question.id,
    subjectId: question.subjectId,
    topicId: question.topicId ?? "",
    pastPaperId: question.pastPaperId ?? "",
    number: question.number?.toString() ?? "",
    stem: question.stem,
    ...optionText,
    correct: question.options.find((o) => o.isCorrect)?.label ?? "",
    solution: question.solution ?? "",
    difficulty: String(question.difficulty),
    status: question.status,
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <Breadcrumbs
          items={[{ label: "Questions", href: "/admin/questions" }, { label: "Edit" }]}
        />
        <PageHeader title="Edit question">
          {question.testQuestions.length > 0 &&
            `Used in: ${question.testQuestions.map((t) => t.test.title).join(", ")}.`}
          {question._count.answers > 0 &&
            " Students have answered it, so the correct option is locked."}
        </PageHeader>
        <SavedBanner show={saved === "1"} />
        <QuestionForm
          key={question.updatedAt.toISOString()}
          subjects={subjects}
          initial={initial}
        />
      </div>
      <aside className="lg:sticky lg:top-4 lg:self-start">
        <h2 className="mb-3 text-sm font-semibold text-slate-500 uppercase">
          Student preview (last saved)
        </h2>
        <QuestionCard
          index={0}
          question={{
            id: question.id,
            number: question.number,
            stem: question.stem,
            options: question.options.map((o) => ({ label: o.label, text: o.text })),
            correctLabel: question.options.find((o) => o.isCorrect)?.label ?? null,
            fromPastPaper: question.pastPaperId !== null,
            pastPaperId: question.pastPaperId,
            solution: question.solution,
          }}
        />
      </aside>
    </div>
  );
}
