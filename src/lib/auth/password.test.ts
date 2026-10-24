import { describe, expect, it } from "vitest";
import { hashPassword, legacyScryptHashForTests, needsRehash, verifyPassword } from "./password";

describe("password hashing", () => {
  it("uses Argon2id and verifies the right password only", async () => {
    const hash = await hashPassword("correct horse");
    expect(hash.startsWith("$argon2id$")).toBe(true);
    expect(await verifyPassword("correct horse", hash)).toBe(true);
    expect(await verifyPassword("wrong horse", hash)).toBe(false);
    expect(needsRehash(hash)).toBe(false);
  });

  it("salts each hash", async () => {
    expect(await hashPassword("same")).not.toBe(await hashPassword("same"));
  });

  it("still accepts old scrypt hashes and marks them for upgrade", async () => {
    const legacy = await legacyScryptHashForTests("old password");
    expect(await verifyPassword("old password", legacy)).toBe(true);
    expect(await verifyPassword("other", legacy)).toBe(false);
    expect(needsRehash(legacy)).toBe(true);
  });

  it("rejects malformed stored hashes", async () => {
    expect(await verifyPassword("x", "not-a-hash")).toBe(false);
    expect(await verifyPassword("x", "$argon2id$garbage")).toBe(false);
    expect(await verifyPassword("x", "scrypt$1$2")).toBe(false);
  });
});
