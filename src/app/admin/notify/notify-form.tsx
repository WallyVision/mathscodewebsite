"use client";

import { useActionState } from "react";
import { Field, FormMessage, Select, SubmitButton, TextArea } from "@/components/form";
import type { AdminFormState } from "@/lib/admin/form";
import { resultKey } from "@/lib/admin/form-key";
import { sendNotification } from "./actions";

export function NotifyForm({ audiences }: { audiences: { value: string; label: string }[] }) {
  const [state, action, pending] = useActionState<AdminFormState, FormData>(sendNotification, {});
  const values = state.values ?? {};
  const errors = state.fieldErrors ?? {};
  return (
    <form key={resultKey(state)} action={action} className="space-y-5" noValidate>
      <FormMessage message={state.message} />
      <Field
        label="Title"
        name="title"
        defaultValue={values.title ?? ""}
        placeholder="New test this Saturday"
        hint="Short: up to 60 characters."
        errors={errors.title}
      />
      <TextArea
        label="Message"
        name="body"
        rows={3}
        defaultValue={values.body ?? ""}
        placeholder="O Level Maths test opens Saturday at 4 pm. Revise algebra and statistics!"
        hint="Up to 200 characters. Phones show the first line or two."
        errors={errors.body}
      />
      <Field
        label="Page to open when tapped"
        name="url"
        defaultValue={values.url ?? "/dashboard"}
        hint="A page on this site, e.g. /tests, /opportunities/scholarships or /learn."
        errors={errors.url}
      />
      <Select
        label="Send to"
        name="audience"
        defaultValue={values.audience ?? "ALL"}
        options={audiences}
      />
      <div className="max-w-xs">
        <SubmitButton pending={pending}>Send notification</SubmitButton>
      </div>
    </form>
  );
}
