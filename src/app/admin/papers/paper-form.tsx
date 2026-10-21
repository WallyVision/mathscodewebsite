"use client";

import { useActionState } from "react";
import { Field, FormMessage, Select, SubmitButton } from "@/components/form";
import type { AdminFormState } from "@/lib/admin/form";
import { resultKey } from "@/lib/admin/form-key";
import { savePaper } from "./actions";

export function PaperForm({
  subjects,
  initial,
}: {
  subjects: { id: string; name: string }[];
  initial: Record<string, string>;
}) {
  const [state, action, pending] = useActionState<AdminFormState, FormData>(savePaper, {});
  const values = state.values ?? initial;
  const errors = state.fieldErrors ?? {};

  return (
    <form key={resultKey(state)} action={action} className="space-y-5" noValidate>
      {initial.id && <input type="hidden" name="id" value={initial.id} />}
      <FormMessage message={state.message} />
      <Select
        label="Subject"
        name="subjectId"
        defaultValue={values.subjectId}
        options={subjects.map((s) => ({ value: s.id, label: s.name }))}
        errors={errors.subjectId}
      />
      <div className="grid grid-cols-2 gap-4">
        <Field
          label="Year"
          name="year"
          type="number"
          inputMode="numeric"
          defaultValue={values.year ?? ""}
          errors={errors.year}
        />
        <Field
          label="Paper number"
          name="paperNumber"
          type="number"
          inputMode="numeric"
          defaultValue={values.paperNumber ?? "1"}
          hint="Paper 1 is the MCQ paper for most subjects."
          errors={errors.paperNumber}
        />
      </div>
      <Field
        label="Title"
        name="title"
        defaultValue={values.title ?? ""}
        placeholder="June 2024 Paper 1"
        errors={errors.title}
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
        <SubmitButton pending={pending}>Save paper</SubmitButton>
      </div>
    </form>
  );
}
