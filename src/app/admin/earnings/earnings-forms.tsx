"use client";

import { useActionState, useState, useTransition } from "react";
import type { AdminFormState } from "@/lib/admin/form";
import { resultKey } from "@/lib/admin/form-key";
import { createPayoutsAction, markPayoutPaid } from "./actions";

export function CreatePayoutsButton({ period }: { period: string }) {
  const [message, setMessage] = useState<string | null>(null);
  const [pending, start] = useTransition();
  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => start(async () => setMessage((await createPayoutsAction(period)).message))}
        className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
      >
        {pending ? "Working…" : "Fix this month's team payouts"}
      </button>
      {message && <p className="text-sm text-slate-700">{message}</p>}
    </div>
  );
}

export function MarkPaidForm({ id }: { id: string }) {
  const [state, action, pending] = useActionState<AdminFormState, FormData>(markPayoutPaid, {});
  return (
    <form key={resultKey(state)} action={action} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="id" value={id} />
      <input
        name="reference"
        placeholder="MoMo transaction ID"
        aria-label="Payment reference"
        defaultValue={state.values?.reference ?? ""}
        className="w-44 rounded-md border border-slate-300 px-2 py-1 text-sm"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-md border border-slate-300 px-2 py-1 text-sm hover:bg-slate-50 disabled:opacity-60"
      >
        Mark paid
      </button>
      {state.fieldErrors && (
        <span className="text-xs text-red-600">{state.fieldErrors.reference?.[0]}</span>
      )}
    </form>
  );
}
