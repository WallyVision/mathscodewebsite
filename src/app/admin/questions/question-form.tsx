"use client";

import { useActionState, useState } from "react";
import { FormMessage, Select, SubmitButton, TextArea, Field } from "@/components/form";
import type { AdminFormState } from "@/lib/admin/form";
import { resultKey } from "@/lib/admin/form-key";
import type { ContentOptions } from "@/lib/admin/options";
import { saveQuestion } from "./actions";

const LABELS = ["A", "B", "C", "D"] as const;
const MATHS_HINT = "Markdown with $inline$ maths. Put $$ on their own lines for display maths.";

export function QuestionForm({
  subjects,
  initial,
}: {
  subjects: ContentOptions;
  initial: Record<string, string>;
}) {
  const [state, action, pending] = useActionState<AdminFormState, FormData>(saveQuestion, {});
  const values = state.values ?? initial;
  const errors = state.fieldErrors ?? {};
  const [subjectId, setSubjectId] = useState(values.subjectId ?? subjects[0]?.id ?? "");
  const subject = subjects.find((s) => s.id === subjectId);

  return (
    <form key={resultKey(state)} action={action} className="space-y-5" noValidate>
      {initial.id && <input type="hidden" name="id" value={initial.id} />}
      <FormMessage message={state.message} />

      <div className="grid gap-4 sm:grid-cols-3">
        <Select
          label="Subject"
          name="subjectId"
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
          options={subjects.map((s) => ({ value: s.id, label: s.name }))}
          errors={errors.subjectId}
        />
        <Select
          key={`topic-${subjectId}`}
          label="Topic"
          name="topicId"
          defaultValue={values.topicId ?? ""}
          options={[
            { value: "", label: "— None —" },
            ...(subject?.topics ?? []).map((t) => ({ value: t.id, label: t.name })),
          ]}
        />
        <Select
          label="Difficulty"
          name="difficulty"
          defaultValue={values.difficulty ?? "2"}
          options={[
            { value: "1", label: "Easy" },
            { value: "2", label: "Medium" },
            { value: "3", label: "Hard" },
          ]}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <Select
            key={`paper-${subjectId}`}
            label="Past paper (optional)"
            name="pastPaperId"
            defaultValue={values.pastPaperId ?? ""}
            options={[
              { value: "", label: "— Original question —" },
              ...(subject?.papers ?? []).map((p) => ({ value: p.id, label: p.name })),
            ]}
          />
        </div>
        <Field
          label="Question number in paper"
          name="number"
          type="number"
          inputMode="numeric"
          defaultValue={values.number ?? ""}
          errors={errors.number}
        />
      </div>

      <TextArea
        label="Question"
        name="stem"
        rows={4}
        defaultValue={values.stem ?? ""}
        hint={MATHS_HINT}
        errors={errors.stem}
      />

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-slate-700">
          Options (select the correct one)
        </legend>
        {LABELS.map((label) => (
          <div key={label} className="flex items-start gap-3">
            <label className="mt-2 flex items-center gap-1 text-sm font-semibold">
              <input
                type="radio"
                name="correct"
                value={label}
                defaultChecked={values.correct === label}
                className="accent-emerald-600"
              />
              {label}
            </label>
            <div className="flex-1">
              <TextArea
                label={`Option ${label}`}
                name={`option${label}`}
                rows={1}
                defaultValue={values[`option${label}`] ?? ""}
                errors={errors[`option${label}`]}
              />
            </div>
          </div>
        ))}
        {errors.correct && <p className="text-xs text-red-600">{errors.correct[0]}</p>}
      </fieldset>

      <TextArea
        label="Worked solution (paid content)"
        name="solution"
        rows={8}
        defaultValue={values.solution ?? ""}
        hint="Show every step. See docs/CONTENT_GUIDE.md."
        errors={errors.solution}
      />

      <Select
        label="Status"
        name="status"
        defaultValue={values.status ?? "DRAFT"}
        options={[
          { value: "DRAFT", label: "Draft (hidden from students)" },
          { value: "PUBLISHED", label: "Published" },
        ]}
      />

      <div className="max-w-xs">
        <SubmitButton pending={pending}>Save question</SubmitButton>
      </div>
    </form>
  );
}
