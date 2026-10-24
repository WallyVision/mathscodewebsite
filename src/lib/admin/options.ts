import "server-only";
import { db } from "@/lib/db";
import { LEVEL_LABEL } from "@/lib/domain/pricing";

/** Subjects, topics and past papers for content form dropdowns. */
export async function loadContentOptions() {
  const subjects = await db.subject.findMany({
    orderBy: [{ level: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      level: true,
      topics: { orderBy: { position: "asc" }, select: { id: true, name: true } },
      pastPapers: {
        orderBy: [{ year: "desc" }, { paperNumber: "asc" }],
        select: { id: true, title: true, year: true, paperNumber: true },
      },
    },
  });
  return subjects.map((s) => ({
    id: s.id,
    name: `${LEVEL_LABEL[s.level]} ${s.name}`,
    topics: s.topics.map((t) => ({ id: t.id, name: t.name })),
    papers: s.pastPapers.map((p) => ({
      id: p.id,
      name: `${p.year} Paper ${p.paperNumber}: ${p.title}`,
    })),
  }));
}

export type ContentOptions = Awaited<ReturnType<typeof loadContentOptions>>;
