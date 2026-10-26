"use client";

import { useActionState, useRef, useState, useTransition } from "react";
import { FormMessage, Select, TextArea } from "@/components/form";
import { resultKey } from "@/lib/admin/form-key";
import { askQuestion, type AskState } from "./actions";

const TARGET_BYTES = 280 * 1024;

/**
 * Phone photos are several megabytes; the site accepts 300 KB. Scale the photo
 * down and re-encode it as JPEG until it fits, keeping text readable.
 */
async function shrinkPhoto(file: File): Promise<Blob> {
  if (file.size <= TARGET_BYTES && /jpe?g|png|webp/i.test(file.type)) return file;
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  for (const maxSide of [1600, 1280, 1024, 800]) {
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) break;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    for (const quality of [0.8, 0.7, 0.6, 0.5]) {
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", quality),
      );
      if (blob && blob.size <= TARGET_BYTES) return blob;
    }
  }
  throw new Error("This photo is too large. Crop it to the question and try again.");
}

export function AskForm({ subjects }: { subjects: { id: string; label: string }[] }) {
  const [state, action, pending] = useActionState<AskState, FormData>(askQuestion, {});
  const [preparing, startPreparing] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const busy = pending || preparing;

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const form = event.currentTarget;
    const data = new FormData(form);
    const file = data.get("image");
    startPreparing(async () => {
      try {
        if (file instanceof File && file.size > 0) {
          data.set("image", await shrinkPhoto(file), "question.jpg");
        } else {
          data.delete("image");
        }
        action(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not read this photo.");
      }
    });
  }

  if (state.sent) {
    return (
      <div role="status" className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-900">
        <p className="font-semibold">Question sent.</p>
        <p className="mt-1">
          The subject team will reply here. You can follow it in &quot;Your questions&quot; below.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-3 rounded-md border border-emerald-600 px-3 py-1.5 font-medium text-emerald-800 hover:bg-emerald-100"
        >
          Ask another question
        </button>
      </div>
    );
  }

  return (
    <form key={resultKey(state)} ref={formRef} onSubmit={onSubmit} className="space-y-4" noValidate>
      <FormMessage message={error ?? state.message} />
      <Select
        label="Subject"
        name="subjectId"
        defaultValue={state.values?.subjectId ?? subjects[0]?.id}
        options={subjects.map((s) => ({ value: s.id, label: s.label }))}
      />
      <TextArea
        label="Your question"
        name="body"
        rows={6}
        defaultValue={state.values?.body ?? ""}
        placeholder="Type the question, and say what you tried or where you got stuck."
        hint="You can write maths between $ signs, e.g. $x^2 + 3x = 0$."
      />
      <div className="space-y-1">
        <label htmlFor="image" className="block text-sm font-medium text-slate-700">
          Photo of the question (optional)
        </label>
        <input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          className="block max-w-full text-sm"
          onChange={(e) => {
            const file = e.target.files?.[0];
            setPreview(file ? URL.createObjectURL(file) : null);
          }}
        />
        {preview && (
          // eslint-disable-next-line @next/next/no-img-element -- a local preview before upload
          <img src={preview} alt="" className="mt-2 max-h-48 rounded border border-slate-200" />
        )}
        <p className="text-xs text-slate-500">
          Take a clear, well-lit photo of just the question. It is made smaller before sending.
        </p>
      </div>
      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-md bg-brand-600 px-4 py-2.5 font-semibold text-white hover:bg-brand-700 disabled:opacity-60 sm:w-auto"
      >
        {preparing ? "Preparing photo…" : pending ? "Sending…" : "Send question"}
      </button>
    </form>
  );
}
