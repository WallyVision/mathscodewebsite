"use client";

import { useActionState } from "react";
import { Field, Select, SubmitButton } from "@/components/form";
import type { AdminFormState } from "@/lib/admin/form";
import { resultKey } from "@/lib/admin/form-key";
import { changeRole, grantSubscription } from "../actions";

function Notice({ state }: { state: AdminFormState }) {
  if (!state.message) return null;
  const isError = Boolean(state.fieldErrors);
  return (
    <p
      role="status"
      className={`rounded-md px-3 py-2 text-sm ${isError ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-800"}`}
    >
      {state.message}
    </p>
  );
}

export function GrantForm({
  userId,
  level,
  prices,
}: {
  userId: string;
  level: string;
  prices: Record<string, number>;
}) {
  const [state, action, pending] = useActionState<AdminFormState, FormData>(grantSubscription, {});
  const errors = state.fieldErrors ?? {};
  return (
    <form key={resultKey(state)} action={action} className="space-y-3">
      <input type="hidden" name="userId" value={userId} />
      <Notice state={state} />
      <div className="grid grid-cols-2 gap-3">
        <Select
          label="Level"
          name="level"
          defaultValue={state.values?.level ?? level}
          options={[
            { value: "O_LEVEL", label: "O Level" },
            { value: "A_LEVEL", label: "A Level" },
          ]}
        />
        <Field
          label="Amount paid (FCFA)"
          name="amount"
          type="number"
          inputMode="numeric"
          defaultValue={state.values?.amount ?? String(prices[level] ?? "")}
          errors={errors.amount}
        />
      </div>
      <Field
        label="Payment reference"
        name="reference"
        placeholder="MoMo transaction ID, or 'cash'"
        defaultValue={state.values?.reference ?? ""}
        errors={errors.reference}
      />
      <SubmitButton pending={pending}>Record payment and add 30 days</SubmitButton>
    </form>
  );
}

export function RoleForm({ userId, role }: { userId: string; role: string }) {
  const [state, action, pending] = useActionState<AdminFormState, FormData>(changeRole, {});
  return (
    <form key={resultKey(state)} action={action} className="space-y-3">
      <input type="hidden" name="userId" value={userId} />
      <Notice state={state} />
      <Select
        label="Role"
        name="role"
        defaultValue={role}
        options={[
          { value: "STUDENT", label: "Student" },
          { value: "AUTHOR", label: "Author (writes notes and questions)" },
          { value: "ADMIN", label: "Admin (full access)" },
        ]}
      />
      <SubmitButton pending={pending}>Change role</SubmitButton>
    </form>
  );
}
