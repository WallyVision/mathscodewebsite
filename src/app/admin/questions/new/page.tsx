import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHeader } from "@/components/admin";
import { loadContentOptions } from "@/lib/admin/options";
import { requireRole, STAFF_ROLES } from "@/lib/auth/session";
import { QuestionForm } from "../question-form";

export const metadata: Metadata = { title: "New question" };

export default async function NewQuestionPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string; paper?: string }>;
}) {
  await requireRole(STAFF_ROLES);
  const { subject, paper } = await searchParams;
  const subjects = await loadContentOptions();
  return (
    <div className="max-w-3xl">
      <Breadcrumbs items={[{ label: "Questions", href: "/admin/questions" }, { label: "New" }]} />
      <PageHeader title="New question" />
      <QuestionForm
        subjects={subjects}
        initial={{
          ...(subject ? { subjectId: subject } : {}),
          ...(paper ? { pastPaperId: paper } : {}),
        }}
      />
    </div>
  );
}
