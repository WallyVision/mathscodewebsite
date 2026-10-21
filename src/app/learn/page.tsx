import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { levelSlug } from "@/lib/domain/levels";
import { LEVEL_LABEL } from "@/lib/domain/pricing";

export const metadata: Metadata = { title: "Revise" };

export default async function LearnPage() {
  const user = await requireUser();
  const subjects = await db.subject.findMany({
    orderBy: [{ level: "asc" }, { name: "asc" }],
    select: { id: true, level: true, slug: true, name: true, _count: { select: { topics: true } } },
  });
  // Show the student's own level first.
  const levels =
    user.level === "O_LEVEL"
      ? (["O_LEVEL", "A_LEVEL"] as const)
      : (["A_LEVEL", "O_LEVEL"] as const);

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold">Revise</h1>
        <p className="text-slate-600">Notes, past questions and practice by topic.</p>
      </div>
      {levels.map((level) => {
        const list = subjects.filter((s) => s.level === level);
        if (list.length === 0) return null;
        return (
          <section key={level}>
            <h2 className="mb-3 text-lg font-semibold">{LEVEL_LABEL[level]}</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {list.map((subject) => (
                <li key={subject.id}>
                  <Link
                    href={`/learn/${levelSlug(subject.level)}/${subject.slug}`}
                    className="block rounded-lg border border-slate-200 bg-white p-5 transition hover:border-brand-600 hover:shadow-sm"
                  >
                    <span className="font-semibold">{subject.name}</span>
                    <span className="block text-sm text-slate-500">
                      {subject._count.topics} topics
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
