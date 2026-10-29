"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export interface AdminLink {
  href: string;
  label: string;
  /** Shown as a badge, e.g. questions waiting for an answer. */
  count?: number;
}

// Pages that belong to a menu item without sitting under its address.
const BELONGS_TO: Record<string, string> = { "/admin/written": "/admin/papers" };

function activeHref(pathname: string, links: AdminLink[]): string | undefined {
  const owner = Object.entries(BELONGS_TO).find(([prefix]) => pathname.startsWith(prefix));
  if (owner) return owner[1];
  return links
    .filter((l) => (l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href)))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;
}

/** The admin menu; the page you are on is highlighted in blue. */
export function AdminNav({ links }: { links: AdminLink[] }) {
  const pathname = usePathname();
  const active = activeHref(pathname, links);
  const nav = useRef<HTMLElement>(null);
  // On narrow screens the menu scrolls sideways; bring the current item into view.
  useEffect(() => {
    nav.current
      ?.querySelector('[aria-current="page"]')
      ?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [active]);
  return (
    <nav
      ref={nav}
      aria-label="Admin"
      className="-mx-4 mb-6 overflow-x-auto border-b border-slate-200 px-4"
    >
      <ul className="flex gap-1 py-2 text-sm whitespace-nowrap">
        {links.map((link) => {
          const current = link.href === active;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={current ? "page" : undefined}
                className={`inline-flex items-center rounded-full px-3 py-1.5 font-medium transition ${
                  current
                    ? "bg-brand-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-brand-50 hover:text-brand-700"
                }`}
              >
                {link.label}
                {link.count !== undefined && link.count > 0 && (
                  <span className="ml-1.5 rounded-full bg-amber-500 px-1.5 py-0.5 text-xs font-semibold text-white">
                    {link.count}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
