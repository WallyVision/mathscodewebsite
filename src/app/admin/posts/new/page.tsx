import type { Metadata } from "next";
import { PageHeader } from "@/components/admin";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { requireRole, STAFF_ROLES } from "@/lib/auth/session";
import { PostForm } from "../post-form";

export const metadata: Metadata = { title: "New post" };

export default async function NewPostPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  await requireRole(STAFF_ROLES);
  const { category } = await searchParams;
  return (
    <div className="max-w-3xl">
      <Breadcrumbs items={[{ label: "Opportunities", href: "/admin/posts" }, { label: "New" }]} />
      <PageHeader title="New post" />
      <PostForm initial={category ? { category } : {}} />
    </div>
  );
}
