import type { Metadata } from "next";
import { PageHeader } from "@/components/admin";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { loadContentOptions } from "@/lib/admin/options";
import { requireRole, STAFF_ROLES } from "@/lib/auth/session";
import { ImportForm } from "./import-form";

export const metadata: Metadata = { title: "Import questions" };

const EXAMPLE = `## Q1 · difficulty 1

**Stem**

Solve $3x - 7 = 11$.

**Options**

- A. $x = 4$
- B. $x = 6$
- C. $x = 7$
- D. $x = 18$

**Correct:** B

**Solution**

Add 7 to both sides: $3x = 18$. Divide by 3: $x = 6$.

---`;

export default async function ImportQuestionsPage() {
  await requireRole(STAFF_ROLES);
  const subjects = await loadContentOptions();
  return (
    <div className="max-w-3xl">
      <Breadcrumbs
        items={[{ label: "Questions", href: "/admin/questions" }, { label: "Import" }]}
      />
      <PageHeader title="Import questions">
        Add a whole set of MCQs at once. They are saved as drafts, so you can review each one before
        publishing.
      </PageHeader>
      <ImportForm subjects={subjects} />
      <details className="mt-8 rounded-md border border-slate-200 bg-white p-4 text-sm">
        <summary className="cursor-pointer font-medium">Format guide</summary>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-700">
          <li>
            Start each question with a heading line beginning <code>##</code>. Add{" "}
            <code>difficulty 1</code>, <code>2</code> or <code>3</code> to it (medium if left out).
          </li>
          <li>
            Then <code>**Stem**</code>, <code>**Options**</code> with four lines <code>- A.</code>{" "}
            to <code>- D.</code>, <code>**Correct:** B</code> and <code>**Solution**</code>.
          </li>
          <li>Maths and Markdown work exactly as in the question form.</li>
          <li>
            Press <strong>Check</strong> first: nothing is saved if any question has a problem. A
            question already in the subject is skipped, so importing twice is safe.
          </li>
        </ul>
        <pre className="mt-3 overflow-x-auto rounded bg-slate-50 p-3 text-xs">{EXAMPLE}</pre>
      </details>
    </div>
  );
}
