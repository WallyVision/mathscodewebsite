/** Question import against a real database (DATABASE_URL). */
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { db } from "@/lib/db";
import { createImportedQuestions, resolveImportTarget } from "./import-questions";
import { parseQuestionImport } from "./question-import";

const run = randomUUID().slice(0, 8);
let subjectId: string;
let topicId: string;
let otherTopicId: string;

beforeAll(async () => {
  const subject = await db.subject.create({
    data: {
      level: "O_LEVEL",
      slug: `import-${run}`,
      name: `Import ${run}`,
      topics: { create: [{ slug: "algebra", name: "Algebra", position: 0 }] },
    },
    include: { topics: true },
  });
  subjectId = subject.id;
  topicId = subject.topics[0]!.id;
  const other = await db.subject.create({
    data: {
      level: "O_LEVEL",
      slug: `import-other-${run}`,
      name: `Other ${run}`,
      topics: { create: [{ slug: "sets", name: "Sets", position: 0 }] },
    },
    include: { topics: true },
  });
  otherTopicId = other.topics[0]!.id;
});

afterAll(async () => {
  await db.subject.deleteMany({
    where: { slug: { in: [`import-${run}`, `import-other-${run}`] } },
  });
  await db.$disconnect();
});

describe("question import", () => {
  it("refuses a topic from another subject", async () => {
    expect(await resolveImportTarget(subjectId, otherTopicId)).toMatchObject({ ok: false });
    expect(await resolveImportTarget("missing", null)).toMatchObject({ ok: false });
    expect(await resolveImportTarget(subjectId, topicId)).toEqual({
      ok: true,
      subjectId,
      topicId,
    });
  });

  it("creates every question as a draft with its answer key, once", async () => {
    const { questions } = parseQuestionImport(
      readFileSync("docs/content/o-level-maths-algebra-01.md", "utf8"),
    );
    expect(await createImportedQuestions({ subjectId, topicId }, questions)).toEqual({
      created: 20,
      skipped: [],
    });

    const saved = await db.question.findMany({
      where: { subjectId },
      include: { options: { orderBy: { label: "asc" } } },
    });
    expect(saved).toHaveLength(20);
    expect(saved.every((q) => q.status === "DRAFT" && q.topicId === topicId)).toBe(true);
    const q4 = saved.find((q) => q.stem.startsWith("Find the value of $2x^2 - 3y$"))!;
    expect(q4.difficulty).toBe(2);
    expect(q4.options.filter((o) => o.isCorrect).map((o) => o.label)).toEqual(["D"]);

    const again = await createImportedQuestions({ subjectId, topicId }, questions);
    expect(again.created).toBe(0);
    expect(again.skipped).toHaveLength(20);
    expect(await db.question.count({ where: { subjectId } })).toBe(20);
  });
});
