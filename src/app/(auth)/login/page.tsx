import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { safeReturnPath } from "@/lib/domain/checkout";
import { site } from "@/lib/site";
import { supportWhatsApp } from "@/lib/support";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Log in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ reset?: string; next?: string }>;
}) {
  const { reset, next: nextParam } = await searchParams;
  const next = safeReturnPath(nextParam ?? "") ?? undefined;
  if (await getCurrentUser()) redirect(next ?? "/dashboard");
  const support = supportWhatsApp();
  return (
    <div className="mx-auto max-w-sm px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">Log in</h1>
      {reset === "1" && (
        <p
          role="status"
          className="mb-4 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800"
        >
          Your password has been changed. Log in with the new one.
        </p>
      )}
      <LoginForm next={next} />
      <details className="mt-4 text-sm text-slate-600">
        <summary className="cursor-pointer text-brand-700 hover:underline">
          Forgot your password?
        </summary>
        <p className="mt-2">
          {support ? (
            <>
              Message us on{" "}
              <a href={`https://wa.me/${support}`} className="font-medium text-brand-700 underline">
                WhatsApp
              </a>{" "}
              from the phone number on your account and we will send you a reset link.
            </>
          ) : (
            `Contact ${site.name} support from the phone number on your account and we will send you a reset link.`
          )}
        </p>
      </details>
      <p className="mt-6 text-center text-sm text-slate-600">
        New here?{" "}
        <Link
          href={next ? `/register?next=${encodeURIComponent(next)}` : "/register"}
          className="font-medium text-brand-700 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
