import { z } from "zod";

export interface AdminFormState {
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  /** What was submitted, so fields keep their text when validation fails. */
  values?: Record<string, string>;
}

/** Single-valued fields from a form, as strings. */
export function formValues(formData: FormData): Record<string, string> {
  const values: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string" && !(key in values)) values[key] = value;
  }
  return values;
}

export function invalid(error: z.ZodError, values: Record<string, string>): AdminFormState {
  const { fieldErrors, formErrors } = z.flattenError(error);
  return {
    fieldErrors: fieldErrors as Record<string, string[] | undefined>,
    message: formErrors[0] ?? "Please correct the highlighted fields.",
    values,
  };
}
