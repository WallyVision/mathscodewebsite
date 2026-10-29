"use client";

import { useActionState } from "react";
import { Field, FormMessage, Select, SubmitButton, TextArea } from "@/components/form";
import { ImageUploader } from "@/components/image-uploader";
import type { AdminFormState } from "@/lib/admin/form";
import { resultKey } from "@/lib/admin/form-key";
import { saveWrittenQuestion } from "./actions";

export function WrittenQuestionForm({
  topics,
  initial,
}: {
  /** Topics of the paper's subject. */
  topics: { id: string; name: string }[];
  initial: Record<string, string>;
}) {
  const [state, action, pending] = useActionState<AdminFormState, FormData>(
    saveWrittenQuestion,
    {},
  );
  const values = state.values ?? initial;
  const errors = state.fieldErrors ?? {};

  return (
    <>
      <ImageUploader />
      <form key={resultKey(state)} action={action} className="space-y-5" noValidate>
        {initial.id && <input type="hidden" name="id" value={initial.id} />}
        <input type="hidden" name="pastPaperId" value={initial.pastPaperId} />
        <FormMessage message={state.message} />

        <div className="grid gap-4 sm:grid-cols-3">
          <Field
            label="Label"
            name="label"
            defaultValue={values.label ?? ""}
            hint='As printed, e.g. "A1" or "B2".'
            errors={errors.label}
          />
          <Field
            label="Section (optional)"
            name="section"
            defaultValue={values.section ?? ""}
            hint="A, B..."
            errors={errors.section}
          />
          <Field
            label="Marks (optional)"
            name="marks"
            inputMode="numeric"
            defaultValue={values.marks ?? ""}
            errors={errors.marks}
          />
        </div>
        <Select
          label="Topic (optional)"
          name="topicId"
          defaultValue={values.topicId ?? ""}
          options={[
            { value: "", label: "— No topic —" },
            ...topics.map((t) => ({ value: t.id, label: t.name })),
          ]}
          errors={errors.topicId}
        />
        <p className="-mt-4 text-xs text-slate-500">
          The topic it tests. Used to plan revision notes from past questions.
        </p>
        <TextArea
          label="Question"
          name="body"
          rows={12}
          defaultValue={values.body ?? ""}
          hint="Copy it as printed, with every part: a), b)... Markdown with $maths$; tables work too."
          errors={errors.body}
        />
        <TextArea
          label="Worked solution (optional)"
          name="solution"
          rows={16}
          defaultValue={values.solution ?? ""}
          hint="Members see it; others can unlock the whole paper."
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
    </>
  );
}
