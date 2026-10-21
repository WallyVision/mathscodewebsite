/**
 * Gives an existing account admin access. Needed once, to create the first
 * admin; after that, admins can change roles from /admin/students.
 *
 *   npm run admin:grant -- 677123456
 *   npm run admin:grant -- someone@example.com
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { normalizeCameroonPhone } from "../src/lib/domain/phone";

const db = new PrismaClient();

async function main() {
  const identifier = process.argv[2];
  if (!identifier) {
    console.error("Usage: npm run admin:grant -- <phone number or email>");
    process.exitCode = 1;
    return;
  }
  const phone = identifier.includes("@") ? null : normalizeCameroonPhone(identifier);
  const where = phone ? { phone } : { email: identifier.toLowerCase() };
  const user = await db.user.findUnique({ where });
  if (!user) {
    console.error(`No account found for ${identifier}. Register on the site first.`);
    process.exitCode = 1;
    return;
  }
  await db.user.update({ where: { id: user.id }, data: { role: "ADMIN" } });
  console.log(`${user.name} is now an admin.`);
}

main().finally(() => db.$disconnect());
