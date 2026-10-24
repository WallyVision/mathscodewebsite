import type { Metadata } from "next";
import { findValidResetToken } from "@/lib/auth/password-reset";
import { ResetForm } from "./reset-form";

export const metadata: Metadata = { title: "Reset password", robots: { index: false } };

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const record = await findValidResetToken(token);

  return (
    <div className="mx-auto max-w-sm px-4 py-10">
      <h1 className="mb-2 text-2xl font-bold">Choose a new password</h1>
      {record ? (
        <>
          <p className="mb-6 text-sm text-slate-600">
            For {record.user.name}. You will be signed out of other devices.
          </p>
          <ResetForm token={token} />
        </>
      ) : (
        <p className="text-slate-700">
          This reset link has expired or was already used. Ask for a new one.
        </p>
      )}
    </div>
  );
}
