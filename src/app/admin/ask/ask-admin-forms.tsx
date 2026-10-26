"use client";

import { useActionState, useTransition } from "react";
import { FormMessage, TextArea } from "@/components/form";
import type { AdminFormState } from "@/lib/admin/form";
import { resultKey } from "@/lib/admin/form-key";
import { replyToQuestion, setQuestionStatus } from "./actions";

export function ReplyForm({ questionId }: { questionId: string }) {
  const [state, action, pending] = useActionState<AdminFormState, FormData>(replyToQuestion, {});
  return (
    <form key={resultKey(state)} action={action} className="space-y-2">
      <input type="hidden" name="questionId" value={questionId} />
      <FormMessage message={state.fieldErrors ? undefined : state.message} />
      <TextArea
        label="Reply"
        name="body"
        id={`reply-${questionId}`}
        rows={5}
        defaultValue={state.values?.body ?? ""}
        errors={state.fieldErrors?.body}
        hint="Explain step by step. Markdown and $maths$ work, and you can paste an image line from Images."
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send reply"}
      </button>
    </form>
  );
}

export function StatusButton({
  questionId,
  status,
  label,
}: {
  questionId: string;
  status: "OPEN" | "CLOSED";
  label: string;
}) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => start(() => setQuestionStatus(questionId, status))}
      className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50 disabled:opacity-60"
    >
      {label}
    </button>
  );
}
