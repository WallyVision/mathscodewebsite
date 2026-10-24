import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Markdown } from "@/components/markdown";
import { DeadlineBadge } from "@/components/opportunities";
import { appUrl } from "@/lib/app-url";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { categoryBySlug, deadlineState, whatsappShareUrl } from "@/lib/domain/posts";
import { formatDateTime } from "@/lib/format";
import { visiblePostWhere } from "@/lib/posts";

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

const loadPost = cache(async (categorySlug: string, slug: string) => {
  const info = categoryBySlug(categorySlug);
  if (!info) return null;
  const post = await db.post.findFirst({
    where: { ...visiblePostWhere(new Date()), slug, category: info.category },
  });
  return post ? { post, info } : null;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const found = await loadPost(category, slug);
  if (!found) return {};
  return {
    title: found.post.title,
    description: found.post.summary,
    openGraph: { title: found.post.title, description: found.post.summary, type: "article" },
  };
}

export default async function PostPage({ params }: Props) {
  const { category, slug } = await params;
  const found = await loadPost(category, slug);
  if (!found) notFound();
  const { post, info } = found;
  const now = new Date();
  const closed = deadlineState(post.deadline, now) === "closed";
  const url = `${await appUrl()}/opportunities/${info.slug}/${post.slug}`;
  const user = await getCurrentUser();

  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumbs
        items={[
          { label: "Opportunities", href: "/opportunities" },
          { label: info.label, href: `/opportunities/${info.slug}` },
          { label: post.title },
        ]}
      />
      <h1 className="text-2xl font-bold">{post.title}</h1>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-600">
        {post.organisation && <span>{post.organisation}</span>}
        {post.location && <span>· {post.location}</span>}
        <DeadlineBadge deadline={post.deadline} now={now} />
      </div>
      <p className="mt-4 text-lg text-slate-700">{post.summary}</p>

      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5 sm:p-8">
        <Markdown>{post.body}</Markdown>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {post.externalUrl && !closed && (
          <a
            href={post.externalUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="rounded-md bg-brand-600 px-5 py-2.5 font-semibold text-white hover:bg-brand-700"
          >
            {info.hasDeadlines ? "Apply / official page" : "Read more"} ↗
          </a>
        )}
        <a
          href={whatsappShareUrl(post.title, url)}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md bg-emerald-600 px-5 py-2.5 font-semibold text-white hover:bg-emerald-700"
        >
          Share on WhatsApp
        </a>
      </div>
      {closed && post.deadline && (
        <p className="mt-3 text-sm text-slate-500">
          Applications closed on {formatDateTime(post.deadline)}.
        </p>
      )}

      {info.hasDeadlines && (
        <p className="mt-6 rounded-md bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Always apply through the official website. Genuine scholarships and employers never ask
          you to pay to apply or to pay an agent.
        </p>
      )}

      {!user && (
        <div className="mt-8 rounded-lg bg-brand-50 p-5">
          <p className="font-semibold text-brand-900">Preparing for the GCE?</p>
          <p className="mt-1 text-sm text-brand-900">
            Free notes and past questions, weekly tests and cash prizes.
          </p>
          <Link
            href="/register"
            className="mt-3 inline-block rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Join Prep237 free
          </Link>
        </div>
      )}
    </article>
  );
}
