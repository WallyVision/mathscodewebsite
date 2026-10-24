import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { db } from "@/lib/db";
import { listCategoryPosts } from "./posts";

const run = randomUUID().slice(0, 8);
const now = new Date();
const days = (n: number) => new Date(now.getTime() + n * 86_400_000);

beforeAll(async () => {
  const base = {
    category: "SCHOLARSHIP" as const,
    summary: "Summary text",
    body: "Body",
    publishedAt: days(-1),
  };
  await db.post.createMany({
    data: [
      {
        ...base,
        slug: `${run}-later`,
        title: "Closes in 30 days",
        status: "PUBLISHED",
        deadline: days(30),
      },
      {
        ...base,
        slug: `${run}-soon`,
        title: "Closes in 3 days",
        status: "PUBLISHED",
        deadline: days(3),
      },
      {
        ...base,
        slug: `${run}-rolling`,
        title: "No deadline",
        status: "PUBLISHED",
        deadline: null,
      },
      { ...base, slug: `${run}-closed`, title: "Closed", status: "PUBLISHED", deadline: days(-2) },
      { ...base, slug: `${run}-draft`, title: "Draft", status: "DRAFT", deadline: days(10) },
      {
        ...base,
        slug: `${run}-future`,
        title: "Scheduled",
        status: "PUBLISHED",
        publishedAt: days(2),
        deadline: days(10),
      },
    ],
  });
});

afterAll(async () => {
  await db.post.deleteMany({ where: { slug: { startsWith: run } } });
  await db.$disconnect();
});

describe("listCategoryPosts", () => {
  it("lists open posts by soonest deadline, keeps closed ones apart and hides drafts", async () => {
    const { open, closed } = await listCategoryPosts("SCHOLARSHIP", true, now);
    const mine = (list: { slug: string; title: string }[]) =>
      list.filter((p) => p.slug.startsWith(run)).map((p) => p.title);
    expect(mine(open)).toEqual(["Closes in 3 days", "Closes in 30 days", "No deadline"]);
    expect(mine(closed)).toEqual(["Closed"]);
  });
});
