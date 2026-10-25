"use client";

import Link from "next/link";
import { useActionState } from "react";
import { register, type FormState } from "@/app/(auth)/actions";
import { Field, FormMessage, SubmitButton } from "@/components/form";
import { formatXaf, SUBSCRIPTION_PRICE } from "@/lib/domain/pricing";

export function RegisterForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(register, {});
  const errors = state.fieldErrors ?? {};
  const values = state.values ?? {};

  return (
    <form action={action} className="space-y-4" noValidate>
      {next && <input type="hidden" name="next" value={next} />}
      <FormMessage message={state.message} />
      <Field
        label="Full name"
        name="name"
        autoComplete="name"
        defaultValue={values.name}
        errors={errors.name}
        required
      />
      <Field
        label="Phone number"
        name="phone"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="677 12 34 56"
        hint="Use your MTN or Orange number. You will pay and log in with it."
        defaultValue={values.phone}
        errors={errors.phone}
        required
      />
      <Field
        label="Email (optional)"
        name="email"
        type="email"
        autoComplete="email"
        defaultValue={values.email}
        errors={errors.email}
      />
      <fieldset className="space-y-1">
        <legend className="text-sm font-medium text-slate-700">Level</legend>
        <div className="grid grid-cols-2 gap-2">
          {(["O_LEVEL", "A_LEVEL"] as const).map((level) => (
            <label
              key={level}
              className="flex cursor-pointer items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 has-checked:border-brand-600 has-checked:bg-brand-50"
            >
              <input
                type="radio"
                name="level"
                value={level}
                defaultChecked={values.level === level}
                className="accent-brand-600"
              />
              <span className="text-sm">
                {level === "O_LEVEL" ? "O Level" : "A Level"}
                <span className="block text-xs text-slate-500">
                  {formatXaf(SUBSCRIPTION_PRICE[level])}/month
                </span>
              </span>
            </label>
          ))}
        </div>
        {errors.level && <p className="text-xs text-red-600">{errors.level[0]}</p>}
      </fieldset>
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        hint="At least 8 characters."
        errors={errors.password}
        required
      />
      <p className="text-xs text-slate-600">
        By creating an account you agree to the{" "}
        <Link href="/terms" className="text-brand-700 underline">
          Terms and Conditions
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-brand-700 underline">
          Privacy Policy
        </Link>
        . If you are under 18, a parent or guardian must agree too.
      </p>
      <SubmitButton pending={pending}>Create account</SubmitButton>
    </form>
  );
}
