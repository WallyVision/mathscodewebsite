"use client";

import { useActionState } from "react";
import { login, type FormState } from "@/app/(auth)/actions";
import { Field, FormMessage, SubmitButton } from "@/components/form";

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(login, {});
  const errors = state.fieldErrors ?? {};

  return (
    <form action={action} className="space-y-4" noValidate>
      {next && <input type="hidden" name="next" value={next} />}
      <FormMessage message={state.message} />
      <Field
        label="Phone number or email"
        name="identifier"
        autoComplete="username"
        defaultValue={state.values?.identifier}
        errors={errors.identifier}
        required
      />
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        errors={errors.password}
        required
      />
      <SubmitButton pending={pending}>Log in</SubmitButton>
    </form>
  );
}
