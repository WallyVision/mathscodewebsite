import Link from "next/link";
import type { ReactNode } from "react";

export function PageHeader({
  title,
  action,
  children,
}: {
  title: string;
  action?: { href: string; label: string };
  children?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {children && <div className="mt-1 text-sm text-slate-600">{children}</div>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

export function SavedBanner({
  show,
  children = "Saved.",
}: {
  show: boolean;
  children?: ReactNode;
}) {
  if (!show) return null;
  return (
    <p role="status" className="mb-4 rounded-md bg-emerald-50 px-4 py-2 text-sm text-emerald-800">
      {children}
    </p>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PUBLISHED: "bg-emerald-100 text-emerald-800",
    SCHEDULED: "bg-emerald-100 text-emerald-800",
    DRAFT: "bg-slate-100 text-slate-700",
    PENDING_VERIFICATION: "bg-amber-100 text-amber-800",
    VERIFIED: "bg-sky-100 text-sky-800",
    PAID: "bg-emerald-100 text-emerald-800",
    DISQUALIFIED: "bg-red-100 text-red-700",
    OPEN: "bg-sky-100 text-sky-800",
    CLOSED: "bg-slate-100 text-slate-700",
    IN_PROGRESS: "bg-sky-100 text-sky-800",
    SUBMITTED: "bg-emerald-100 text-emerald-800",
    EXPIRED: "bg-amber-100 text-amber-800",
    SUCCESSFUL: "bg-emerald-100 text-emerald-800",
    PENDING: "bg-amber-100 text-amber-800",
    FAILED: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${styles[status] ?? "bg-slate-100 text-slate-700"}`}
    >
      {status.replaceAll("_", " ").toLowerCase()}
    </span>
  );
}

export function EmptyRow({ colSpan, children }: { colSpan: number; children: ReactNode }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-3 py-6 text-center text-slate-500">
        {children}
      </td>
    </tr>
  );
}

export const tableClass = "w-full rounded-lg border border-slate-200 bg-white text-sm";
export const thClass = "px-3 py-2 text-left font-medium text-slate-500";
export const tdClass = "border-t border-slate-100 px-3 py-2 align-top";
