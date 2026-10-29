import type { Metadata } from "next";
import { PageHeader } from "@/components/admin";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { loadContentOptions } from "@/lib/admin/options";
import { contentScope } from "@/lib/admin/scope";
import { requireRole, STAFF_ROLES } from "@/lib/auth/session";
import { WrittenImportForm } from "./import-form";

export const metadata: Metadata = { title: "Import written questions" };

const EXAMPLE = `# Section A

## A1 · 4 marks

**Topic:** Fractions

**Question**

Evaluate $\\frac{1}{2}$ of $\\frac{1}{3} + \\frac{1}{4}$.

**Solution**

$\\frac{1}{6} + \\frac{1}{4} = \\frac{5}{12}$

---

# Section B

## B1 · 15 marks

**Question**

a) the cost of running the car for 1 day.

b) the total cost for 5 days.

**Solution**

a) ...`;

export default async function ImportWrittenPage({
  searchParams,
}: {
  searchParams: Promise<{ paper?: string }>;
}) {
  const { paper } = await searchParams;
  const user = await requireRole(STAFF_ROLES);
  const subjects = await loadContentOptions(await contentScope(user));
  const papers = subjects.flatMap((s) =>
    s.papers.map((p) => ({ id: p.id, name: `${s.name} · ${p.name}` })),
  );
  return (
    <div className="max-w-3xl">
      <Breadcrumbs
        items={[
          { label: "Past papers", href: "/admin/papers" },
          { label: "Import written questions" },
        ]}
      />
      <PageHeader title="Import written questions">
        Add a structured paper (such as Paper 2) to a past paper at once: each question with its
        marks and worked solution.
      </PageHeader>
      <WrittenImportForm papers={papers} initialPaperId={paper} />
      <details className="mt-8 rounded-md border border-slate-200 bg-white p-4 text-sm">
        <summary className="cursor-pointer font-medium">Format guide</summary>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-700">
          <li>
            Optional section lines: <code># Section A</code>, <code># Section B</code>. Questions
            after one belong to that section.
          </li>
          <li>
            Start each question with <code>## A1 · 4 marks</code>: the label first, then the marks.
          </li>
          <li>
            An optional <code>**Topic:**</code> line names a topic of the subject, exactly as in
            Subjects.
          </li>
          <li>
            Then <code>**Question**</code> with every part, and <code>**Solution**</code> with the
            worked solution. Tables and maths work as everywhere else.
          </li>
          <li>
            Press <strong>Check</strong> first: nothing is saved if anything has a problem. A label
            the paper already has is skipped, so you can import the file again after adding
            questions to it.
          </li>
        </ul>
        <pre className="mt-3 overflow-x-auto rounded bg-slate-50 p-3 text-xs">{EXAMPLE}</pre>
      </details>
    </div>
  );
}
