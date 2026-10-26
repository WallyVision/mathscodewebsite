import type { Metadata } from "next";
import { PageHeader } from "@/components/admin";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { loadTestFormOptions } from "@/lib/admin/tests";
import { ADMIN_ONLY, requireRole } from "@/lib/auth/session";
import { TestForm } from "../test-form";

export const metadata: Metadata = { title: "New test" };

export default async function NewTestPage() {
  await requireRole(ADMIN_ONLY);
  const { subjects, questions, unusedBank } = await loadTestFormOptions();
  return (
    <div className="max-w-3xl">
      <Breadcrumbs items={[{ label: "Tests", href: "/admin/tests" }, { label: "New" }]} />
      <PageHeader title="New test" />
      <TestForm
        subjects={subjects}
        questions={questions}
        unusedBank={unusedBank}
        initial={{ questionMode: "DRAW" }}
        locked={false}
      />
    </div>
  );
}
