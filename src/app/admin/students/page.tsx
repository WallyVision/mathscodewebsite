import type { Metadata } from "next";
import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { EmptyRow, PageHeader, tableClass, tdClass, thClass } from "@/components/admin";
import { ADMIN_ONLY, requireRole } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { normalizeCameroonPhone } from "@/lib/domain/phone";
import { LEVEL_LABEL } from "@/lib/domain/pricing";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = { title: "Students" };

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requireRole(ADMIN_ONLY);
  const { q = "" } = await searchParams;
  const now = new Date();
  const phone = q ? normalizeCameroonPhone(q) : null;
  const where: Prisma.UserWhereInput = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
          ...(phone ? [{ phone }] : [{ phone: { contains: q.replace(/\s/g, "") } }]),
        ],
      }
    : {};

  const users = await db.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      level: true,
      role: true,
      createdAt: true,
      subscriptions: {
        where: { endsAt: { gt: now } },
        orderBy: { endsAt: "desc" },
        take: 1,
        select: { endsAt: true },
      },
    },
  });

  return (
    <div>
      <PageHeader title="Students">Showing the {users.length} most recent matches.</PageHeader>
      <form className="mb-4 flex gap-2 text-sm" role="search">
        <input
          name="q"
          defaultValue={q}
          placeholder="Name, phone or email"
          className="min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-2 py-1.5"
        />
        <button className="rounded-md bg-slate-800 px-3 py-1.5 font-medium text-white">
          Search
        </button>
      </form>
      <div className="overflow-x-auto">
        <table className={tableClass}>
          <thead>
            <tr>
              <th className={thClass}>Name</th>
              <th className={thClass}>Contact</th>
              <th className={thClass}>Level</th>
              <th className={thClass}>Subscribed until</th>
              <th className={thClass}>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && <EmptyRow colSpan={5}>No one matches.</EmptyRow>}
            {users.map((u) => (
              <tr key={u.id}>
                <td className={tdClass}>
                  <Link
                    href={`/admin/students/${u.id}`}
                    className="font-medium text-brand-700 hover:underline"
                  >
                    {u.name}
                  </Link>
                  {u.role !== "STUDENT" && (
                    <span className="ml-1 text-xs text-slate-500">({u.role.toLowerCase()})</span>
                  )}
                </td>
                <td className={tdClass}>
                  {u.phone}
                  {u.email && <span className="block text-xs text-slate-500">{u.email}</span>}
                </td>
                <td className={tdClass}>{LEVEL_LABEL[u.level]}</td>
                <td className={tdClass}>
                  {u.subscriptions[0] ? formatDateTime(u.subscriptions[0].endsAt) : "–"}
                </td>
                <td className={`${tdClass} whitespace-nowrap`}>{formatDateTime(u.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
