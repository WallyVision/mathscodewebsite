"use server";

import { createImportedQuestions, resolveImportTarget } from "@/lib/admin/import-questions";
import { parseQuestionImport } from "@/lib/admin/question-import";
import { contentScope, inScope, NOT_YOUR_SUBJECT } from "@/lib/admin/scope";
import { requireRole, STAFF_ROLES } from "@/lib/auth/session";

// Stays under the 1 MB request limit for server actions.
const MAX_FILE_BYTES = 500_000;

export interface ImportState {
  message?: string;
  errors?: string[];
  /** Questions found by "Check", shown before anything is saved. */
  preview?: { title: string; stem: string; correct: string; difficulty: number }[];
  created?: number;
  skipped?: string[];
  values?: { subjectId: string; topicId: string; pastPaperId: string; text: string };
}

export async function importQuestions(
  _prev: ImportState,
  formData: FormData,
): Promise<ImportState> {
  const user = await requireRole(STAFF_ROLES);
  const subjectId = String(formData.get("subjectId") ?? "");
  const topicId = String(formData.get("topicId") ?? "");
  const pastPaperId = String(formData.get("pastPaperId") ?? "");
  const file = formData.get("file");
  let text = String(formData.get("text") ?? "");
  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_FILE_BYTES) {
      return {
        message: "That file is too large (500 KB at most).",
        values: { subjectId, topicId, pastPaperId, text },
      };
    }
    text = await file.text();
  }
  const values = { subjectId, topicId, pastPaperId, text };

  if (!inScope(await contentScope(user), subjectId)) return { message: NOT_YOUR_SUBJECT, values };
  const target = await resolveImportTarget(subjectId, topicId || null, pastPaperId || null);
  if (!target.ok) return { message: target.message, values };

  if (!text.trim()) {
    return {
      message: "The Questions box is empty. Paste the questions into it, or choose a file.",
      values,
    };
  }

  const { questions, errors } = parseQuestionImport(text);
  if (errors.length > 0) {
    return {
      message: "Nothing was saved. Fix these problems and try again.",
      errors,
      values,
    };
  }

  if (formData.get("intent") !== "import") {
    return {
      preview: questions.map((q) => ({
        title: q.title,
        stem: q.stem,
        correct: q.correct,
        difficulty: q.difficulty,
      })),
      values,
    };
  }

  const result = await createImportedQuestions(target, questions, {
    forTests: formData.get("forTests") === "on",
  });
  return { ...result, values: { subjectId, topicId, pastPaperId, text: "" } };
}
