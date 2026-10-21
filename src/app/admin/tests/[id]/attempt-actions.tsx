"use client";

import { useTransition } from "react";
import { setAttemptDisqualified } from "../actions";

export function DisqualifyButton({
  attemptId,
  disqualified,
}: {
  attemptId: string;
  disqualified: boolean;
}) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        const message = disqualified
          ? "Restore this attempt to the leaderboard?"
          : "Disqualify this attempt? It will be removed from the leaderboard and prizes.";
        if (confirm(message)) start(() => setAttemptDisqualified(attemptId, !disqualified));
      }}
      className={`rounded px-2 py-1 text-xs font-medium disabled:opacity-50 ${disqualified ? "bg-slate-100 text-slate-700 hover:bg-slate-200" : "bg-red-50 text-red-700 hover:bg-red-100"}`}
    >
      {disqualified ? "Restore" : "Disqualify"}
    </button>
  );
}
