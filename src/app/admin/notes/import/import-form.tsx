"use client";

import Link from "next/link";
import { useActionState, useRef, useState } from "react";
import { FormMessage, Select, TextArea } from "@/components/form";
import { resultKey } from "@/lib/admin/form-key";
import type { ContentOptions } from "@/lib/admin/options";
import { importNotes, type NoteImportState } from "./actions";

// Stays under the 1 MB request limit for server actions.
const MAX_FILE_BYTES = 500_000;
const buttonClass =
  "rounded-md px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60";

export function NoteImportForm({
  subjects,
  initial,
}: {
  subjects: ContentOptions;
  /** Preselected topic, e.g. from a topic page's link. */
  initial?: { subjectId?: string; topicId?: string };
}) {
  const [state, action, pending] = useActionState<NoteImportState, FormData>(importNotes, {});
  const values = state.values;
  const [subjectId, setSubjectId] = useState(
    values?.subjectId ??
      (subjects.some((s) => s.id === initial?.subjectId) ? initial!.subjectId! : subjects[0]?.id) ??
      "",
  );
  const subject = subjects.find((s) => s.id === subjectId);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const [fileNote, setFileNote] = useState<{ ok: boolean; text: string } | null>(null);

  // A chosen file is read here and put in the box, so the author sees exactly what will be imported.
  async function loadFile(input: HTMLInputElement) {
    const file = input.files?.[0];
    input.value = "";
    if (!file || !textRef.current) return;
    if (file.size > MAX_FILE_BYTES) {
      setFileNote({ ok: false, text: "That file is too large (500 KB at most)." });
      return;
    }
    const text = await file.text();
    if (!text.trim()) {
      setFileNote({ ok: false, text: `${file.name} is empty. Download it again and choose it.` });
      return;
    }
    textRef.current.value = text;
    setFileNote({ ok: true, text: `Loaded ${file.name} into the box above. Press Check.` });
  }

  return (
    <form key={resultKey(state)} action={action} className="space-y-5" noValidate>
      <FormMessage message={state.message} />
      {state.errors && state.errors.length > 0 && (
        <ul className="list-disc space-y-1 rounded-md bg-red-50 py-3 pr-3 pl-8 text-sm text-red-800">
          {state.errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}
      {state.created !== undefined && (
        <div role="status" className="rounded-md bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          <p>
            <strong>{state.created}</strong> {state.created === 1 ? "note" : "notes"} created
            {values?.status === "PUBLISHED" ? " and published" : " as drafts"}.{" "}
            <Link href="/admin/notes" className="font-medium underline">
              See all notes
            </Link>
            .
          </p>
          {state.skipped && state.skipped.length > 0 && (
            <p className="mt-1">
              Skipped because the topic already has a note with the same URL name:{" "}
              {state.skipped.join(", ")}.
            </p>
          )}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Subject"
          name="subjectId"
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
          options={subjects.map((s) => ({ value: s.id, label: s.name }))}
        />
        <Select
          key={`topic-${subjectId}`}
          label="Topic (for every note in this import)"
          name="topicId"
          defaultValue={values?.topicId ?? initial?.topicId ?? ""}
          options={[
            { value: "", label: "— Choose a topic —" },
            ...(subject?.topics ?? []).map((t) => ({ value: t.id, label: t.name })),
          ]}
        />
      </div>

      <TextArea
        label="Notes"
        name="text"
        ref={textRef}
        rows={18}
        defaultValue={values?.text ?? ""}
        placeholder={
          "# Note 1\n\n**Title:** Like terms\n\n**URL name:** like-terms\n\n**Body**\n\n## Like terms\n\n..."
        }
        hint="Paste the whole file. Each note starts with a line beginning # Note (see the format guide below)."
      />
      <div className="space-y-1">
        <label htmlFor="file" className="block text-sm font-medium text-slate-700">
          Or choose a file (.md or .txt)
        </label>
        <input
          id="file"
          type="file"
          accept=".md,.txt,text/markdown,text/plain"
          className="text-sm"
          onChange={(e) => void loadFile(e.currentTarget)}
        />
        {fileNote && (
          <p
            role="status"
            className={`text-sm ${fileNote.ok ? "text-emerald-700" : "text-red-700"}`}
          >
            {fileNote.text}
          </p>
        )}
      </div>

      <Select
        label="Save as"
        name="status"
        defaultValue={values?.status ?? "DRAFT"}
        options={[
          { value: "DRAFT", label: "Draft (students cannot see them yet)" },
          { value: "PUBLISHED", label: "Published (students see them at once)" },
        ]}
      />

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          name="intent"
          value="check"
          disabled={pending}
          className={`${buttonClass} border border-slate-300 bg-white text-slate-800 hover:bg-slate-50`}
        >
          {pending ? "Working…" : "Check"}
        </button>
        <button
          type="submit"
          name="intent"
          value="import"
          disabled={pending}
          className={`${buttonClass} bg-brand-600 text-white hover:bg-brand-700`}
        >
          {pending ? "Working…" : "Import notes"}
        </button>
      </div>

      {state.preview && (
        <section>
          <h2 className="mb-2 font-semibold">
            {state.preview.length} {state.preview.length === 1 ? "note" : "notes"} ready. Nothing is
            saved until you press Import.
          </h2>
          <ol className="divide-y divide-slate-200 rounded-md border border-slate-200 bg-white text-sm">
            {state.preview.map((n) => (
              <li key={n.slug} className="flex gap-3 px-3 py-2">
                <span className="w-20 shrink-0 font-medium">{n.heading}</span>
                <span className="min-w-0 flex-1 truncate">{n.title}</span>
                <span className="shrink-0 text-slate-500">
                  {n.slug} · {n.length.toLocaleString("en")} characters
                </span>
              </li>
            ))}
          </ol>
        </section>
      )}
    </form>
  );
}
