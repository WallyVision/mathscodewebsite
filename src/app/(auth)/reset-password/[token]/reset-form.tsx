"use client";

import { useActionState } from "react";
import { Field, FormMessage, SubmitButton } from "@/components/form";
import { resetPassword, type ResetFormState } from "../actions";

export function ResetForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState<ResetFormState, FormData>(resetPassword, {});
  return (
    <form action={action} className="space-y-4" noValidate>
      <input type="hidden" name="token" value={token} />
      <FormMessage message={state.message} />
      <Field
        label="New password"
        name="password"
        type="password"
        autoComplete="new-password"
        hint="At least 8 characters."
        errors={state.passwordError ? [state.passwordError] : undefined}
      />
      <Field
        label="Repeat new password"
        name="confirm"
        type="password"
        autoComplete="new-password"
      />
      <SubmitButton pending={pending}>Set new password</SubmitButton>
    </form>
  );
}
