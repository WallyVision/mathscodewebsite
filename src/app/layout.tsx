import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/session";
import { site } from "@/lib/site";
import "katex/dist/katex.min.css";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: site.name, template: `%s · ${site.name}` },
  description: `${site.slogan}. ${site.tagline}`,
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
          <nav className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
            <Link
              href={user ? "/dashboard" : "/"}
              className="shrink-0 text-base font-bold text-brand-700 sm:text-lg"
            >
              {site.name}
            </Link>
            <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1 text-sm sm:gap-x-4">
              {user ? (
                <>
                  <Link href="/gce" className="font-medium hover:text-brand-700">
                    GCE Prep
                  </Link>
                  <Link href="/opportunities" className="font-medium hover:text-brand-700">
                    Opportunities
                  </Link>
                  {user.role !== "STUDENT" && (
                    <Link href="/admin" className="font-medium text-brand-700 hover:underline">
                      Admin
                    </Link>
                  )}
                  <Link href="/account" className="font-medium hover:text-brand-700">
                    Account
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/gce" className="hidden font-medium hover:text-brand-700 sm:inline">
                    GCE Prep
                  </Link>
                  <Link
                    href="/opportunities"
                    className="hidden font-medium hover:text-brand-700 sm:inline"
                  >
                    Opportunities
                  </Link>
                  <Link href="/login" className="font-medium hover:text-brand-700">
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-md bg-brand-600 px-3 py-1.5 font-medium text-white hover:bg-brand-700"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} {site.name}. {site.gcePrep.name} is not affiliated with the
          Cameroon GCE Board.
        </footer>
      </body>
    </html>
  );
}
