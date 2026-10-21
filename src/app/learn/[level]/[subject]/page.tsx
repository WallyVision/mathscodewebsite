import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { requireUser } from "@/lib/auth/session";
import { practiceQuestionWhere, requireSubject } from "@/lib/content";
import { db } from "@/lib/db";
import { paperSlug } from "@/lib/domain/levels";
import { LEVEL_LABEL } from "@/lib/domain/pricing";

interface Props {
  params: Promise<{ level: string; subject: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { level, subject: slug } = await params;
  const subject = await requireSubject(level, slug);
  return { title: `${LEVEL_LABEL[subject.level]} ${subject.name}` };
}

export default async function SubjectPage({ params }: Props) {
  await requireUser();
  const { level, subject: slug } = await params;
  const subject = await requireSubject(level, slug);
  const base = `/learn/${level}/${slug}`;

  const [topics, papers] = await Promise.all([
    db.topic.findMany({
      where: { subjectId: subject.id },
      orderBy: { position: "asc" },
      select: {
        id: true,
        slug: true,
        name: true,
        _count: {
          select: {
            notes: { where: { status: "PUBLISHED" } },
            questions: { where: practiceQuestionWhere(new Date()) },
          },
        },
      },
    }),
    db.pastPaper.findMany({
      where: { subjectId: subject.id, status: "PUBLISHED" },
      orderBy: [{ year: "desc" }, { paperNumber: "asc" }],
      select: { id: true, year: true, paperNumber: true, title: true },
    }),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Breadcrumbs items={[{ label: "Revise", href: "/learn" }, { label: subject.name }]} />
      <h1 className="text-2xl font-bold">
        {LEVEL_LABEL[subject.level]} {subject.name}
      </h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-[2fr_1fr]">
        <section>
          <h2 className="mb-3 text-lg font-semibold">Topics</h2>
          <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
            {topics.map((topic) => {
              const { notes, questions } = topic._count;
              const empty = notes === 0 && questions === 0;
              return (
                <li key={topic.id}>
                  <Link
                    href={`${base}/${topic.slug}`}
                    className="flex items-center justify-between gap-4 p-4 hover:bg-slate-50"
                  >
                    <span className={empty ? "text-slate-500" : "font-medium"}>{topic.name}</span>
                    <span className="shrink-0 text-xs text-slate-500">
                      {empty
                        ? "Coming soon"
                        : `${notes} ${notes === 1 ? "note" : "notes"} · ${questions} ${questions === 1 ? "question" : "questions"}`}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">Past papers</h2>
          {papers.length === 0 ? (
            <p className="text-sm text-slate-600">Past papers are being added.</p>
          ) : (
            <ul className="space-y-2">
              {papers.map((paper) => (
                <li key={paper.id}>
                  <Link
                    href={`${base}/papers/${paperSlug(paper.year, paper.paperNumber)}`}
                    className="block rounded-lg border border-slate-200 bg-white p-4 hover:border-brand-600"
                  >
                    <span className="font-medium">{paper.title}</span>
                    <span className="block text-xs text-slate-500">
                      {paper.year} · Paper {paper.paperNumber}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
