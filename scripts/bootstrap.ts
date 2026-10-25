/**
 * Runs before the production server starts (see `start:production`), so a new
 * site needs no shell access:
 *
 * - On an empty database, creates the subjects and topics (no sample content).
 * - Gives admin access to each account in ADMIN_ACCOUNTS (comma-separated phone
 *   numbers or emails). Register on the site first; accounts not found yet are
 *   skipped and picked up at the next start.
 *
 * Problems are logged and never stop the server from starting.
 */
import "dotenv/config";
import { execSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";
import { normalizeCameroonPhone } from "../src/lib/domain/phone";

const db = new PrismaClient();

async function seedCurriculumIfEmpty() {
  if ((await db.subject.count()) > 0) return;
  console.log("[bootstrap] Empty database: creating subjects and topics");
  execSync("npx prisma db seed", {
    stdio: "inherit",
    env: { ...process.env, SEED_SAMPLE_CONTENT: "false" },
  });
}

async function grantConfiguredAdmins() {
  const identifiers = (process.env.ADMIN_ACCOUNTS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  for (const identifier of identifiers) {
    const phone = identifier.includes("@") ? null : normalizeCameroonPhone(identifier);
    if (!phone && !identifier.includes("@")) {
      console.warn(`[bootstrap] ADMIN_ACCOUNTS: "${identifier}" is not a phone number or email`);
      continue;
    }
    const where = phone ? { phone } : { email: identifier.toLowerCase() };
    const user = await db.user.findUnique({ where, select: { id: true, role: true } });
    if (!user) {
      console.warn(`[bootstrap] ADMIN_ACCOUNTS: no account for ${identifier} yet`);
    } else if (user.role !== "ADMIN") {
      await db.user.update({ where: { id: user.id }, data: { role: "ADMIN" } });
      console.log(`[bootstrap] ${identifier} is now an admin`);
    }
  }
}

async function main() {
  for (const step of [seedCurriculumIfEmpty, grantConfiguredAdmins]) {
    try {
      await step();
    } catch (error) {
      console.error(`[bootstrap] ${step.name} failed:`, error);
    }
  }
}

main().finally(() => db.$disconnect());
