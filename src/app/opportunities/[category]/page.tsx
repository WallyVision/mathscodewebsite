import { loadViewerAccess } from "@/lib/access";
import { getCurrentUser } from "@/lib/auth/session";
import { canReadPosts } from "@/lib/domain/entitlements";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PostCard } from "@/components/opportunities";
import { categoryBySlug } from "@/lib/domain/posts";
import { listCategoryPosts } from "@/lib/posts";

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const info = categoryBySlug((await params).category);
  return info ? { title: info.label, description: info.description } : {};
}

export default async function CategoryPage({ params }: Props) {
  const info = categoryBySlug((await params).category);
  if (!info) notFound();
  const now = new Date();
  const user = await getCurrentUser();
  const locked = !canReadPosts(user ? await loadViewerAccess(user) : null, now);
  const { open, closed } = await listCategoryPosts(info.category, info.hasDeadlines, now);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumbs
        items={[{ label: "Opportunities", href: "/opportunities" }, { label: info.label }]}
      />
      <h1 className="text-2xl font-bold">
        <span aria-hidden>{info.icon}</span> {info.label}
      </h1>
      <p className="mt-1 text-slate-600">{info.description}</p>

      <section className="mt-6 space-y-3">
        {open.length === 0 ? (
          <p className="text-sm text-slate-600">
            {info.hasDeadlines
              ? "No open opportunities right now. Check back soon."
              : "Articles are on the way. Check back soon."}
          </p>
        ) : (
          open.map((post) => <PostCard key={post.slug} post={post} now={now} locked={locked} />)
        )}
      </section>

      {closed.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-3 text-sm font-semibold text-slate-500 uppercase">Recently closed</h2>
          <div className="space-y-3 opacity-75">
            {closed.map((post) => (
              <PostCard key={post.slug} post={post} now={now} locked={locked} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
