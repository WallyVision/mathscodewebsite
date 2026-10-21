"use client";

import { useActionState } from "react";
import { startTest } from "@/app/tests/actions";

const MESSAGES = {
  NOT_FOUND: "This test is not available.",
  NOT_OPEN: "This test has not opened yet.",
  CLOSED: "This test has closed.",
  NOT_SUBSCRIBED: "You need an active subscription to enter tests.",
  FINISHED: "You have already taken this test.",
} as const;

export function StartButton({ testId }: { testId: string }) {
  const [state, action, pending] = useActionState<{ reason?: keyof typeof MESSAGES }>(
    () => startTest(testId),
    {},
  );
  return (
    <form action={action} className="space-y-2">
      {state.reason && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {MESSAGES[state.reason]}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-brand-600 px-5 py-3 font-semibold text-white hover:bg-brand-700 disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Starting…" : "Start test"}
      </button>
    </form>
  );
}
