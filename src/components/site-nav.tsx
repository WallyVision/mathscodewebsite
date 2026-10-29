"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const pill = "rounded-full px-3 py-1.5 font-medium transition";
const idle = `${pill} text-slate-700 hover:bg-brand-50 hover:text-brand-700`;
const current = `${pill} bg-brand-600 text-white shadow-sm`;

const GCE_PATHS = ["/gce", "/learn", "/tests", "/tools", "/ask"];

function isActive(href: string, pathname: string): boolean {
  if (href === "/gce") return GCE_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** The main menu; the section you are in is highlighted in blue. */
export function SiteNav({ signedIn, staff }: { signedIn: boolean; staff: boolean }) {
  const pathname = usePathname();
  const link = (href: string, label: string, extra = "") => {
    const active = isActive(href, pathname);
    return (
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className={`${active ? current : idle} ${extra}`}
      >
        {label}
      </Link>
    );
  };

  if (signedIn) {
    return (
      <div className="flex flex-wrap items-center justify-end gap-x-1 gap-y-1 text-sm">
        {link("/gce", "GCE Prep")}
        {link("/opportunities", "Opportunities")}
        {staff && link("/admin", "Admin")}
        {link("/account", "Account")}
      </div>
    );
  }
  return (
    <div className="flex flex-wrap items-center justify-end gap-x-1 gap-y-1 text-sm">
      {link("/gce", "GCE Prep", "hidden sm:inline-block")}
      {link("/opportunities", "Opportunities", "hidden sm:inline-block")}
      {link("/login", "Log in")}
      <Link
        href="/register"
        className="ml-1 rounded-full bg-accent-500 px-3.5 py-1.5 font-semibold text-slate-900 shadow-sm hover:brightness-105"
      >
        Sign up
      </Link>
    </div>
  );
}
