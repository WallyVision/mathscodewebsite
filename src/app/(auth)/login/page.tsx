import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Log in" };

export default async function LoginPage() {
  if (await getCurrentUser()) redirect("/dashboard");
  return (
    <div className="mx-auto max-w-sm px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">Log in</h1>
      <LoginForm />
      <p className="mt-6 text-center text-sm text-slate-600">
        New here?{" "}
        <Link href="/register" className="font-medium text-brand-700 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
