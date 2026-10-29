/** Importing notes into a topic, against a real database (DATABASE_URL). */
import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { db } from "@/lib/db";
import { createImportedNotes } from "./import-notes";

const run = randomUUID().slice(0, 8);
let subjectId: string;
let topicId: string;

const note = (slug: string) => ({
  heading: slug,
  title: `Title ${slug}`,
  slug,
  body: `Body ${slug}`,
});

beforeAll(async () => {
  subjectId = (
    await db.subject.create({ data: { level: "O_LEVEL", slug: `notes-${run}`, name: "Notes" } })
  ).id;
  topicId = (await db.topic.create({ data: { subjectId, slug: "algebra", name: "Algebra" } })).id;
});

afterAll(async () => {
  await db.subject.deleteMany({ where: { id: subjectId } });
  await db.$disconnect();
});

describe("createImportedNotes", () => {
  it("creates drafts, then skips the same notes on a second import", async () => {
    expect(await createImportedNotes(topicId, [note("one"), note("two")])).toEqual({
      created: 2,
      skipped: [],
    });
    expect(await createImportedNotes(topicId, [note("two"), note("three")], "PUBLISHED")).toEqual({
      created: 1,
      skipped: ["Title two"],
    });
    const saved = await db.note.findMany({ where: { topicId }, orderBy: { slug: "asc" } });
    expect(saved.map((n) => `${n.slug}:${n.status}`)).toEqual([
      "one:DRAFT",
      "three:PUBLISHED",
      "two:DRAFT",
    ]);
  });
});
