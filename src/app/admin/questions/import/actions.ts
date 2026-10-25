"use server";

import { createImportedQuestions, resolveImportTarget } from "@/lib/admin/import-questions";
import { parseQuestionImport } from "@/lib/admin/question-import";
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
  values?: { subjectId: string; topicId: string; text: string };
}

export async function importQuestions(
  _prev: ImportState,
  formData: FormData,
): Promise<ImportState> {
  await requireRole(STAFF_ROLES);
  const subjectId = String(formData.get("subjectId") ?? "");
  const topicId = String(formData.get("topicId") ?? "");
  const file = formData.get("file");
  let text = String(formData.get("text") ?? "");
  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_FILE_BYTES) {
      return {
        message: "That file is too large (500 KB at most).",
        values: { subjectId, topicId, text },
      };
    }
    text = await file.text();
  }
  const values = { subjectId, topicId, text };

  const target = await resolveImportTarget(subjectId, topicId || null);
  if (!target.ok) return { message: target.message, values };

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

  const result = await createImportedQuestions(target, questions);
  return { ...result, values: { subjectId, topicId, text: "" } };
}
