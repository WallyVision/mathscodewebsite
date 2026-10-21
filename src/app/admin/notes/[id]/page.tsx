import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader, SavedBanner } from "@/components/admin";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Markdown } from "@/components/markdown";
import { loadContentOptions } from "@/lib/admin/options";
import { requireRole, STAFF_ROLES } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { levelSlug } from "@/lib/domain/levels";
import { NoteForm } from "../note-form";

export const metadata: Metadata = { title: "Edit note" };

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}

export default async function EditNotePage({ params, searchParams }: Props) {
  await requireRole(STAFF_ROLES);
  const [{ id }, { saved }] = await Promise.all([params, searchParams]);
  const [note, subjects] = await Promise.all([
    db.note.findUnique({
      where: { id },
      include: { topic: { include: { subject: true } } },
    }),
    loadContentOptions(),
  ]);
  if (!note) notFound();
  const { topic } = note;
  const publicUrl = `/learn/${levelSlug(topic.subject.level)}/${topic.subject.slug}/${topic.slug}/${note.slug}`;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <Breadcrumbs items={[{ label: "Notes", href: "/admin/notes" }, { label: "Edit" }]} />
        <PageHeader title="Edit note">
          {note.status === "PUBLISHED" && (
            <Link href={publicUrl} className="text-brand-700 underline">
              View on site
            </Link>
          )}
        </PageHeader>
        <SavedBanner show={saved === "1"} />
        <NoteForm
          key={note.updatedAt.toISOString()}
          subjects={subjects}
          initial={{
            id: note.id,
            topicId: note.topicId,
            title: note.title,
            slug: note.slug,
            body: note.body,
            status: note.status,
          }}
        />
      </div>
      <aside className="lg:sticky lg:top-4 lg:self-start">
        <h2 className="mb-3 text-sm font-semibold text-slate-500 uppercase">
          Student preview (last saved)
        </h2>
        <article className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="mb-4 text-xl font-bold">{note.title}</h3>
          <Markdown>{note.body}</Markdown>
        </article>
      </aside>
    </div>
  );
}
