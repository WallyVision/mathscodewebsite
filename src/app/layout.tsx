import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { BrandMark, FlagStripe } from "@/components/brand";
import { InstallApp } from "@/components/install-app";
import { LogoutButton, SiteNav } from "@/components/site-nav";
import { getCurrentUser } from "@/lib/auth/session";
import { site } from "@/lib/site";
import "katex/dist/katex.min.css";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: site.name, template: `%s · ${site.name}` },
  description: `${site.slogan}. ${site.tagline}`,
  applicationName: site.name,
  appleWebApp: { capable: true, title: site.name, statusBarStyle: "default" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1d5fd1",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body className="flex min-h-dvh flex-col">
        <header className="border-b border-slate-200 bg-white">
          <FlagStripe />
          <nav className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-3 gap-y-2 px-4 py-2.5">
            <Link href={user ? "/dashboard" : "/"} className="shrink-0" aria-label={site.name}>
              <BrandMark />
            </Link>
            {user && <LogoutButton className="sm:hidden" />}
            <SiteNav signedIn={!!user} staff={!!user && user.role !== "STUDENT"} />
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-slate-200 bg-white px-4 py-6 text-center text-xs text-slate-500">
          <InstallApp />
          <nav className="mb-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm">
            <Link href="/contact" className="hover:text-brand-700">
              Contact
            </Link>
            <Link href="/terms" className="hover:text-brand-700">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-brand-700">
              Privacy
            </Link>
            <Link href="/refunds" className="hover:text-brand-700">
              Refunds
            </Link>
          </nav>
          © {new Date().getFullYear()} {site.name}. {site.gcePrep.name} is not affiliated with the
          Cameroon GCE Board.
        </footer>
      </body>
    </html>
  );
}
