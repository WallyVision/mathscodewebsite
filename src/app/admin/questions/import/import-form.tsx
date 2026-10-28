"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { FormMessage, Select, TextArea } from "@/components/form";
import { resultKey } from "@/lib/admin/form-key";
import type { ContentOptions } from "@/lib/admin/options";
import { importQuestions, type ImportState } from "./actions";

const DIFFICULTY = ["", "Easy", "Medium", "Hard"];
const buttonClass =
  "rounded-md px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60";

export function ImportForm({
  subjects,
  initial,
}: {
  subjects: ContentOptions;
  /** Preselected subject and past paper, e.g. from a paper's "Import many" link. */
  initial?: { subjectId?: string; pastPaperId?: string };
}) {
  const [state, action, pending] = useActionState<ImportState, FormData>(importQuestions, {});
  const values = state.values;
  const [subjectId, setSubjectId] = useState(
    values?.subjectId ??
      (subjects.some((s) => s.id === initial?.subjectId) ? initial!.subjectId! : subjects[0]?.id) ??
      "",
  );
  const subject = subjects.find((s) => s.id === subjectId);

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
            <strong>{state.created}</strong> {state.created === 1 ? "question" : "questions"}{" "}
            created as drafts.{" "}
            <Link
              href={`/admin/questions?subject=${subjectId}&status=DRAFT`}
              className="font-medium underline"
            >
              Review and publish them
            </Link>
            .
          </p>
          {state.skipped && state.skipped.length > 0 && (
            <p className="mt-1">
              Skipped because the same question already exists: {state.skipped.join(", ")}.
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
          label="Topic (for every question in this import)"
          name="topicId"
          defaultValue={values?.topicId ?? ""}
          options={[
            { value: "", label: "— None —" },
            ...(subject?.topics ?? []).map((t) => ({ value: t.id, label: t.name })),
          ]}
        />
      </div>
      <Select
        key={`paper-${subjectId}`}
        label="Past paper (optional)"
        name="pastPaperId"
        defaultValue={values?.pastPaperId ?? initial?.pastPaperId ?? ""}
        options={[
          { value: "", label: "— Not from a past paper —" },
          ...(subject?.papers ?? []).map((p) => ({ value: p.id, label: p.name })),
        ]}
      />
      <p className="-mt-3 text-xs text-slate-500">
        Choose a paper to add these questions to it. Each question takes the number in its heading
        (&quot;## Q12&quot; becomes question 12). Create the paper first in Past papers.
      </p>

      <TextArea
        label="Questions"
        name="text"
        rows={18}
        defaultValue={values?.text ?? ""}
        placeholder={
          "## Q1\n\n**Stem**\n\n...\n\n**Options**\n\n- A. ...\n- B. ...\n- C. ...\n- D. ...\n\n**Correct:** B\n\n**Solution**\n\n..."
        }
        hint="Paste the whole set. Each question starts with a line beginning ## (see the format guide below)."
      />
      <div className="space-y-1">
        <label htmlFor="file" className="block text-sm font-medium text-slate-700">
          Or choose a file (.md or .txt)
        </label>
        <input
          id="file"
          name="file"
          type="file"
          accept=".md,.txt,text/markdown,text/plain"
          className="text-sm"
        />
      </div>

      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" name="forTests" className="mt-1" />
        <span>
          <strong>Add to the test bank</strong>: keep these questions for competitive tests (hidden
          from practice until used in a closed test).
        </span>
      </label>

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
          {pending ? "Working…" : "Import as drafts"}
        </button>
      </div>

      {state.preview && (
        <section>
          <h2 className="mb-2 font-semibold">
            {state.preview.length} {state.preview.length === 1 ? "question" : "questions"} ready.
            Nothing is saved until you press Import.
          </h2>
          <ol className="divide-y divide-slate-200 rounded-md border border-slate-200 bg-white text-sm">
            {state.preview.map((q) => (
              <li key={q.title} className="flex gap-3 px-3 py-2">
                <span className="w-28 shrink-0 font-medium">{q.title}</span>
                <span className="min-w-0 flex-1 truncate text-slate-600">{q.stem}</span>
                <span className="shrink-0">
                  {q.correct} · {DIFFICULTY[q.difficulty]}
                </span>
              </li>
            ))}
          </ol>
        </section>
      )}
    </form>
  );
}
