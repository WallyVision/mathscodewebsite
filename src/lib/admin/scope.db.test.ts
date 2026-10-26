/** Which subjects staff may edit, against a real database (DATABASE_URL). */
import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { CurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { contentScope, inScope } from "./scope";

const run = randomUUID().slice(0, 8);
let subjectId: string;
let otherId: string;
const users: CurrentUser[] = [];

const make = async (role: "ADMIN" | "AUTHOR" | "STUDENT") => {
  const user = await db.user.create({
    data: {
      name: role,
      email: `scope-${run}-${role}@example.test`,
      passwordHash: "x",
      level: "O_LEVEL",
      role,
    },
    select: { id: true, name: true, role: true, level: true, email: true, phone: true },
  });
  users.push(user);
  return user;
};

beforeAll(async () => {
  subjectId = (
    await db.subject.create({ data: { level: "O_LEVEL", slug: `scope-${run}`, name: "Scope" } })
  ).id;
  otherId = (
    await db.subject.create({ data: { level: "O_LEVEL", slug: `scope-o-${run}`, name: "Other" } })
  ).id;
});

afterAll(async () => {
  await db.subject.deleteMany({ where: { id: { in: [subjectId, otherId] } } });
  await db.user.deleteMany({ where: { id: { in: users.map((u) => u.id) } } });
  await db.$disconnect();
});

describe("content scope", () => {
  it("gives admins every subject", async () => {
    const scope = await contentScope(await make("ADMIN"));
    expect(inScope(scope, subjectId) && inScope(scope, otherId)).toBe(true);
  });

  it("limits authors to their teams' subjects", async () => {
    const author = await make("AUTHOR");
    expect(inScope(await contentScope(author), subjectId)).toBe(false);
    await db.subjectTeamMember.create({ data: { subjectId, userId: author.id } });
    const scope = await contentScope({ ...author });
    expect(inScope(scope, subjectId)).toBe(true);
    expect(inScope(scope, otherId)).toBe(false);
    expect(inScope(scope, null)).toBe(false);
  });

  it("gives students nothing", async () => {
    expect(await contentScope(await make("STUDENT"))).toEqual({ all: false, subjectIds: [] });
  });
});
