import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Markdown } from "@/components/markdown";
import { DeadlineBadge } from "@/components/opportunities";
import { loadViewerAccess } from "@/lib/access";
import { appUrl } from "@/lib/app-url";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { checkoutPath } from "@/lib/domain/checkout";
import { canReadPosts } from "@/lib/domain/entitlements";
import { categoryBySlug, deadlineState, whatsappShareUrl } from "@/lib/domain/posts";
import { formatXaf, SUBSCRIPTION_PRICE } from "@/lib/domain/pricing";
import { formatDateTime } from "@/lib/format";
import { visiblePostWhere } from "@/lib/posts";
import { site } from "@/lib/site";

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
  const path = `/opportunities/${info.slug}/${post.slug}`;
  const url = `${await appUrl()}${path}`;
  const user = await getCurrentUser();
  // The article and apply link are only rendered (and so only sent) for members.
  const canRead = canReadPosts(user ? await loadViewerAccess(user) : null, now);

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

      {canRead ? (
        <>
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
            <ShareButton title={post.title} url={url} />
          </div>
          {closed && post.deadline && (
            <p className="mt-3 text-sm text-slate-500">
              Applications closed on {formatDateTime(post.deadline)}.
            </p>
          )}
        </>
      ) : (
        <div className="mt-6 rounded-lg border-2 border-dashed border-amber-300 bg-amber-50 p-5">
          <p className="font-semibold text-amber-900">🔒 For {site.name} members</p>
          <p className="mt-1 text-sm text-amber-900">
            Become a member to read the full{" "}
            {info.hasDeadlines ? "details and get the application link" : "guide"}. Membership also
            includes every worked solution and one competition subject with its weekly tests and
            monthly prizes.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {user ? (
              <Link
                href={checkoutPath({ kind: "SUBSCRIPTION", level: user.level }, path)}
                className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
              >
                Become a member: {formatXaf(SUBSCRIPTION_PRICE[user.level])}/month
              </Link>
            ) : (
              <>
                <Link
                  href={`/register?next=${encodeURIComponent(path)}`}
                  className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
                >
                  Sign up
                </Link>
                <Link
                  href={`/login?next=${encodeURIComponent(path)}`}
                  className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold"
                >
                  Log in
                </Link>
              </>
            )}
            <ShareButton title={post.title} url={url} />
          </div>
        </div>
      )}

      {info.hasDeadlines && (
        <p className="mt-6 rounded-md bg-slate-100 px-4 py-3 text-sm text-slate-700">
          Always apply through the official website. Genuine scholarships and employers never ask
          you to pay to apply or to pay an agent.
        </p>
      )}
    </article>
  );
}

function ShareButton({ title, url }: { title: string; url: string }) {
  return (
    <a
      href={whatsappShareUrl(title, url)}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
    >
      Share on WhatsApp
    </a>
  );
}
