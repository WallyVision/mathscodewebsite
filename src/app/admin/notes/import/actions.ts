"use server";

import { createImportedNotes } from "@/lib/admin/import-notes";
import { parseNoteImport } from "@/lib/admin/note-import";
import { contentScope, inScope, NOT_YOUR_SUBJECT, topicSubjectId } from "@/lib/admin/scope";
import { requireRole, STAFF_ROLES } from "@/lib/auth/session";

export interface NoteImportState {
  message?: string;
  errors?: string[];
  /** Notes found by "Check", shown before anything is saved. */
  preview?: { heading: string; title: string; slug: string; length: number }[];
  created?: number;
  skipped?: string[];
  values?: { subjectId: string; topicId: string; status: string; text: string };
}

export async function importNotes(
  _prev: NoteImportState,
  formData: FormData,
): Promise<NoteImportState> {
  const user = await requireRole(STAFF_ROLES);
  const subjectId = String(formData.get("subjectId") ?? "");
  const topicId = String(formData.get("topicId") ?? "");
  const status = formData.get("status") === "PUBLISHED" ? "PUBLISHED" : "DRAFT";
  const text = String(formData.get("text") ?? "");
  const values = { subjectId, topicId, status, text };

  const topicSubject = topicId ? await topicSubjectId(topicId) : null;
  if (!topicSubject || topicSubject !== subjectId) return { message: "Choose a topic.", values };
  if (!inScope(await contentScope(user), topicSubject))
    return { message: NOT_YOUR_SUBJECT, values };

  if (!text.trim()) {
    return {
      message: "The Notes box is empty. Paste the notes into it, or choose a file.",
      values,
    };
  }
  const { notes, errors } = parseNoteImport(text);
  if (errors.length > 0) {
    return { message: "Nothing was saved. Fix these problems and try again.", errors, values };
  }

  if (formData.get("intent") !== "import") {
    return {
      preview: notes.map((n) => ({
        heading: n.heading,
        title: n.title,
        slug: n.slug,
        length: n.body.length,
      })),
      values,
    };
  }

  const result = await createImportedNotes(topicId, notes, status);
  return { ...result, values: { ...values, text: "" } };
}
