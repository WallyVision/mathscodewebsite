"use client";

import { useActionState, useState } from "react";
import { uploadImage, type UploadState } from "@/app/admin/media/actions";

/**
 * Uploads a diagram and shows the line to paste into any Markdown box
 * (question, option, solution, note or post). It is its own form, so place
 * it outside the content form.
 */
export function ImageUploader() {
  const [state, action, pending] = useActionState<UploadState, FormData>(uploadImage, {});
  const [copied, setCopied] = useState<string | null>(null);
  const markdown = state.image?.markdown;

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
    } catch {
      setCopied(null);
    }
  }

  return (
    <details className="mb-6 rounded-lg border border-slate-200 bg-white p-4 text-sm">
      <summary className="cursor-pointer font-medium">Add a diagram or picture</summary>
      <form action={action} className="mt-3 flex flex-wrap items-center gap-3">
        <input
          name="image"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml,.svg"
          aria-label="Image file"
          className="max-w-full text-sm"
          required
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-brand-600 px-3 py-1.5 font-medium text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {pending ? "Uploading…" : "Upload"}
        </button>
      </form>
      <p className="mt-2 text-xs text-slate-500">
        PNG, JPG, WebP or SVG, up to 300 KB. Then paste the line below where the picture should
        appear: in the question, an option, the solution or a note.
      </p>
      {state.message && (
        <p role="alert" className="mt-3 rounded-md bg-red-50 px-3 py-2 text-red-800">
          {state.message}
        </p>
      )}
      {markdown && state.image && (
        <div role="status" className="mt-3 flex flex-wrap items-start gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element -- served from our own /media route */}
          <img
            src={`/media/${state.image.id}`}
            alt=""
            className="max-h-32 rounded border border-slate-200 bg-white"
          />
          <div className="min-w-0 flex-1 space-y-2">
            <p className="text-emerald-800">
              {state.image.reused ? "This image was already uploaded." : "Uploaded."} Paste this
              line:
            </p>
            <code className="block overflow-x-auto rounded bg-slate-50 px-2 py-1.5">
              {markdown}
            </code>
            <button
              type="button"
              onClick={() => copy(markdown)}
              className="rounded-md border border-slate-300 px-3 py-1 hover:bg-slate-50"
            >
              {copied === markdown ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      )}
    </details>
  );
}
