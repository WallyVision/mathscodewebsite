import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Markdown } from "@/components/markdown";
import { requireUser } from "@/lib/auth/session";
import { requireSubject, requireTopic } from "@/lib/content";
import { db } from "@/lib/db";

interface Props {
  params: Promise<{ level: string; subject: string; topic: string; note: string }>;
}

// Keyed on strings so the page and its metadata share one lookup per request.
const loadNote = cache(
  async (level: string, subjectSlug: string, topicSlug: string, noteSlug: string) => {
    const subject = await requireSubject(level, subjectSlug);
    const topic = await requireTopic(subject.id, topicSlug);
    const note = await db.note.findUnique({
      where: { topicId_slug: { topicId: topic.id, slug: noteSlug } },
    });
    if (!note || note.status !== "PUBLISHED") notFound();
    return { subject, topic, note, subjectHref: `/learn/${level}/${subjectSlug}` };
  },
);

async function loadFromParams({ params }: Props) {
  const p = await params;
  return loadNote(p.level, p.subject, p.topic, p.note);
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { note, subject } = await loadFromParams(props);
  return { title: `${note.title} · ${subject.name}` };
}

export default async function NotePage(props: Props) {
  await requireUser();
  const { subject, topic, note, subjectHref } = await loadFromParams(props);
  const topicHref = `${subjectHref}/${topic.slug}`;

  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumbs
        items={[
          { label: "Revise", href: "/learn" },
          { label: subject.name, href: subjectHref },
          { label: topic.name, href: topicHref },
          { label: note.title },
        ]}
      />
      <h1 className="mb-6 text-2xl font-bold">{note.title}</h1>
      <div className="rounded-lg border border-slate-200 bg-white p-5 sm:p-8">
        <Markdown>{note.body}</Markdown>
      </div>
      <Link
        href={topicHref}
        className="mt-6 inline-block rounded-md bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-700"
      >
        Practise {topic.name} questions →
      </Link>
    </article>
  );
}
