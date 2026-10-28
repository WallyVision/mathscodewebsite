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
let otherSubjectId: string;
const otherSubjectIdFor = () => otherSubjectId;

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
  otherSubjectId = other.id;
});

afterAll(async () => {
  await db.question.deleteMany({ where: { subjectId } });
  await db.pastPaper.deleteMany({ where: { subjectId } });
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
      pastPaperId: null,
    });
  });

  it("creates every question as a draft with its answer key, once", async () => {
    const { questions } = parseQuestionImport(
      readFileSync("docs/content/o-level-maths-algebra-01.md", "utf8"),
    );
    expect(
      await createImportedQuestions({ subjectId, topicId, pastPaperId: null }, questions),
    ).toEqual({
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

    const again = await createImportedQuestions(
      { subjectId, topicId, pastPaperId: null },
      questions,
    );
    expect(again.created).toBe(0);
    expect(again.skipped).toHaveLength(20);
    expect(await db.question.count({ where: { subjectId } })).toBe(20);
  });

  it("puts questions into a past paper, numbered from their headings, once", async () => {
    const paper = await db.pastPaper.create({
      data: { subjectId, year: 2024, paperNumber: 1, title: `June 2024 Paper 1 ${run}` },
    });
    expect(await resolveImportTarget(otherSubjectIdFor(), null, paper.id)).toMatchObject({
      ok: false,
    });
    const target = await resolveImportTarget(subjectId, null, paper.id);
    expect(target).toMatchObject({ ok: true, pastPaperId: paper.id });
    if (!target.ok) return;

    const text = [3, 7]
      .map(
        (n) =>
          `## Q${n}\n\n**Stem**\n\nPaper question ${n} ${run}\n\n**Options**\n\n- A. 1\n- B. 2\n- C. 3\n- D. 4\n\n**Correct:** C\n`,
      )
      .join("\n");
    const { questions } = parseQuestionImport(text);
    expect(await createImportedQuestions(target, questions)).toEqual({ created: 2, skipped: [] });
    const saved = await db.question.findMany({
      where: { pastPaperId: paper.id },
      orderBy: { number: "asc" },
      select: { number: true, source: true },
    });
    expect(saved).toEqual([
      { number: 3, source: "PAST_PAPER" },
      { number: 7, source: "PAST_PAPER" },
    ]);

    // Same numbers again (even with new text) are skipped, not duplicated.
    const again = parseQuestionImport(text.replaceAll("Paper question", "Retyped question"));
    expect((await createImportedQuestions(target, again.questions)).created).toBe(0);
  });
});
