"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";

const LINKS = [
  { href: "/gce", label: "Home", match: (p: string) => p === "/gce" },
  { href: "/learn", label: "Revise", match: (p: string) => p.startsWith("/learn") },
  { href: "/tests", label: "Tests", match: (p: string) => p.startsWith("/tests") },
];

/** Sub-navigation shown on every GCEPrep237 page. */
export function GceNav() {
  const pathname = usePathname();
  return (
    <div className="border-b border-brand-100 bg-brand-50">
      <nav
        aria-label={site.gcePrep.name}
        className="mx-auto flex max-w-5xl items-center gap-4 overflow-x-auto px-4 py-2 text-sm"
      >
        <Link href="/gce" className="shrink-0 font-bold text-brand-700">
          📚 {site.gcePrep.name}
        </Link>
        <span className="h-4 w-px shrink-0 bg-brand-100" aria-hidden />
        {LINKS.map((link) => {
          const active = link.match(pathname);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={`shrink-0 ${active ? "font-semibold text-brand-900 underline underline-offset-4" : "text-slate-700 hover:text-brand-700"}`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
