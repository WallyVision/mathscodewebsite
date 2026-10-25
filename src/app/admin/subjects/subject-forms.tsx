"use client";

import { useActionState } from "react";
import { Field, FormMessage, Select, SubmitButton } from "@/components/form";
import type { AdminFormState } from "@/lib/admin/form";
import { resultKey } from "@/lib/admin/form-key";
import { addTopic, createSubject, updateSubject, updateTopic } from "./actions";

function OpenCheckbox({ defaultChecked }: { defaultChecked: boolean }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" name="competitionOpen" defaultChecked={defaultChecked} />
      Open for competition (students can choose it and sit its tests)
    </label>
  );
}

export function NewSubjectForm() {
  const [state, action, pending] = useActionState<AdminFormState, FormData>(createSubject, {});
  const values = state.values ?? {};
  const errors = state.fieldErrors ?? {};
  return (
    <form key={resultKey(state)} action={action} className="space-y-3" noValidate>
      <FormMessage message={state.fieldErrors ? undefined : state.message} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Select
          label="Level"
          name="level"
          defaultValue={values.level ?? "O_LEVEL"}
          options={[
            { value: "O_LEVEL", label: "O Level" },
            { value: "A_LEVEL", label: "A Level" },
          ]}
        />
        <Field
          label="Subject name"
          name="name"
          placeholder="e.g. Chemistry"
          defaultValue={values.name ?? ""}
          errors={errors.name}
        />
        <Field
          label="GCE subject code (optional)"
          name="code"
          defaultValue={values.code ?? ""}
          errors={errors.code}
        />
      </div>
      <OpenCheckbox
        defaultChecked={values.competitionOpen ? values.competitionOpen === "on" : false}
      />
      <SubmitButton pending={pending}>Create subject</SubmitButton>
    </form>
  );
}

export function EditSubjectForm({
  subject,
}: {
  subject: { id: string; name: string; code: string | null; competitionOpen: boolean };
}) {
  const [state, action, pending] = useActionState<AdminFormState, FormData>(updateSubject, {});
  const errors = state.fieldErrors ?? {};
  return (
    <form key={resultKey(state)} action={action} className="space-y-3" noValidate>
      <input type="hidden" name="id" value={subject.id} />
      <FormMessage message={state.message} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field
          label="Subject name"
          name="name"
          defaultValue={state.values?.name ?? subject.name}
          errors={errors.name}
        />
        <Field
          label="GCE subject code (optional)"
          name="code"
          defaultValue={state.values?.code ?? subject.code ?? ""}
          errors={errors.code}
        />
      </div>
      <OpenCheckbox defaultChecked={subject.competitionOpen} />
      <SubmitButton pending={pending}>Save subject</SubmitButton>
    </form>
  );
}

export function AddTopicForm({ subjectId }: { subjectId: string }) {
  const [state, action, pending] = useActionState<AdminFormState, FormData>(addTopic, {});
  return (
    <form key={resultKey(state)} action={action} className="flex flex-wrap items-end gap-3">
      <input type="hidden" name="subjectId" value={subjectId} />
      <div className="min-w-56 flex-1">
        <Field
          label="New topic"
          name="name"
          placeholder="e.g. Organic Chemistry"
          errors={state.fieldErrors?.name}
          hint={state.fieldErrors ? undefined : state.message}
        />
      </div>
      <div className="w-40">
        <SubmitButton pending={pending}>Add topic</SubmitButton>
      </div>
    </form>
  );
}

export function TopicRow({ topic }: { topic: { id: string; name: string; position: number } }) {
  const [state, action, pending] = useActionState<AdminFormState, FormData>(updateTopic, {});
  return (
    <form key={resultKey(state)} action={action} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="id" value={topic.id} />
      <input
        name="position"
        type="number"
        min={0}
        aria-label="Order"
        defaultValue={state.values?.position ?? topic.position}
        className="w-16 rounded-md border border-slate-300 px-2 py-1 text-sm"
      />
      <input
        name="name"
        aria-label="Topic name"
        defaultValue={state.values?.name ?? topic.name}
        className="min-w-48 flex-1 rounded-md border border-slate-300 px-2 py-1 text-sm"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-md border border-slate-300 px-3 py-1 text-sm hover:bg-slate-50 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save"}
      </button>
      {state.message && (
        <span className={`text-xs ${state.fieldErrors ? "text-red-600" : "text-emerald-700"}`}>
          {state.fieldErrors
            ? (Object.values(state.fieldErrors).flat()[0] ?? state.message)
            : state.message}
        </span>
      )}
    </form>
  );
}
