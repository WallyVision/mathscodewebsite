"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { checkPaymentAction } from "@/app/checkout/actions";

const POLL_MS = 4000;
// Stop checking automatically after this long; the student can still refresh.
const MAX_POLL_MS = 10 * 60 * 1000;

export function PaymentPoller({ paymentId }: { paymentId: string }) {
  const router = useRouter();
  const [gaveUp, setGaveUp] = useState(false);

  useEffect(() => {
    const started = Date.now();
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    const poll = async () => {
      const { status } = await checkPaymentAction(paymentId).catch(() => ({
        status: "PENDING" as const,
      }));
      if (cancelled) return;
      if (status !== "PENDING") {
        router.refresh();
      } else if (Date.now() - started > MAX_POLL_MS) {
        setGaveUp(true);
      } else {
        timer = setTimeout(poll, POLL_MS);
      }
    };
    timer = setTimeout(poll, POLL_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [paymentId, router]);

  return gaveUp ? (
    <button
      type="button"
      onClick={() => router.refresh()}
      className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium"
    >
      Check again
    </button>
  ) : (
    <p className="flex items-center gap-2 text-sm text-slate-600" role="status">
      <span className="inline-block h-3 w-3 animate-pulse rounded-full bg-amber-500" aria-hidden />
      Waiting for your confirmation…
    </p>
  );
}
