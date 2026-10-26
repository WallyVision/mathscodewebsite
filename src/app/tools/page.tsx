import type { Metadata } from "next";
import { db } from "@/lib/db";
import { LEVEL_LABEL } from "@/lib/domain/pricing";

export const metadata: Metadata = {
  title: "Tools",
  description: "Free calculators and study tools for GCE students.",
};

const host = (url: string) => {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
};

export default async function ToolsPage() {
  const tools = await db.tool.findMany({
    where: { published: true },
    orderBy: [{ position: "asc" }, { title: "asc" }],
    select: {
      id: true,
      title: true,
      description: true,
      url: true,
      subject: { select: { name: true, level: true } },
    },
  });
  // Group by subject, with general tools first.
  const groups = new Map<string, typeof tools>();
  for (const tool of tools) {
    const key = tool.subject ? `${LEVEL_LABEL[tool.subject.level]} ${tool.subject.name}` : "";
    groups.set(key, [...(groups.get(key) ?? []), tool]);
  }
  const ordered = [...groups.entries()].sort(([a], [b]) =>
    a === "" ? -1 : b === "" ? 1 : a.localeCompare(b),
  );

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold">Tools</h1>
        <p className="text-slate-600">
          Free calculators and tools for your revision. They open on their own websites in a new
          tab.
        </p>
      </div>

      {tools.length === 0 ? (
        <p className="text-sm text-slate-600">Tools are on the way. Check back soon.</p>
      ) : (
        ordered.map(([group, list]) => (
          <section key={group || "general"}>
            <h2 className="mb-3 text-lg font-semibold">{group || "For every subject"}</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {list.map((tool) => (
                <li key={tool.id}>
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-full flex-col rounded-lg border border-slate-200 bg-white p-4 hover:border-brand-600"
                  >
                    <span className="font-semibold text-brand-700">{tool.title} ↗</span>
                    <span className="mt-1 flex-1 text-sm text-slate-700">{tool.description}</span>
                    <span className="mt-2 text-xs text-slate-500">{host(tool.url)}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
