"use client";

import { useActionState, useMemo, useState } from "react";
import { Field, FormMessage, Select, SubmitButton } from "@/components/form";
import type { AdminFormState } from "@/lib/admin/form";
import { resultKey } from "@/lib/admin/form-key";
import type { PickableQuestion } from "@/lib/admin/tests";
import { bankAdvice } from "@/lib/domain/draw";
import { saveTest } from "./actions";

interface Props {
  subjects: { id: string; name: string }[];
  questions: PickableQuestion[];
  /** Published test-bank questions never used in a test, per subject. */
  unusedBank: Record<string, number>;
  initial: Record<string, string>;
  locked: boolean;
  /** For a drawn test that has opened: the questions it drew. */
  drawnQuestions?: string[];
}

export function TestForm({
  subjects,
  questions,
  unusedBank,
  initial,
  locked,
  drawnQuestions,
}: Props) {
  const [state, action, pending] = useActionState<AdminFormState, FormData>(saveTest, {});
  const values = state.values ?? initial;
  const errors = state.fieldErrors ?? {};
  const [subjectId, setSubjectId] = useState(values.subjectId ?? subjects[0]?.id ?? "");
  const [selected, setSelected] = useState<string[]>(
    values.questionIds ? values.questionIds.split(",").filter(Boolean) : [],
  );
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState(values.questionMode ?? "PICK");
  const [drawCount, setDrawCount] = useState(values.drawCount ?? "20");
  const unused = unusedBank[subjectId] ?? 0;
  const advice = bankAdvice(unused, Number(drawCount) || 0);

  const byId = useMemo(() => new Map(questions.map((q) => [q.id, q])), [questions]);
  const available = questions.filter(
    (q) =>
      q.subjectId === subjectId &&
      !selected.includes(q.id) &&
      (search === "" || `${q.stem} ${q.topic ?? ""}`.toLowerCase().includes(search.toLowerCase())),
  );

  function move(index: number, by: number) {
    setSelected((list) => {
      const next = [...list];
      const [item] = next.splice(index, 1);
      next.splice(index + by, 0, item!);
      return next;
    });
  }

  return (
    <form key={resultKey(state)} action={action} className="space-y-5" noValidate>
      {initial.id && <input type="hidden" name="id" value={initial.id} />}
      <FormMessage message={state.message} />

      <Field
        label="Title"
        name="title"
        defaultValue={values.title ?? ""}
        placeholder="O Level Mathematics: Weekly Test 5"
        errors={errors.title}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <Select
          label="Subject"
          name="subjectId"
          value={subjectId}
          disabled={locked}
          onChange={(e) => {
            setSubjectId(e.target.value);
            setSelected([]);
          }}
          options={subjects.map((s) => ({ value: s.id, label: s.name }))}
          errors={errors.subjectId}
        />
        {locked && <input type="hidden" name="subjectId" value={subjectId} />}
        <Select
          label="Type"
          name="kind"
          defaultValue={values.kind ?? "WEEKLY"}
          options={[
            { value: "WEEKLY", label: "Weekly" },
            { value: "MONTHLY", label: "Monthly" },
          ]}
        />
        <Field
          label="Time allowed (minutes)"
          name="durationMinutes"
          type="number"
          inputMode="numeric"
          defaultValue={values.durationMinutes ?? "45"}
          errors={errors.durationMinutes}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Opens (Cameroon time)"
          name="opensAt"
          type="datetime-local"
          defaultValue={values.opensAt ?? ""}
          errors={errors.opensAt}
        />
        <Field
          label="Closes (Cameroon time)"
          name="closesAt"
          type="datetime-local"
          defaultValue={values.closesAt ?? ""}
          errors={errors.closesAt}
        />
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-slate-700">How questions are chosen</legend>
        {(locked ? [mode] : ["DRAW", "PICK"]).map((option) => (
          <label key={option} className="flex items-start gap-2 text-sm">
            <input
              type="radio"
              name="questionMode"
              value={option}
              checked={mode === option}
              onChange={() => setMode(option)}
              className="mt-1"
            />
            <span>
              {option === "DRAW" ? (
                <>
                  <strong>Draw at random from the test bank</strong> (recommended for prize tests)
                  <span className="block text-slate-600">
                    The questions are picked when the test opens, so nobody, not even the
                    subject&apos;s authors, knows them in advance.
                  </span>
                </>
              ) : (
                <strong>Choose the questions myself</strong>
              )}
            </span>
          </label>
        ))}
      </fieldset>

      {mode === "DRAW" ? (
        <div className="space-y-2 rounded-lg border border-slate-200 bg-white p-4">
          {drawnQuestions ? (
            <>
              <p className="text-sm font-medium">
                {drawnQuestions.length} questions were drawn when the test opened:
              </p>
              <ol className="list-decimal space-y-1 pl-5 text-sm">
                {drawnQuestions.map((id) => (
                  <li key={id} className="line-clamp-1">
                    {byId.get(id)?.stem ?? "Question"}
                  </li>
                ))}
              </ol>
              <input type="hidden" name="drawCount" value={drawCount} />
            </>
          ) : (
            <>
              <div className="max-w-xs">
                <Field
                  label="Number of questions to draw"
                  name="drawCount"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={200}
                  value={drawCount}
                  onChange={(e) => setDrawCount(e.target.value)}
                  errors={errors.drawCount}
                />
              </div>
              <p className="text-sm text-slate-600">
                Test bank for this subject: <strong>{unused}</strong> published questions not yet
                used in a test. Authors add questions to it by ticking &quot;Test bank&quot;.
              </p>
              {advice && <p className="text-sm text-amber-800">{advice}</p>}
            </>
          )}
        </div>
      ) : (
        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-slate-700">
            Questions in this test ({selected.length})
          </legend>
          {selected.map((questionId) => (
            <input key={questionId} type="hidden" name="questionIds" value={questionId} />
          ))}
          {locked && (
            <p className="text-sm text-amber-800">
              Students have started this test, so its questions are locked.
            </p>
          )}
          <ol className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white text-sm">
            {selected.length === 0 && (
              <li className="p-3 text-slate-500">No questions added yet.</li>
            )}
            {selected.map((questionId, i) => {
              const q = byId.get(questionId);
              return (
                <li key={questionId} className="flex items-start gap-2 p-2">
                  <span className="w-6 shrink-0 pt-0.5 text-right font-semibold text-slate-500">
                    {i + 1}.
                  </span>
                  <span className="line-clamp-2 flex-1">
                    {q?.stem ?? "Unknown question"}
                    {q && !q.published && (
                      <span className="ml-1 text-xs text-amber-700">(draft)</span>
                    )}
                  </span>
                  {!locked && (
                    <span className="flex shrink-0 gap-1">
                      <button
                        type="button"
                        aria-label="Move up"
                        disabled={i === 0}
                        onClick={() => move(i, -1)}
                        className="rounded px-1.5 hover:bg-slate-100 disabled:opacity-30"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        aria-label="Move down"
                        disabled={i === selected.length - 1}
                        onClick={() => move(i, 1)}
                        className="rounded px-1.5 hover:bg-slate-100 disabled:opacity-30"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        aria-label="Remove"
                        onClick={() => setSelected((s) => s.filter((x) => x !== questionId))}
                        className="rounded px-1.5 text-red-600 hover:bg-red-50"
                      >
                        ✕
                      </button>
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
          {errors.questionIds && <p className="text-xs text-red-600">{errors.questionIds[0]}</p>}

          {!locked && (
            <div className="rounded-lg border border-slate-200 bg-white">
              <h3 className="px-3 py-2 text-sm font-medium text-slate-700">
                Add questions ({available.length} available)
              </h3>
              <div className="border-t border-slate-200 p-3">
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by text or topic"
                  aria-label="Search questions"
                  className="mb-2 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                />
                <ul className="max-h-80 divide-y divide-slate-100 overflow-y-auto text-sm">
                  {available.map((q) => (
                    <li key={q.id} className="flex items-start gap-2 py-2">
                      <button
                        type="button"
                        onClick={() => setSelected((s) => [...s, q.id])}
                        className="shrink-0 rounded bg-brand-600 px-2 py-0.5 text-xs font-semibold text-white hover:bg-brand-700"
                      >
                        Add
                      </button>
                      <span className="line-clamp-2 flex-1">
                        {q.stem}
                        <span className="block text-xs text-slate-500">
                          {q.topic ?? "No topic"}
                          {!q.published && " · draft"}
                        </span>
                      </span>
                    </li>
                  ))}
                  {available.length === 0 && (
                    <li className="py-2 text-slate-500">No more questions for this subject.</li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </fieldset>
      )}

      <Select
        label="Status"
        name="status"
        defaultValue={values.status ?? "DRAFT"}
        options={[
          { value: "DRAFT", label: "Draft (hidden from students)" },
          { value: "SCHEDULED", label: "Scheduled (visible to students)" },
        ]}
        errors={errors.status}
      />
      <div className="max-w-xs">
        <SubmitButton pending={pending}>Save test</SubmitButton>
      </div>
    </form>
  );
}
