"use client";

import { useActionState } from "react";
import { Field, FormMessage, SubmitButton } from "@/components/form";
import { startCheckoutAction, type CheckoutFormState } from "./actions";

export function CheckoutForm({
  hidden,
  defaultPhone,
  amountLabel,
  subjectChoices,
}: {
  hidden: Record<string, string>;
  defaultPhone: string;
  amountLabel: string;
  /** For a membership: the competition subject included in it. */
  subjectChoices?: { options: { id: string; name: string }[]; selected: string };
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
      {subjectChoices && (
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-slate-700">
            Your competition subject (included)
          </legend>
          {subjectChoices.options.map((subject) => (
            <label
              key={subject.id}
              className="flex cursor-pointer items-center gap-3 rounded-md border border-slate-300 px-3 py-2 text-sm has-[:checked]:border-brand-600 has-[:checked]:bg-brand-50"
            >
              <input
                type="radio"
                name="subjectId"
                value={subject.id}
                defaultChecked={subject.id === (state.subjectId ?? subjectChoices.selected)}
              />
              {subject.name}
            </label>
          ))}
          <p className="text-xs text-slate-500">
            You sit this subject&apos;s competitive tests and compete for its prizes. You can add
            more subjects later.
          </p>
        </fieldset>
      )}
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
