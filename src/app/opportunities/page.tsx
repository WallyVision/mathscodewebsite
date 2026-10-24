import { loadViewerAccess } from "@/lib/access";
import { getCurrentUser } from "@/lib/auth/session";
import { canReadPosts } from "@/lib/domain/entitlements";
import type { Metadata } from "next";
import { CategoryButtons, PostCard } from "@/components/opportunities";
import { latestPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Opportunities",
  description:
    "Scholarships, jobs, studying abroad, money management and career guidance for Cameroonian students.",
};

export default async function OpportunitiesPage() {
  const now = new Date();
  const user = await getCurrentUser();
  const locked = !canReadPosts(user ? await loadViewerAccess(user) : null, now);
  const posts = await latestPosts(now);
  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold">Beyond the GCE</h1>
        <p className="text-slate-600">
          Scholarships, jobs, studying abroad, money and careers. Full articles and application
          links come with every subscription.
        </p>
      </div>
      <CategoryButtons />
      <section>
        <h2 className="mb-3 text-lg font-semibold">Latest</h2>
        {posts.length === 0 ? (
          <p className="text-sm text-slate-600">New posts are on the way. Check back soon.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} now={now} showCategory locked={locked} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
