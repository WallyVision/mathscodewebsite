/**
 * Creates load-test data: one open 20-question test and N subscribed
 * students with ready-made sessions (so logins do not dominate the test).
 * Writes the details to the JSON file given as the second argument.
 *
 *   tsx scripts/load-test/setup.ts <students> <out.json>
 *   tsx scripts/load-test/setup.ts --cleanup
 *
 * Refuses to run against production. Everything it creates is tagged
 * "loadtest" and removed by --cleanup.
 */
import "dotenv/config";
import { createHash, randomBytes } from "node:crypto";
import { writeFileSync } from "node:fs";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();
const TAG = "loadtest";
const QUESTIONS = 20;

async function cleanup() {
  const tests = await db.test.findMany({
    where: { title: { startsWith: `[${TAG}]` } },
    select: { id: true },
  });
  await db.test.deleteMany({ where: { id: { in: tests.map((t) => t.id) } } });
  await db.question.deleteMany({ where: { stem: { startsWith: `[${TAG}]` } } });
  const users = await db.user.deleteMany({ where: { email: { endsWith: `@${TAG}.example` } } });
  await db.rateLimit.deleteMany({});
  console.log(`Removed ${tests.length} test(s) and ${users.count} load-test students.`);
}

async function setup(students: number, out: string) {
  await cleanup();
  const subject = await db.subject.findFirstOrThrow({
    where: { level: "O_LEVEL" },
    orderBy: { name: "asc" },
  });

  const questions = [];
  for (let i = 0; i < QUESTIONS; i++) {
    const q = await db.question.create({
      data: {
        subjectId: subject.id,
        stem: `[${TAG}] Question ${i + 1}: what is $${i} + ${i}$?`,
        solution: `$${i} + ${i} = ${2 * i}$`,
        status: "PUBLISHED",
        options: {
          create: ["A", "B", "C", "D"].map((label, j) => ({
            label,
            text: `$${2 * i + j}$`,
            isCorrect: j === 0,
          })),
        },
      },
      include: { options: true },
    });
    questions.push({ id: q.id, optionIds: q.options.map((o) => o.id) });
  }

  const now = Date.now();
  const test = await db.test.create({
    data: {
      subjectId: subject.id,
      title: `[${TAG}] Weekly test`,
      kind: "WEEKLY",
      status: "SCHEDULED",
      opensAt: new Date(now - 60 * 60 * 1000),
      closesAt: new Date(now + 24 * 60 * 60 * 1000),
      durationMinutes: 60,
      questions: { create: questions.map((q, position) => ({ questionId: q.id, position })) },
    },
  });

  const tokens: string[] = [];
  const users = Array.from({ length: students }, (_, i) => ({
    id: `${TAG}${i}${randomBytes(4).toString("hex")}`,
    name: `Load Student ${i}`,
    email: `student${i}@${TAG}.example`,
    passwordHash: "x",
    level: "O_LEVEL" as const,
  }));
  await db.user.createMany({ data: users });
  await db.subscription.createMany({
    data: users.map((u) => ({
      userId: u.id,
      level: "O_LEVEL" as const,
      startsAt: new Date(now - 60_000),
      endsAt: new Date(now + 30 * 86_400_000),
    })),
  });
  await db.session.createMany({
    data: users.map((u) => {
      const token = randomBytes(32).toString("base64url");
      tokens.push(token);
      return {
        id: createHash("sha256").update(token).digest("hex"),
        userId: u.id,
        expiresAt: new Date(now + 86_400_000),
      };
    }),
  });

  writeFileSync(out, JSON.stringify({ testId: test.id, questions, tokens }));
  console.log(
    `Created test ${test.id} with ${QUESTIONS} questions and ${students} subscribed students.`,
  );
}

async function main() {
  if (process.env.NODE_ENV === "production" || process.env.CAMPAY_ENVIRONMENT === "live") {
    throw new Error("Refusing to create load-test data in production.");
  }
  if (process.argv[2] === "--cleanup") return cleanup();
  const students = Number(process.argv[2]);
  const out = process.argv[3];
  if (!Number.isInteger(students) || students < 1 || !out) {
    throw new Error("Usage: tsx scripts/load-test/setup.ts <students> <out.json> | --cleanup");
  }
  await setup(students, out);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
