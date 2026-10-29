import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth-shell";
import { getCurrentUser } from "@/lib/auth/session";
import { safeReturnPath } from "@/lib/domain/checkout";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = { title: "Create an account" };

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const next = safeReturnPath((await searchParams).next ?? "") ?? undefined;
  if (await getCurrentUser()) redirect(next ?? "/dashboard");
  return (
    <AuthShell
      title="Create your account"
      subtitle="Free notes and past questions. Become a member any time to compete in weekly tests and win prizes."
    >
      <RegisterForm next={next} />
      <p className="mt-6 text-center text-sm text-slate-600">
        Already registered?{" "}
        <Link
          href={next ? `/login?next=${encodeURIComponent(next)}` : "/login"}
          className="font-medium text-brand-700 hover:underline"
        >
          Log in
        </Link>
      </p>
    </AuthShell>
  );
}
