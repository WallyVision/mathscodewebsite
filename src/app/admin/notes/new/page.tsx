import type { Metadata } from "next";
import { PageHeader } from "@/components/admin";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { loadContentOptions } from "@/lib/admin/options";
import { contentScope } from "@/lib/admin/scope";
import { requireRole, STAFF_ROLES } from "@/lib/auth/session";
import { NoteForm } from "../note-form";

export const metadata: Metadata = { title: "New note" };

export default async function NewNotePage() {
  const user = await requireRole(STAFF_ROLES);
  return (
    <div className="max-w-3xl">
      <Breadcrumbs items={[{ label: "Notes", href: "/admin/notes" }, { label: "New" }]} />
      <PageHeader title="New note" />
      <NoteForm subjects={await loadContentOptions(await contentScope(user))} initial={{}} />
    </div>
  );
}
