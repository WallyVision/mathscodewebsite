import type React from "react";
import type { InputHTMLAttributes, ReactNode } from "react";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  hint?: ReactNode;
  errors?: string[];
}

export function Field({ label, name, hint, errors, id, ...input }: FieldProps) {
  const fieldId = id ?? name;
  const errorId = errors?.length ? `${fieldId}-error` : undefined;
  return (
    <div className="space-y-1">
      <label htmlFor={fieldId} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={fieldId}
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

const controlClass =
  "block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-base shadow-sm focus:border-brand-600 focus:ring-2 focus:ring-brand-100 focus:outline-none aria-invalid:border-red-500";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  name: string;
  hint?: ReactNode;
  errors?: string[];
}

export function TextArea({ label, name, hint, errors, className, id, ...rest }: TextAreaProps) {
  const fieldId = id ?? name;
  const errorId = errors?.length ? `${fieldId}-error` : undefined;
  return (
    <div className="space-y-1">
      <label htmlFor={fieldId} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <textarea
        id={fieldId}
        name={name}
        aria-invalid={errorId ? true : undefined}
        aria-describedby={errorId}
        className={`${controlClass} font-mono text-sm ${className ?? ""}`}
        {...rest}
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

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  errors?: string[];
}

export function Select({ label, name, options, errors, id, ...rest }: SelectProps) {
  const fieldId = id ?? name;
  const errorId = errors?.length ? `${fieldId}-error` : undefined;
  return (
    <div className="space-y-1">
      <label htmlFor={fieldId} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <select
        id={fieldId}
        name={name}
        aria-invalid={errorId ? true : undefined}
        aria-describedby={errorId}
        className={controlClass}
        {...rest}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {errorId && (
        <p id={errorId} className="text-xs text-red-600">
          {errors?.[0]}
        </p>
      )}
    </div>
  );
}
