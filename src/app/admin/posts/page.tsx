import type { Metadata } from "next";
import Link from "next/link";
import type { PostCategory } from "@prisma/client";
import {
  EmptyRow,
  PageHeader,
  StatusBadge,
  tableClass,
  tdClass,
  thClass,
} from "@/components/admin";
import { DeadlineBadge } from "@/components/opportunities";
import { requireRole, STAFF_ROLES } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { CATEGORIES, categoryInfo } from "@/lib/domain/posts";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = { title: "Opportunities" };

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  await requireRole(STAFF_ROLES);
  const { category = "" } = await searchParams;
  const valid = CATEGORIES.some((c) => c.category === category);
  const now = new Date();
  const posts = await db.post.findMany({
    where: valid ? { category: category as PostCategory } : {},
    orderBy: { updatedAt: "desc" },
    take: 200,
    select: {
      id: true,
      title: true,
      category: true,
      status: true,
      deadline: true,
      updatedAt: true,
    },
  });

  return (
    <div>
      <PageHeader
        title="Opportunities & guides"
        action={{ href: "/admin/posts/new", label: "New post" }}
      >
        Scholarships, jobs, travel, finance and career posts. Published posts are public.
      </PageHeader>
      <nav className="mb-4 flex flex-wrap gap-2 text-sm">
        <Link
          href="/admin/posts"
          className={`rounded-full px-3 py-1 ${!valid ? "bg-slate-800 text-white" : "bg-white ring-1 ring-slate-300"}`}
        >
          All
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c.category}
            href={`/admin/posts?category=${c.category}`}
            className={`rounded-full px-3 py-1 ${category === c.category ? "bg-slate-800 text-white" : "bg-white ring-1 ring-slate-300"}`}
          >
            {c.icon} {c.label}
          </Link>
        ))}
      </nav>
      <div className="overflow-x-auto">
        <table className={tableClass}>
          <thead>
            <tr>
              <th className={thClass}>Title</th>
              <th className={thClass}>Section</th>
              <th className={thClass}>Deadline</th>
              <th className={thClass}>Updated</th>
              <th className={thClass}>Status</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 && <EmptyRow colSpan={5}>No posts yet.</EmptyRow>}
            {posts.map((post) => {
              const info = categoryInfo(post.category);
              return (
                <tr key={post.id}>
                  <td className={tdClass}>
                    <Link
                      href={`/admin/posts/${post.id}`}
                      className="font-medium text-brand-700 hover:underline"
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td className={tdClass}>
                    {info.icon} {info.label}
                  </td>
                  <td className={tdClass}>
                    {post.deadline ? <DeadlineBadge deadline={post.deadline} now={now} /> : "–"}
                  </td>
                  <td className={`${tdClass} whitespace-nowrap`}>
                    {formatDateTime(post.updatedAt)}
                  </td>
                  <td className={tdClass}>
                    <StatusBadge status={post.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
