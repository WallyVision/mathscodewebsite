import type { Metadata } from "next";
import { PageHeader } from "@/components/admin";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { loadContentOptions } from "@/lib/admin/options";
import { requireRole, STAFF_ROLES } from "@/lib/auth/session";
import { PaperForm } from "../paper-form";

export const metadata: Metadata = { title: "New past paper" };

export default async function NewPaperPage() {
  await requireRole(STAFF_ROLES);
  return (
    <div className="max-w-xl">
      <Breadcrumbs items={[{ label: "Past papers", href: "/admin/papers" }, { label: "New" }]} />
      <PageHeader title="New past paper" />
      <PaperForm subjects={await loadContentOptions()} initial={{}} />
    </div>
  );
}
