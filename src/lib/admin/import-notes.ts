import "server-only";
import type { ContentStatus } from "@prisma/client";
import { db } from "@/lib/db";
import type { ImportedNote } from "./note-import";

/**
 * Creates the notes in a topic, all or nothing. A note whose URL name the
 * topic already has is skipped, so importing the same file twice does not
 * create duplicates.
 */
export async function createImportedNotes(
  topicId: string,
  notes: readonly ImportedNote[],
  status: ContentStatus = "DRAFT",
): Promise<{ created: number; skipped: string[] }> {
  const existing = await db.note.findMany({
    where: { topicId, slug: { in: notes.map((n) => n.slug) } },
    select: { slug: true },
  });
  const taken = new Set(existing.map((n) => n.slug));
  const fresh = notes.filter((n) => !taken.has(n.slug));
  await db.$transaction(
    fresh.map((n) =>
      db.note.create({ data: { topicId, title: n.title, slug: n.slug, body: n.body, status } }),
    ),
  );
  return {
    created: fresh.length,
    skipped: notes.filter((n) => taken.has(n.slug)).map((n) => n.title),
  };
}
