import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = { title: "Create an account" };

export default async function RegisterPage() {
  if (await getCurrentUser()) redirect("/dashboard");
  return (
    <div className="mx-auto max-w-sm px-4 py-10">
      <h1 className="mb-1 text-2xl font-bold">Create your account</h1>
      <p className="mb-6 text-sm text-slate-600">
        Free notes and past questions. Subscribe any time to enter tests and win prizes.
      </p>
      <RegisterForm />
      <p className="mt-6 text-center text-sm text-slate-600">
        Already registered?{" "}
        <Link href="/login" className="font-medium text-brand-700 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
