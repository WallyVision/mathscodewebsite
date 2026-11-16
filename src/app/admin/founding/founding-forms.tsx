"use client";

import { useActionState, useState } from "react";
import { Field, Select, SubmitButton } from "@/components/form";
import type { AdminFormState } from "@/lib/admin/form";
import { resultKey } from "@/lib/admin/form-key";
import { openFounding, recordFounding } from "./actions";

export function RecordFoundingForm({
  subjects,
  price,
}: {
  subjects: { id: string; label: string }[];
  price: number;
}) {
  const [state, action, pending] = useActionState<AdminFormState, FormData>(recordFounding, {});
  const errors = state.fieldErrors ?? {};
  return (
    <form key={resultKey(state)} action={action} className="space-y-3">
      {state.message && (
        <p
          role="status"
          className={`rounded-md px-3 py-2 text-sm ${state.fieldErrors ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-800"}`}
        >
          {state.message}
        </p>
      )}
      <Field
        label="Student's phone number or email"
        name="contact"
        placeholder="6XX XXX XXX"
        hint="The one they signed up with. They must have an account first."
        defaultValue={state.values?.contact ?? ""}
        errors={errors.contact}
      />
      <Select
        label="Competition subject they chose"
        name="subjectId"
        defaultValue={state.values?.subjectId ?? subjects[0]?.id ?? ""}
        options={subjects.map((s) => ({ value: s.id, label: s.label }))}
        errors={errors.subjectId}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field
          label="Amount paid (FCFA)"
          name="amount"
          type="number"
          inputMode="numeric"
          defaultValue={state.values?.amount ?? String(price)}
          errors={errors.amount}
        />
        <Field
          label="Payment reference"
          name="reference"
          placeholder="MoMo transaction ID, or 'cash'"
          defaultValue={state.values?.reference ?? ""}
          errors={errors.reference}
        />
      </div>
      <SubmitButton pending={pending}>Record founding member</SubmitButton>
    </form>
  );
}

/** Asks twice, because starting memberships cannot be undone. */
export function OpenFoundingButton({ waiting, days }: { waiting: number; days: number }) {
  const [confirming, setConfirming] = useState(false);
  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="rounded-md border border-brand-600 px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50"
      >
        Start founding memberships…
      </button>
    );
  }
  return (
    <form
      action={openFounding}
      className="space-y-3 rounded-md border border-amber-200 bg-amber-50 p-3"
    >
      <p className="text-sm text-amber-900">
        This starts the {days}-day membership of{" "}
        {waiting === 1 ? "the 1 founding member" : `all ${waiting} founding members`} today. It
        cannot be undone. Do it on launch day.
      </p>
      <div className="flex flex-wrap gap-2">
        <button className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
          Yes, start them today
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium"
        >
          Not yet
        </button>
      </div>
    </form>
  );
}
