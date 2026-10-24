"use client";

import { useActionState } from "react";
import { Field, SubmitButton } from "@/components/form";
import { resultKey } from "@/lib/admin/form-key";
import { changePassword, type PasswordFormState } from "./actions";

export function PasswordForm() {
  const [state, action, pending] = useActionState<PasswordFormState, FormData>(changePassword, {});
  return (
    <form key={resultKey(state)} action={action} className="space-y-4" noValidate>
      {state.message && (
        <p
          role={state.ok ? "status" : "alert"}
          className={`rounded-md px-3 py-2 text-sm ${state.ok ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}
        >
          {state.message}
        </p>
      )}
      <Field
        label="Current password"
        name="current"
        type="password"
        autoComplete="current-password"
        errors={state.errors?.current ? [state.errors.current] : undefined}
      />
      <Field
        label="New password"
        name="password"
        type="password"
        autoComplete="new-password"
        hint="At least 8 characters."
        errors={state.errors?.password ? [state.errors.password] : undefined}
      />
      <Field
        label="Repeat new password"
        name="confirm"
        type="password"
        autoComplete="new-password"
      />
      <SubmitButton pending={pending}>Change password</SubmitButton>
    </form>
  );
}
