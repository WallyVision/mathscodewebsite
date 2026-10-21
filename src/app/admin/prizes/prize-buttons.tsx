"use client";

import { useState, useTransition } from "react";
import { createAwards, discardAwards, setAwardStatus, type PrizeActionResult } from "./actions";

function useAction() {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const run = (fn: () => Promise<PrizeActionResult>) =>
    start(async () => {
      const result = await fn();
      setError(result.ok ? null : result.message);
    });
  return { pending, error, run };
}

const buttonClass = "rounded-md px-3 py-1.5 text-sm font-semibold disabled:opacity-50";

export function CreateAwardsButton({ period, subjectId }: { period: string; subjectId: string }) {
  const { pending, error, run } = useAction();
  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => run(() => createAwards(period, subjectId))}
        className={`${buttonClass} bg-brand-600 text-white hover:bg-brand-700`}
      >
        {pending ? "Creating…" : "Create prize awards for the top students"}
      </button>
      {error && <p className="text-sm text-red-700">{error}</p>}
    </div>
  );
}

export function DiscardAwardsButton({ period, subjectId }: { period: string; subjectId: string }) {
  const { pending, error, run } = useAction();
  return (
    <span>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (confirm("Discard these awards and recalculate from the current standings?")) {
            run(() => discardAwards(period, subjectId));
          }
        }}
        className={`${buttonClass} border border-slate-300 bg-white text-slate-700 hover:bg-slate-50`}
      >
        Discard and recalculate
      </button>
      {error && <span className="ml-2 text-sm text-red-700">{error}</span>}
    </span>
  );
}

export function AwardActions({ awardId, status }: { awardId: string; status: string }) {
  const { pending, error, run } = useAction();
  const set = (
    next: Parameters<typeof setAwardStatus>[1],
    confirmText?: string,
    askNotes = false,
  ) => {
    if (confirmText && !confirm(confirmText)) return;
    const notes = askNotes ? (prompt("Reason (kept with the award):") ?? undefined) : undefined;
    run(() => setAwardStatus(awardId, next, notes));
  };
  return (
    <div className="flex flex-wrap gap-1">
      {status === "PENDING_VERIFICATION" && (
        <button
          type="button"
          disabled={pending}
          onClick={() => set("VERIFIED", undefined, true)}
          className={`${buttonClass} bg-sky-600 text-white`}
        >
          Mark verified
        </button>
      )}
      {status === "VERIFIED" && (
        <button
          type="button"
          disabled={pending}
          onClick={() => set("PAID", "Confirm the prize has been sent by Mobile Money?", true)}
          className={`${buttonClass} bg-emerald-600 text-white`}
        >
          Mark paid
        </button>
      )}
      {(status === "PENDING_VERIFICATION" || status === "VERIFIED") && (
        <button
          type="button"
          disabled={pending}
          onClick={() => set("DISQUALIFIED", "Disqualify this winner?", true)}
          className={`${buttonClass} bg-red-50 text-red-700`}
        >
          Disqualify
        </button>
      )}
      {status === "DISQUALIFIED" && (
        <button
          type="button"
          disabled={pending}
          onClick={() => set("PENDING_VERIFICATION")}
          className={`${buttonClass} bg-slate-100 text-slate-700`}
        >
          Reinstate
        </button>
      )}
      {error && <p className="w-full text-xs text-red-700">{error}</p>}
    </div>
  );
}
