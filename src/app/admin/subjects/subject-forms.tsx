"use client";

import { useActionState, useTransition } from "react";
import { Field, FormMessage, Select, SubmitButton } from "@/components/form";
import type { AdminFormState } from "@/lib/admin/form";
import { resultKey } from "@/lib/admin/form-key";
import {
  addTeamMember,
  addTopic,
  createSubject,
  removeTeamMember,
  updateSubject,
  updateTeamWeight,
  updateTopic,
} from "./actions";

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

export function AddTeamMemberForm({ subjectId }: { subjectId: string }) {
  const [state, action, pending] = useActionState<AdminFormState, FormData>(addTeamMember, {});
  return (
    <form key={resultKey(state)} action={action} className="space-y-3" noValidate>
      <input type="hidden" name="subjectId" value={subjectId} />
      {state.message && !state.fieldErrors && (
        <p role="status" className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {state.message}
        </p>
      )}
      <div className="grid gap-3 sm:grid-cols-[1fr_8rem]">
        <Field
          label="Phone number or email"
          name="identifier"
          placeholder="e.g. 677 12 34 56"
          defaultValue={state.values?.identifier ?? ""}
          errors={state.fieldErrors?.identifier}
          hint="They must have registered on the site. Students become authors."
        />
        <Field
          label="Share weight"
          name="weight"
          type="number"
          min={1}
          max={10}
          defaultValue={state.values?.weight ?? "1"}
          errors={state.fieldErrors?.weight}
        />
      </div>
      <SubmitButton pending={pending}>Add to team</SubmitButton>
    </form>
  );
}

export function TeamMemberRow({
  member,
  percent,
}: {
  member: { id: string; name: string; phone: string | null; weight: number };
  percent: number;
}) {
  const [state, action, pending] = useActionState<AdminFormState, FormData>(updateTeamWeight, {});
  const [removing, startRemove] = useTransition();
  return (
    <div className="flex flex-wrap items-center gap-3 py-2 text-sm">
      <span className="min-w-40 flex-1">
        <span className="block font-medium">{member.name}</span>
        <span className="text-xs text-slate-500">{member.phone ?? "no phone"}</span>
      </span>
      <form key={resultKey(state)} action={action} className="flex items-center gap-2">
        <input type="hidden" name="id" value={member.id} />
        <label className="text-xs text-slate-600" htmlFor={`weight-${member.id}`}>
          Weight
        </label>
        <input
          id={`weight-${member.id}`}
          name="weight"
          type="number"
          min={1}
          max={10}
          defaultValue={state.values?.weight ?? member.weight}
          className="w-16 rounded-md border border-slate-300 px-2 py-1"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-md border border-slate-300 px-2 py-1 hover:bg-slate-50 disabled:opacity-60"
        >
          Save
        </button>
      </form>
      <span className="w-24 text-right text-slate-600">{percent}% of team share</span>
      <button
        type="button"
        disabled={removing}
        onClick={() => {
          if (confirm(`Remove ${member.name} from this team?`)) {
            startRemove(() => removeTeamMember(member.id));
          }
        }}
        className="rounded-md px-2 py-1 text-red-700 hover:bg-red-50 disabled:opacity-60"
      >
        Remove
      </button>
    </div>
  );
}
