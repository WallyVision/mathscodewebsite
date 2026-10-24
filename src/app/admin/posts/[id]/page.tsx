import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader, SavedBanner } from "@/components/admin";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Markdown } from "@/components/markdown";
import { DeadlineBadge } from "@/components/opportunities";
import { requireRole, STAFF_ROLES } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { categoryInfo } from "@/lib/domain/posts";
import { toDoualaInput } from "@/lib/format";
import { PostForm } from "../post-form";

export const metadata: Metadata = { title: "Edit post" };

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}

export default async function EditPostPage({ params, searchParams }: Props) {
  await requireRole(STAFF_ROLES);
  const [{ id }, { saved }] = await Promise.all([params, searchParams]);
  const post = await db.post.findUnique({ where: { id } });
  if (!post) notFound();
  const info = categoryInfo(post.category);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <Breadcrumbs
          items={[{ label: "Opportunities", href: "/admin/posts" }, { label: "Edit" }]}
        />
        <PageHeader title="Edit post">
          {post.status === "PUBLISHED" && (
            <Link
              href={`/opportunities/${info.slug}/${post.slug}`}
              className="text-brand-700 underline"
            >
              View on site
            </Link>
          )}
        </PageHeader>
        <SavedBanner show={saved === "1"} />
        <PostForm
          key={post.updatedAt.toISOString()}
          initial={{
            id: post.id,
            category: post.category,
            title: post.title,
            slug: post.slug,
            summary: post.summary,
            body: post.body,
            externalUrl: post.externalUrl ?? "",
            organisation: post.organisation ?? "",
            location: post.location ?? "",
            deadline: post.deadline ? toDoualaInput(post.deadline) : "",
            status: post.status,
          }}
        />
      </div>
      <aside className="lg:sticky lg:top-4 lg:self-start">
        <h2 className="mb-3 text-sm font-semibold text-slate-500 uppercase">
          Preview (last saved)
        </h2>
        <article className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-xs text-slate-500">
            {info.icon} {info.label}
            {post.organisation && ` · ${post.organisation}`}
          </p>
          <h3 className="mt-1 text-xl font-bold">{post.title}</h3>
          <div className="mt-2">
            <DeadlineBadge deadline={post.deadline} now={new Date()} />
          </div>
          <p className="mt-3 text-slate-700">{post.summary}</p>
          <div className="mt-4">
            <Markdown>{post.body}</Markdown>
          </div>
        </article>
      </aside>
    </div>
  );
}
