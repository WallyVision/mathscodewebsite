"use client";

import { useActionState } from "react";
import { Field, FormMessage, SubmitButton } from "@/components/form";
import { startCheckoutAction, type CheckoutFormState } from "./actions";

export function CheckoutForm({
  hidden,
  defaultPhone,
  amountLabel,
}: {
  hidden: Record<string, string>;
  defaultPhone: string;
  amountLabel: string;
}) {
  const [state, action, pending] = useActionState<CheckoutFormState, FormData>(
    startCheckoutAction,
    {},
  );
  return (
    <form action={action} className="space-y-4" noValidate>
      {Object.entries(hidden).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <FormMessage message={state.message} />
      <Field
        label="MTN or Orange Mobile Money number"
        name="phone"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        defaultValue={state.phone ?? defaultPhone}
        hint="You will get a prompt on this phone to confirm with your Mobile Money PIN."
        errors={state.phoneError ? [state.phoneError] : undefined}
      />
      <SubmitButton pending={pending}>Pay {amountLabel}</SubmitButton>
    </form>
  );
}
