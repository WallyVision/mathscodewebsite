"use server";

import { revalidatePath } from "next/cache";
import { formValues, invalid, type AdminFormState } from "@/lib/admin/form";
import { toolSchema } from "@/lib/admin/schemas";
import { ADMIN_ONLY, requireRole } from "@/lib/auth/session";
import { db } from "@/lib/db";

export async function saveTool(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  await requireRole(ADMIN_ONLY);
  const values = formValues(formData);
  const parsed = toolSchema.safeParse(values);
  if (!parsed.success) return invalid(parsed.error, values);
  const id = values.id || null;
  if (id) {
    await db.tool.update({ where: { id }, data: parsed.data });
  } else {
    await db.tool.create({ data: parsed.data });
  }
  revalidatePath("/admin/tools");
  revalidatePath("/tools");
  return { message: id ? "Saved." : `Added ${parsed.data.title}.` };
}

export async function deleteTool(id: string): Promise<void> {
  await requireRole(ADMIN_ONLY);
  await db.tool.delete({ where: { id } });
  revalidatePath("/admin/tools");
  revalidatePath("/tools");
}
