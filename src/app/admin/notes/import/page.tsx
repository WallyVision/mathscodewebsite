import type { Metadata } from "next";
import { PageHeader } from "@/components/admin";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { loadContentOptions } from "@/lib/admin/options";
import { contentScope } from "@/lib/admin/scope";
import { requireRole, STAFF_ROLES } from "@/lib/auth/session";
import { NoteImportForm } from "./import-form";

export const metadata: Metadata = { title: "Import notes" };

const EXAMPLE = `# Note 1

**Title:** Like terms

**URL name:** like-terms

**Body**

## Like terms

Terms are **like terms** when they have the same letters to the same powers:
$3a$ and $-a$ are like terms, $3a$ and $3b$ are not.

---

# Note 2

**Title:** Expanding brackets

**Body**

Multiply every term inside by the term outside: $2(x + 3) = 2x + 6$.`;

export default async function ImportNotesPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string; topic?: string }>;
}) {
  const { subject, topic } = await searchParams;
  const user = await requireRole(STAFF_ROLES);
  const subjects = await loadContentOptions(await contentScope(user));
  return (
    <div className="max-w-3xl">
      <Breadcrumbs items={[{ label: "Notes", href: "/admin/notes" }, { label: "Import" }]} />
      <PageHeader title="Import notes">
        Add several revision notes to a topic at once, from one file.
      </PageHeader>
      <NoteImportForm subjects={subjects} initial={{ subjectId: subject, topicId: topic }} />
      <details className="mt-8 rounded-md border border-slate-200 bg-white p-4 text-sm">
        <summary className="cursor-pointer font-medium">Format guide</summary>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-700">
          <li>
            Start each note with a line <code># Note 1</code>, <code># Note 2</code> and so on.
            Anything before the first note is ignored.
          </li>
          <li>
            Then <code>**Title:**</code>, an optional <code>**URL name:**</code> (made from the
            title if left out) and <code>**Body**</code>. Everything after <code>**Body**</code> up
            to the next <code># Note</code> line is the note.
          </li>
          <li>
            In the body, use <code>##</code> headings, lists, tables and maths exactly as in the
            note form. Do not start a line with <code># Note</code> inside a note.
          </li>
          <li>
            Press <strong>Check</strong> first: nothing is saved if any note has a problem. A note
            whose URL name the topic already has is skipped, so importing twice is safe.
          </li>
        </ul>
        <pre className="mt-3 overflow-x-auto rounded bg-slate-50 p-3 text-xs">{EXAMPLE}</pre>
      </details>
    </div>
  );
}
