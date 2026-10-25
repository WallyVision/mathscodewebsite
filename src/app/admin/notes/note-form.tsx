"use client";

import { useActionState, useState } from "react";
import { Field, FormMessage, Select, SubmitButton, TextArea } from "@/components/form";
import { ImageUploader } from "@/components/image-uploader";
import type { AdminFormState } from "@/lib/admin/form";
import { resultKey } from "@/lib/admin/form-key";
import type { ContentOptions } from "@/lib/admin/options";
import { slugify } from "@/lib/slug";
import { saveNote } from "./actions";

export function NoteForm({
  subjects,
  initial,
}: {
  subjects: ContentOptions;
  initial: Record<string, string>;
}) {
  const [state, action, pending] = useActionState<AdminFormState, FormData>(saveNote, {});
  const values = state.values ?? initial;
  const errors = state.fieldErrors ?? {};
  const [title, setTitle] = useState(values.title ?? "");
  const [slug, setSlug] = useState(values.slug ?? "");
  // New notes take their URL name from the title until it is edited by hand.
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.id));

  return (
    <>
      <ImageUploader />
      <form key={resultKey(state)} action={action} className="space-y-5" noValidate>
        {initial.id && <input type="hidden" name="id" value={initial.id} />}
        <FormMessage message={state.message} />

        <div className="space-y-1">
          <label htmlFor="topicId" className="block text-sm font-medium text-slate-700">
            Topic
          </label>
          <select
            id="topicId"
            name="topicId"
            defaultValue={values.topicId ?? ""}
            className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-base"
          >
            <option value="">Choose a topic</option>
            {subjects.map((s) => (
              <optgroup key={s.id} label={s.name}>
                {s.topics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          {errors.topicId && <p className="text-xs text-red-600">Choose a topic</p>}
        </div>

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
          hint="Appears in the page address. Changing it breaks links students have saved."
          errors={errors.slug}
        />
        <TextArea
          label="Note"
          name="body"
          rows={20}
          defaultValue={values.body ?? ""}
          hint="Markdown with $inline$ maths. Put $$ on their own lines for display maths."
          errors={errors.body}
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
          <SubmitButton pending={pending}>Save note</SubmitButton>
        </div>
      </form>
    </>
  );
}
