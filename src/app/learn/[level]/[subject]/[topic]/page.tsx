import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { QuestionCard } from "@/components/question-card";
import { requireUser } from "@/lib/auth/session";
import { getTopicPracticeQuestions, requireSubject, requireTopic } from "@/lib/content";
import { db } from "@/lib/db";

interface Props {
  params: Promise<{ level: string; subject: string; topic: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { level, subject: subjectSlug, topic: topicSlug } = await params;
  const subject = await requireSubject(level, subjectSlug);
  const topic = await requireTopic(subject.id, topicSlug);
  return { title: `${topic.name} · ${subject.name}` };
}

export default async function TopicPage({ params }: Props) {
  const user = await requireUser();
  const { level, subject: subjectSlug, topic: topicSlug } = await params;
  const subject = await requireSubject(level, subjectSlug);
  const topic = await requireTopic(subject.id, topicSlug);
  const subjectHref = `/learn/${level}/${subjectSlug}`;

  const [notes, questions] = await Promise.all([
    db.note.findMany({
      where: { topicId: topic.id, status: "PUBLISHED" },
      orderBy: { createdAt: "asc" },
      select: { id: true, slug: true, title: true },
    }),
    getTopicPracticeQuestions(topic.id, subject.level, user),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumbs
        items={[
          { label: "Revise", href: "/learn" },
          { label: subject.name, href: subjectHref },
          { label: topic.name },
        ]}
      />
      <h1 className="text-2xl font-bold">{topic.name}</h1>

      <section className="mt-6">
        <h2 className="mb-3 text-lg font-semibold">Notes</h2>
        {notes.length === 0 ? (
          <p className="text-sm text-slate-600">Notes for this topic are being written.</p>
        ) : (
          <ul className="space-y-2">
            {notes.map((note) => (
              <li key={note.id}>
                <Link
                  href={`${subjectHref}/${topic.slug}/${note.slug}`}
                  className="block rounded-lg border border-slate-200 bg-white p-4 font-medium hover:border-brand-600"
                >
                  {note.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-lg font-semibold">Practice questions</h2>
        {questions.length === 0 ? (
          <p className="text-sm text-slate-600">
            Practice questions for this topic are coming soon.
          </p>
        ) : (
          <div className="space-y-4">
            {questions.map((question, i) => (
              <QuestionCard
                key={question.id}
                question={question}
                index={i}
                returnTo={`${subjectHref}/${topic.slug}`}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
