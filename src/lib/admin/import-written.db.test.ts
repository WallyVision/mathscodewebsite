/** Importing written questions into a past paper, against a real database (DATABASE_URL). */
import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { db } from "@/lib/db";
import { createWrittenQuestions } from "./import-written";
import type { ImportedWrittenQuestion } from "./written-import";

const run = randomUUID().slice(0, 8);
let subjectId: string;
let paperId: string;
let topicId: string;

const q = (label: string, topic: string | null = null): ImportedWrittenQuestion => ({
  label,
  section: label[0]!,
  marks: 4,
  topic,
  body: `Question ${label}`,
  solution: `Solution ${label}`,
});

beforeAll(async () => {
  subjectId = (
    await db.subject.create({ data: { level: "O_LEVEL", slug: `wq-${run}`, name: "Written" } })
  ).id;
  topicId = (await db.topic.create({ data: { subjectId, slug: "sets", name: "Sets" } })).id;
  paperId = (
    await db.pastPaper.create({
      data: { subjectId, year: 2026, paperNumber: 2, title: "June 2026 P2" },
    })
  ).id;
});

afterAll(async () => {
  await db.subject.deleteMany({ where: { id: subjectId } });
  await db.$disconnect();
});

describe("createWrittenQuestions", () => {
  it("adds questions in file order with matched topics, then only new labels", async () => {
    expect(await createWrittenQuestions(paperId, [q("A1", "sets"), q("A2")])).toEqual({
      created: 2,
      skipped: [],
      unknownTopics: [],
    });
    expect(await createWrittenQuestions(paperId, [q("A1"), q("a2"), q("B1")], "PUBLISHED")).toEqual(
      { created: 1, skipped: ["A1", "a2"], unknownTopics: [] },
    );

    const saved = await db.writtenQuestion.findMany({
      where: { pastPaperId: paperId },
      orderBy: { position: "asc" },
    });
    expect(saved.map((s) => [s.label, s.position, s.topicId, s.status])).toEqual([
      ["A1", 1, topicId, "DRAFT"],
      ["A2", 2, null, "DRAFT"],
      ["B1", 3, null, "PUBLISHED"],
    ]);
  });

  it("saves nothing when a topic name is not in the subject", async () => {
    expect(await createWrittenQuestions(paperId, [q("B2", "Vectors")])).toEqual({
      created: 0,
      skipped: [],
      unknownTopics: ["Vectors"],
    });
    expect(await db.writtenQuestion.count({ where: { pastPaperId: paperId } })).toBe(3);
  });
});
