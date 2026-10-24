import Link from "next/link";
import type { PostCategory } from "@prisma/client";
import { CATEGORIES, categoryInfo, daysLeft, deadlineState } from "@/lib/domain/posts";
import { formatDateTime } from "@/lib/format";

/** The five big buttons: scholarships, jobs, travel, finance, careers. */
export function CategoryButtons({ compact = false }: { compact?: boolean }) {
  return (
    <ul
      className={`grid gap-3 ${compact ? "grid-cols-2 sm:grid-cols-5" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"}`}
    >
      {CATEGORIES.map((c) => (
        <li key={c.slug} className={c.slug === "careers" ? "col-span-2 sm:col-span-1" : ""}>
          <Link
            href={`/opportunities/${c.slug}`}
            className="flex h-full flex-col items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-brand-600 hover:shadow-md"
          >
            <span className="text-3xl" aria-hidden>
              {c.icon}
            </span>
            <span className="text-sm font-semibold">{c.label}</span>
            {!compact && (
              <span className="hidden text-xs text-slate-500 sm:block">{c.description}</span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function DeadlineBadge({ deadline, now }: { deadline: Date | null; now: Date }) {
  const state = deadlineState(deadline, now);
  if (state === "none" || !deadline) return null;
  const styles = {
    open: "bg-emerald-100 text-emerald-800",
    "closing-soon": "bg-amber-100 text-amber-900",
    closed: "bg-slate-200 text-slate-600",
  } as const;
  const days = daysLeft(deadline, now);
  const text =
    state === "closed"
      ? "Closed"
      : state === "closing-soon"
        ? `Closes in ${days} day${days === 1 ? "" : "s"}`
        : `Deadline ${formatDateTime(deadline)}`;
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${styles[state]}`}>
      {text}
    </span>
  );
}

export interface PostSummary {
  slug: string;
  title: string;
  summary: string;
  category: PostCategory;
  organisation: string | null;
  location: string | null;
  deadline: Date | null;
}

export function PostCard({
  post,
  now,
  showCategory = false,
}: {
  post: PostSummary;
  now: Date;
  showCategory?: boolean;
}) {
  const info = categoryInfo(post.category);
  return (
    <Link
      href={`/opportunities/${info.slug}/${post.slug}`}
      className="block rounded-lg border border-slate-200 bg-white p-4 transition hover:border-brand-600"
    >
      <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
        {showCategory && (
          <span>
            {info.icon} {info.label}
          </span>
        )}
        {post.organisation && <span>{post.organisation}</span>}
        {post.location && <span>· {post.location}</span>}
      </div>
      <h3 className="font-semibold">{post.title}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-slate-600">{post.summary}</p>
      <div className="mt-2">
        <DeadlineBadge deadline={post.deadline} now={now} />
      </div>
    </Link>
  );
}
