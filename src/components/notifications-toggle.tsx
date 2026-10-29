"use client";

import { useEffect, useState } from "react";
import { removePushSubscription, savePushSubscription } from "@/app/account/push-actions";

type State = "loading" | "unsupported" | "ios-install" | "blocked" | "off" | "on" | "working";

function keyBytes(base64: string): Uint8Array<ArrayBuffer> {
  const padded = (base64 + "=".repeat((4 - (base64.length % 4)) % 4))
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const raw = atob(padded);
  const bytes = new Uint8Array(new ArrayBuffer(raw.length));
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return bytes;
}

async function registration() {
  await navigator.serviceWorker.register("/sw.js");
  return navigator.serviceWorker.ready;
}

/**
 * Turns push notifications on or off for this device. The "banner" variant
 * invites students who have not turned them on, and hides once they have.
 */
export function NotificationsToggle({
  publicKey,
  variant,
}: {
  publicKey: string;
  variant: "banner" | "settings";
}) {
  const [state, setState] = useState<State>("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const supported =
        "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
      if (!supported) {
        const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
        setState(ios ? "ios-install" : "unsupported");
        return;
      }
      if (Notification.permission === "denied") return setState("blocked");
      const existing = await (await registration()).pushManager.getSubscription();
      if (existing && Notification.permission === "granted") {
        // Keep the device linked to whoever is signed in now.
        await savePushSubscription(existing.toJSON(), navigator.userAgent);
        setState("on");
      } else {
        setState("off");
      }
    })().catch(() => setState("unsupported"));
  }, []);

  async function turnOn() {
    setError("");
    setState("working");
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setState(permission === "denied" ? "blocked" : "off");
        return;
      }
      const reg = await registration();
      const subscription =
        (await reg.pushManager.getSubscription()) ??
        (await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: keyBytes(publicKey),
        }));
      const saved = await savePushSubscription(subscription.toJSON(), navigator.userAgent);
      setState(saved ? "on" : "off");
      if (!saved) setError("Could not turn notifications on. Please try again.");
    } catch {
      setState("off");
      setError("Could not turn notifications on. Please try again.");
    }
  }

  async function turnOff() {
    setState("working");
    const subscription = await (await registration()).pushManager.getSubscription();
    if (subscription) {
      await removePushSubscription(subscription.endpoint);
      await subscription.unsubscribe();
    }
    setState("off");
  }

  if (variant === "banner") {
    if (state !== "off" && state !== "working" && state !== "ios-install") return null;
    return (
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-brand-100 bg-gradient-to-r from-brand-50 to-white p-4">
        <span className="text-2xl" aria-hidden>
          🔔
        </span>
        <p className="min-w-0 flex-1 text-sm text-slate-700">
          <strong className="block text-slate-900">Never miss a test or a scholarship</strong>
          {state === "ios-install"
            ? "On iPhone: tap Share, then Add to Home Screen. Open StudentLife237 from your Home Screen and turn notifications on there."
            : "Get a notification when a test opens, results are out or a new opportunity is posted."}
        </p>
        {state !== "ios-install" && (
          <button
            type="button"
            onClick={turnOn}
            disabled={state === "working"}
            className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 disabled:opacity-60"
          >
            {state === "working" ? "Turning on…" : "Turn on notifications"}
          </button>
        )}
        {error && <p className="w-full text-sm text-red-700">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-2 text-sm">
      {state === "loading" && <p className="text-slate-500">Checking…</p>}
      {state === "unsupported" && (
        <p className="text-slate-600">
          This browser cannot show notifications. Try Chrome on Android, or install the app.
        </p>
      )}
      {state === "ios-install" && (
        <p className="text-slate-600">
          On iPhone, tap Share, then Add to Home Screen. Open StudentLife237 from your Home Screen
          and turn notifications on there.
        </p>
      )}
      {state === "blocked" && (
        <p className="text-slate-600">
          Notifications are blocked for this site. Allow them in your browser&apos;s site settings
          (the lock icon beside the address), then reload this page.
        </p>
      )}
      {(state === "off" || state === "working") && (
        <button
          type="button"
          onClick={turnOn}
          disabled={state === "working"}
          className="rounded-full bg-brand-600 px-4 py-2 font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {state === "working" ? "Please wait…" : "🔔 Turn on notifications"}
        </button>
      )}
      {state === "on" && (
        <p className="flex flex-wrap items-center gap-3">
          <span className="font-medium text-emerald-700">
            ✓ Notifications are on for this device
          </span>
          <button
            type="button"
            onClick={turnOff}
            className="text-slate-600 underline hover:text-red-700"
          >
            Turn off
          </button>
        </p>
      )}
      {error && <p className="text-red-700">{error}</p>}
    </div>
  );
}
