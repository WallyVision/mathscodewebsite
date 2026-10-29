import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { contentScope, inScope } from "@/lib/admin/scope";
import { requireRole, STAFF_ROLES } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { WrittenQuestionForm } from "../written-form";

export const metadata: Metadata = { title: "New written question" };

export default async function NewWrittenQuestionPage({
  searchParams,
}: {
  searchParams: Promise<{ paper?: string }>;
}) {
  const user = await requireRole(STAFF_ROLES);
  const { paper: paperId = "" } = await searchParams;
  const paper = await db.pastPaper.findUnique({
    where: { id: paperId },
    select: {
      id: true,
      title: true,
      subjectId: true,
      subject: {
        select: { topics: { orderBy: { position: "asc" }, select: { id: true, name: true } } },
      },
    },
  });
  if (!paper || !inScope(await contentScope(user), paper.subjectId)) notFound();

  return (
    <div className="max-w-3xl">
      <Breadcrumbs
        items={[
          { label: "Past papers", href: "/admin/papers" },
          { label: paper.title, href: `/admin/papers/${paper.id}` },
          { label: "New written question" },
        ]}
      />
      <PageHeader title="New written question">
        A structured question with marks and a worked solution, such as a Paper 2 question.
      </PageHeader>
      <WrittenQuestionForm topics={paper.subject.topics} initial={{ pastPaperId: paper.id }} />
    </div>
  );
}
