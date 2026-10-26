/** Student questions against a real database (DATABASE_URL). */
import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { CurrentUser } from "@/lib/auth/session";
import { contentScope } from "@/lib/admin/scope";
import { db } from "@/lib/db";
import { askableSubjects, createStudentQuestion, inboxQuestions, openQuestionCount } from "./ask";

const run = randomUUID().slice(0, 8);
let oMaths: string;
let oPhysics: string;
let aMaths: string;
const users: CurrentUser[] = [];

const make = async (name: string, role: "STUDENT" | "AUTHOR" = "STUDENT") => {
  const user = await db.user.create({
    data: {
      name,
      email: `ask-${run}-${users.length}@example.test`,
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
  const subject = (level: "O_LEVEL" | "A_LEVEL", slug: string) =>
    db.subject.create({
      data: { level, slug: `${slug}-${run}`, name: slug },
      select: { id: true },
    });
  oMaths = (await subject("O_LEVEL", "ask-om")).id;
  oPhysics = (await subject("O_LEVEL", "ask-op")).id;
  aMaths = (await subject("A_LEVEL", "ask-am")).id;
});

afterAll(async () => {
  const ids = users.map((u) => u.id);
  await db.studentQuestion.deleteMany({ where: { userId: { in: ids } } });
  await db.subscription.deleteMany({ where: { userId: { in: ids } } });
  await db.subject.deleteMany({ where: { id: { in: [oMaths, oPhysics, aMaths] } } });
  await db.user.deleteMany({ where: { id: { in: ids } } });
  await db.$disconnect();
});

describe("student questions", () => {
  it("are for members, about subjects at their membership's level", async () => {
    const free = await make("Free Student");
    expect(await askableSubjects(free)).toEqual([]);
    expect(
      await createStudentQuestion(free, { subjectId: oMaths, body: "Help", imageId: null }),
    ).toMatchObject({ ok: false });

    const member = await make("Member Student");
    await db.subscription.create({
      data: {
        userId: member.id,
        level: "O_LEVEL",
        startsAt: new Date(Date.now() - 1000),
        endsAt: new Date(Date.now() + 86_400_000),
      },
    });
    const ids = (await askableSubjects(member)).map((s) => s.id);
    expect(ids).toEqual(expect.arrayContaining([oMaths, oPhysics]));
    expect(ids).not.toContain(aMaths);
    expect(
      await createStudentQuestion(member, { subjectId: aMaths, body: "Help", imageId: null }),
    ).toMatchObject({ ok: false });
    expect(
      await createStudentQuestion(member, { subjectId: oMaths, body: "  ", imageId: null }),
    ).toEqual({ ok: false, message: "Type your question or attach a photo of it." });
    expect(
      await createStudentQuestion(member, {
        subjectId: oMaths,
        body: "Solve $x^2=4$",
        imageId: null,
      }),
    ).toMatchObject({ ok: true });
    expect(
      await createStudentQuestion(member, { subjectId: oPhysics, body: "", imageId: "img-1" }),
    ).toMatchObject({ ok: true });
  });

  it("reach only the subject's team in the inbox", async () => {
    const mathsTeacher = await make("Maths Teacher", "AUTHOR");
    await db.subjectTeamMember.create({ data: { subjectId: oMaths, userId: mathsTeacher.id } });
    const scope = await contentScope(mathsTeacher);
    const inbox = await inboxQuestions(scope, "OPEN");
    expect(inbox.every((q) => q.subjectId === oMaths)).toBe(true);
    expect(inbox.map((q) => q.body)).toContain("Solve $x^2=4$");
    expect(await openQuestionCount(scope)).toBe(inbox.length);
  });
});
