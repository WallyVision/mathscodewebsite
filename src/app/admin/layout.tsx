import type { Metadata } from "next";
import Link from "next/link";
import { requireRole, STAFF_ROLES } from "@/lib/auth/session";

export const metadata: Metadata = { title: { default: "Admin", template: "%s · Admin" } };

const LINKS = [
  { href: "/admin", label: "Overview", adminOnly: false },
  { href: "/admin/questions", label: "Questions", adminOnly: false },
  { href: "/admin/notes", label: "Notes", adminOnly: false },
  { href: "/admin/papers", label: "Past papers", adminOnly: false },
  { href: "/admin/posts", label: "Opportunities", adminOnly: false },
  { href: "/admin/tests", label: "Tests", adminOnly: true },
  { href: "/admin/students", label: "Students", adminOnly: true },
  { href: "/admin/prizes", label: "Prizes", adminOnly: true },
];

// Access is also checked on every admin page and action; this layout only hides the menu.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole(STAFF_ROLES);
  const links = LINKS.filter((l) => !l.adminOnly || user.role === "ADMIN");

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <nav aria-label="Admin" className="-mx-4 mb-6 overflow-x-auto border-b border-slate-200 px-4">
        <ul className="flex gap-1 text-sm whitespace-nowrap">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="inline-block rounded-t-md px-3 py-2 font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {children}
    </div>
  );
}
