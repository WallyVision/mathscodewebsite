import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { QuestionCard } from "@/components/question-card";
import { WrittenQuestionCard } from "@/components/written-question-card";
import { requireUser } from "@/lib/auth/session";
import { getPaperQuestions, getPaperWrittenQuestions, requireSubject } from "@/lib/content";
import { db } from "@/lib/db";
import { paperSlug, parsePaperSlug } from "@/lib/domain/levels";
import { LEVEL_LABEL } from "@/lib/domain/pricing";

interface Props {
  params: Promise<{ level: string; subject: string; paper: string }>;
}

// Keyed on strings so the page and its metadata share one lookup per request.
const loadPaper = cache(async (level: string, subjectSlug: string, paperParam: string) => {
  const subject = await requireSubject(level, subjectSlug);
  const ref = parsePaperSlug(paperParam);
  const paper = ref
    ? await db.pastPaper.findUnique({
        where: { subjectId_year_paperNumber: { subjectId: subject.id, ...ref } },
      })
    : null;
  if (!paper || paper.status !== "PUBLISHED") notFound();
  return { subject, paper, subjectHref: `/learn/${level}/${subjectSlug}` };
});

async function loadFromParams({ params }: Props) {
  const p = await params;
  return loadPaper(p.level, p.subject, p.paper);
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { subject, paper } = await loadFromParams(props);
  return { title: `${paper.title} · ${subject.name}` };
}

export default async function PastPaperPage(props: Props) {
  const user = await requireUser();
  const { subject, paper, subjectHref } = await loadFromParams(props);
  const [questions, written] = await Promise.all([
    getPaperQuestions(paper.id, subject.level, user),
    getPaperWrittenQuestions(paper.id, subject.level, user),
  ]);
  const returnTo = `${subjectHref}/papers/${paperSlug(paper.year, paper.paperNumber)}`;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumbs
        items={[
          { label: "Revise", href: "/learn" },
          { label: subject.name, href: subjectHref },
          { label: paper.title },
        ]}
      />
      <h1 className="text-2xl font-bold">{paper.title}</h1>
      <p className="text-slate-600">
        {LEVEL_LABEL[subject.level]} {subject.name} · {paper.year} · Paper {paper.paperNumber}
      </p>
      <p className="mt-4 rounded-md bg-brand-50 px-4 py-3 text-sm text-brand-900">
        {written.length > 0
          ? "Answer each question on paper, showing your working, before opening the worked solution."
          : "Try each question before revealing the answer."}{" "}
        Worked solutions explain the method step by step.
      </p>

      <div className="mt-6 space-y-4">
        {questions.length === 0 && written.length === 0 && (
          <p className="text-sm text-slate-600">Questions for this paper are being added.</p>
        )}
        {questions.map((question, i) => (
          <QuestionCard key={question.id} question={question} index={i} returnTo={returnTo} />
        ))}
      </div>

      {written.map((group) => (
        <section key={group.section ?? "none"} className="mt-8">
          {group.section && <h2 className="mb-3 text-lg font-semibold">Section {group.section}</h2>}
          <div className="space-y-4">
            {group.questions.map((question) => (
              <WrittenQuestionCard key={question.id} question={question} returnTo={returnTo} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
