import type { InputHTMLAttributes, ReactNode } from "react";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  hint?: ReactNode;
  errors?: string[];
}

export function Field({ label, name, hint, errors, ...input }: FieldProps) {
  const errorId = errors?.length ? `${name}-error` : undefined;
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        aria-invalid={errorId ? true : undefined}
        aria-describedby={errorId}
        className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-base shadow-sm focus:border-brand-600 focus:ring-2 focus:ring-brand-100 focus:outline-none aria-invalid:border-red-500"
        {...input}
      />
      {hint && !errorId && <p className="text-xs text-slate-500">{hint}</p>}
      {errorId && (
        <p id={errorId} className="text-xs text-red-600">
          {errors?.[0]}
        </p>
      )}
    </div>
  );
}

export function SubmitButton({ pending, children }: { pending: boolean; children: ReactNode }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md bg-brand-600 px-4 py-2.5 font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
    >
      {pending ? "Please wait…" : children}
    </button>
  );
}

export function FormMessage({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
      {message}
    </p>
  );
}
