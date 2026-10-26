"use client";

import { useActionState, useState, useTransition } from "react";
import { Field, FormMessage, Select, SubmitButton } from "@/components/form";
import type { AdminFormState } from "@/lib/admin/form";
import { resultKey } from "@/lib/admin/form-key";
import { deleteTool, saveTool } from "./actions";

export interface ToolValues {
  id?: string;
  title: string;
  description: string;
  url: string;
  subjectId: string;
  position: string;
  published: boolean;
}

export function ToolForm({
  initial,
  subjects,
}: {
  initial: ToolValues;
  subjects: { id: string; label: string }[];
}) {
  const [state, action, pending] = useActionState<AdminFormState, FormData>(saveTool, {});
  const [confirming, setConfirming] = useState(false);
  const [deleting, startDelete] = useTransition();
  const values = state.values;
  const errors = state.fieldErrors ?? {};
  const isNew = !initial.id;

  return (
    <form
      key={isNew ? resultKey(state) : undefined}
      action={action}
      className="space-y-3"
      noValidate
    >
      {initial.id && <input type="hidden" name="id" value={initial.id} />}
      <FormMessage message={state.fieldErrors ? undefined : state.message} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field
          label="Name"
          name="title"
          id={`title-${initial.id ?? "new"}`}
          placeholder="Descriptive statistics calculator"
          defaultValue={values?.title ?? initial.title}
          errors={errors.title}
        />
        <Field
          label="Web address"
          name="url"
          id={`url-${initial.id ?? "new"}`}
          type="url"
          placeholder="https://…"
          defaultValue={values?.url ?? initial.url}
          errors={errors.url}
        />
      </div>
      <Field
        label="What it does"
        name="description"
        id={`description-${initial.id ?? "new"}`}
        placeholder="Mean, median, mode, range, standard deviation and an ogive from your data."
        defaultValue={values?.description ?? initial.description}
        errors={errors.description}
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <Select
          label="Subject (optional)"
          name="subjectId"
          id={`subject-${initial.id ?? "new"}`}
          defaultValue={values?.subjectId ?? initial.subjectId}
          options={[
            { value: "", label: "Every subject" },
            ...subjects.map((s) => ({ value: s.id, label: s.label })),
          ]}
        />
        <Field
          label="Order"
          name="position"
          id={`position-${initial.id ?? "new"}`}
          type="number"
          min={0}
          defaultValue={values?.position ?? initial.position}
          errors={errors.position}
        />
        <label className="flex items-end gap-2 pb-2 text-sm">
          <input
            type="checkbox"
            name="published"
            defaultChecked={values ? values.published === "on" : initial.published}
          />
          Shown to students
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="w-40">
          <SubmitButton pending={pending}>{isNew ? "Add tool" : "Save"}</SubmitButton>
        </div>
        {initial.id &&
          (confirming ? (
            <span className="flex items-center gap-2 text-sm">
              Delete this tool?
              <button
                type="button"
                disabled={deleting}
                onClick={() => startDelete(() => deleteTool(initial.id!))}
                className="rounded-md bg-red-600 px-3 py-1.5 font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
              <button type="button" onClick={() => setConfirming(false)} className="underline">
                Keep
              </button>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="text-sm text-red-700 hover:underline"
            >
              Delete
            </button>
          ))}
      </div>
    </form>
  );
}
