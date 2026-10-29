import type { Metadata } from "next";
import { AdminNav } from "@/components/admin-nav";
import { contentScope } from "@/lib/admin/scope";
import { openQuestionCount } from "@/lib/ask";
import { requireRole, STAFF_ROLES } from "@/lib/auth/session";

export const metadata: Metadata = { title: { default: "Admin", template: "%s · Admin" } };

const LINKS = [
  { href: "/admin", label: "Overview", adminOnly: false },
  { href: "/admin/ask", label: "Student questions", adminOnly: false },
  { href: "/admin/questions", label: "Questions", adminOnly: false },
  { href: "/admin/notes", label: "Notes", adminOnly: false },
  { href: "/admin/papers", label: "Past papers", adminOnly: false },
  { href: "/admin/posts", label: "Opportunities", adminOnly: false },
  { href: "/admin/media", label: "Images", adminOnly: false },
  { href: "/admin/earnings", label: "Earnings", adminOnly: false },
  { href: "/admin/subjects", label: "Subjects", adminOnly: true },
  { href: "/admin/tests", label: "Tests", adminOnly: true },
  { href: "/admin/students", label: "Students", adminOnly: true },
  { href: "/admin/prizes", label: "Prizes", adminOnly: true },
  { href: "/admin/tools", label: "Tools", adminOnly: true },
];

// Access is also checked on every admin page and action; this layout only hides the menu.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole(STAFF_ROLES);
  const links = LINKS.filter((l) => !l.adminOnly || user.role === "ADMIN");
  const waiting = await openQuestionCount(await contentScope(user));

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <AdminNav
        links={links.map(({ href, label }) => ({
          href,
          label,
          count: href === "/admin/ask" ? waiting : undefined,
        }))}
      />
      {children}
    </div>
  );
}
