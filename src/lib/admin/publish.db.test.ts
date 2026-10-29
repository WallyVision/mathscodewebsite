/** "Publish all drafts", against a real database (DATABASE_URL). */
import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { db } from "@/lib/db";
import { publishDrafts } from "./publish";

const run = randomUUID().slice(0, 8);
let subjectId: string;
let otherId: string;
let paperId: string;

const question = (subject: string, stem: string, pastPaperId: string | null = null) =>
  db.question.create({
    data: {
      subjectId: subject,
      pastPaperId,
      number: pastPaperId ? Math.floor(Math.random() * 1000) : null,
      stem,
      source: pastPaperId ? "PAST_PAPER" : "ORIGINAL",
      options: {
        create: ["A", "B", "C", "D"].map((label) => ({
          label,
          text: label,
          isCorrect: label === "A",
        })),
      },
    },
    select: { id: true },
  });

const statuses = async (subject: string) =>
  (await db.question.findMany({ where: { subjectId: subject }, orderBy: { stem: "asc" } })).map(
    (q) => `${q.stem}:${q.status}`,
  );

beforeAll(async () => {
  subjectId = (
    await db.subject.create({ data: { level: "O_LEVEL", slug: `pub-${run}`, name: "Pub" } })
  ).id;
  otherId = (
    await db.subject.create({ data: { level: "O_LEVEL", slug: `pub-o-${run}`, name: "Other" } })
  ).id;
  paperId = (
    await db.pastPaper.create({
      data: { subjectId, year: 2026, paperNumber: 1, title: "June 2026 P1" },
    })
  ).id;
  await question(subjectId, "a paper q", paperId);
  await db.writtenQuestion.create({ data: { pastPaperId: paperId, label: "A1", body: "written" } });
  await question(subjectId, "b loose q");
  await question(otherId, "c other subject");
});

afterAll(async () => {
  await db.question.deleteMany({ where: { subjectId: { in: [subjectId, otherId] } } });
  await db.subject.deleteMany({ where: { id: { in: [subjectId, otherId] } } });
  await db.$disconnect();
});

describe("publishDrafts", () => {
  it("publishes only the paper's drafts, written questions included", async () => {
    expect(await publishDrafts({ all: true }, { pastPaperId: paperId })).toBe(2);
    expect(
      (await db.writtenQuestion.findFirstOrThrow({ where: { pastPaperId: paperId } })).status,
    ).toBe("PUBLISHED");
    expect(await statuses(subjectId)).toEqual(["a paper q:PUBLISHED", "b loose q:DRAFT"]);
  });

  it("stays within an author's subjects", async () => {
    expect(await publishDrafts({ all: false, subjectIds: [subjectId] }, {})).toBe(1);
    expect(await statuses(subjectId)).toEqual(["a paper q:PUBLISHED", "b loose q:PUBLISHED"]);
    expect(await statuses(otherId)).toEqual(["c other subject:DRAFT"]);
  });
});
