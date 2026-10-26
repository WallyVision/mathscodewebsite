import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader, SavedBanner } from "@/components/admin";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ADMIN_ONLY, requireRole } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { levelSlug } from "@/lib/domain/levels";
import { LEVEL_LABEL } from "@/lib/domain/pricing";
import { AddTopicForm, EditSubjectForm, TopicRow } from "../subject-forms";

export const metadata: Metadata = { title: "Subject" };

export default async function SubjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireRole(ADMIN_ONLY);
  const [{ id }, { saved }] = await Promise.all([params, searchParams]);
  const subject = await db.subject.findUnique({
    where: { id },
    include: {
      topics: {
        orderBy: { position: "asc" },
        select: {
          id: true,
          name: true,
          position: true,
          _count: { select: { notes: true, questions: true } },
        },
      },
    },
  });
  if (!subject) notFound();
  const title = `${LEVEL_LABEL[subject.level]} ${subject.name}`;

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <Breadcrumbs items={[{ label: "Subjects", href: "/admin/subjects" }, { label: title }]} />
        <PageHeader title={title}>
          Web address: /learn/{levelSlug(subject.level)}/{subject.slug}
        </PageHeader>
        <SavedBanner show={saved === "1"}>Subject created. Add its topics below.</SavedBanner>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="mb-4 font-semibold">Details</h2>
        <EditSubjectForm subject={subject} />
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="mb-1 font-semibold">Topics</h2>
        <p className="mb-4 text-sm text-slate-600">
          The number sets the order students see. Renaming a topic keeps its web address.
        </p>
        {subject.topics.length === 0 ? (
          <p className="mb-4 text-sm text-slate-600">No topics yet.</p>
        ) : (
          <ul className="mb-6 space-y-2">
            {subject.topics.map((topic) => (
              <li key={topic.id} className="space-y-0.5">
                <TopicRow topic={topic} />
                <p className="pl-[4.5rem] text-xs text-slate-500">
                  {topic._count.notes} notes · {topic._count.questions} questions
                </p>
              </li>
            ))}
          </ul>
        )}
        <AddTopicForm subjectId={subject.id} />
      </section>
    </div>
  );
}
