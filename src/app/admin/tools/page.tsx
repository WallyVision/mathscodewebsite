import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/admin";
import { ADMIN_ONLY, requireRole } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { LEVEL_LABEL } from "@/lib/domain/pricing";
import { ToolForm } from "./tool-form";

export const metadata: Metadata = { title: "Tools" };

export default async function AdminToolsPage() {
  await requireRole(ADMIN_ONLY);
  const [tools, subjects] = await Promise.all([
    db.tool.findMany({ orderBy: [{ position: "asc" }, { title: "asc" }] }),
    db.subject.findMany({
      orderBy: [{ level: "asc" }, { name: "asc" }],
      select: { id: true, name: true, level: true },
    }),
  ]);
  const subjectOptions = subjects.map((s) => ({
    id: s.id,
    label: `${LEVEL_LABEL[s.level]} ${s.name}`,
  }));

  return (
    <div className="max-w-3xl space-y-8">
      <PageHeader title="Tools">
        Links to calculators and study tools on other websites, listed for every student on{" "}
        <Link href="/tools" className="text-brand-700 underline">
          the Tools page
        </Link>
        . Only add sites you trust: students leave StudentLife237 when they open them.
      </PageHeader>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="mb-4 font-semibold">Add a tool</h2>
        <ToolForm
          initial={{
            title: "",
            description: "",
            url: "",
            subjectId: "",
            position: String(tools.length),
            published: true,
          }}
          subjects={subjectOptions}
        />
      </section>

      <section className="space-y-4">
        <h2 className="font-semibold">Tools ({tools.length})</h2>
        {tools.length === 0 && <p className="text-sm text-slate-600">No tools yet.</p>}
        {tools.map((tool) => (
          <div key={tool.id} className="rounded-lg border border-slate-200 bg-white p-5">
            <ToolForm
              initial={{
                id: tool.id,
                title: tool.title,
                description: tool.description,
                url: tool.url,
                subjectId: tool.subjectId ?? "",
                position: String(tool.position),
                published: tool.published,
              }}
              subjects={subjectOptions}
            />
          </div>
        ))}
      </section>
    </div>
  );
}
