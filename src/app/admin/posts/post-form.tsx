"use client";

import { useActionState, useState } from "react";
import { Field, FormMessage, Select, SubmitButton, TextArea } from "@/components/form";
import type { AdminFormState } from "@/lib/admin/form";
import { resultKey } from "@/lib/admin/form-key";
import { CATEGORIES } from "@/lib/domain/posts";
import { slugify } from "@/lib/slug";
import { savePost } from "./actions";

export function PostForm({ initial }: { initial: Record<string, string> }) {
  const [state, action, pending] = useActionState<AdminFormState, FormData>(savePost, {});
  const values = state.values ?? initial;
  const errors = state.fieldErrors ?? {};
  const [category, setCategory] = useState(values.category ?? "SCHOLARSHIP");
  const [title, setTitle] = useState(values.title ?? "");
  const [slug, setSlug] = useState(values.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.id));
  const hasDeadlines = CATEGORIES.find((c) => c.category === category)?.hasDeadlines ?? false;

  return (
    <form key={resultKey(state)} action={action} className="space-y-5" noValidate>
      {initial.id && <input type="hidden" name="id" value={initial.id} />}
      <FormMessage message={state.message} />
      <Select
        label="Section"
        name="category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        options={CATEGORIES.map((c) => ({ value: c.category, label: `${c.icon} ${c.label}` }))}
        errors={errors.category}
      />
      <Field
        label="Title"
        name="title"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          if (!slugTouched) setSlug(slugify(e.target.value));
        }}
        errors={errors.title}
      />
      <Field
        label="URL name"
        name="slug"
        value={slug}
        onChange={(e) => {
          setSlugTouched(true);
          setSlug(e.target.value);
        }}
        hint="Appears in the page address. Changing it breaks links people have shared."
        errors={errors.slug}
      />
      <TextArea
        label="Summary"
        name="summary"
        rows={2}
        defaultValue={values.summary ?? ""}
        hint="One or two sentences. Shown in lists and in WhatsApp previews."
        errors={errors.summary}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label={hasDeadlines ? "Organisation" : "Source (optional)"}
          name="organisation"
          defaultValue={values.organisation ?? ""}
          errors={errors.organisation}
        />
        <Field
          label="Location (optional)"
          name="location"
          defaultValue={values.location ?? ""}
          placeholder="e.g. Douala, Online, Canada"
          errors={errors.location}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Official link (optional)"
          name="externalUrl"
          type="url"
          defaultValue={values.externalUrl ?? ""}
          placeholder="https://"
          hint={hasDeadlines ? "Where students apply. Use the official site only." : undefined}
          errors={errors.externalUrl}
        />
        <Field
          label={hasDeadlines ? "Deadline (Cameroon time)" : "Deadline (not needed for guides)"}
          name="deadline"
          type="datetime-local"
          defaultValue={values.deadline ?? ""}
          errors={errors.deadline}
        />
      </div>
      <TextArea
        label="Article"
        name="body"
        rows={18}
        defaultValue={values.body ?? ""}
        hint="Markdown: ## headings, - bullet lists, **bold**."
        errors={errors.body}
      />
      <Select
        label="Status"
        name="status"
        defaultValue={values.status ?? "DRAFT"}
        options={[
          { value: "DRAFT", label: "Draft (hidden)" },
          { value: "PUBLISHED", label: "Published (public)" },
        ]}
      />
      <div className="max-w-xs">
        <SubmitButton pending={pending}>Save post</SubmitButton>
      </div>
    </form>
  );
}
