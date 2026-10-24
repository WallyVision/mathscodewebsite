import { randomBytes, scrypt, timingSafeEqual, type ScryptOptions } from "node:crypto";
import { hash, verify } from "@node-rs/argon2";

/**
 * Argon2id with OWASP's first recommended settings (19 MiB memory, 2 passes,
 * 1 lane). Strong against guessing, yet light enough for a small server to
 * handle a whole class logging in at once (~70 logins/s on one core).
 */
const ARGON2 = {
  // 2 = Argon2id (the library exports it as a const enum, which isolated modules cannot import).
  algorithm: 2,
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
} as const;
const ARGON2_PREFIX = `$argon2id$v=19$m=${ARGON2.memoryCost},t=${ARGON2.timeCost},p=${ARGON2.parallelism}$`;

export function hashPassword(password: string): Promise<string> {
  return hash(password.normalize("NFKC"), ARGON2);
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  if (stored.startsWith("$argon2")) {
    try {
      return await verify(stored, password.normalize("NFKC"));
    } catch {
      return false;
    }
  }
  if (stored.startsWith("scrypt$")) return verifyLegacyScrypt(password, stored);
  return false;
}

/** True when a stored hash uses older settings and should be replaced after a successful login. */
export function needsRehash(stored: string): boolean {
  return !stored.startsWith(ARGON2_PREFIX);
}

// ─── Legacy scrypt hashes (scrypt$N$r$p$salt$key), from before the switch to Argon2id ───

const SCRYPT_MAX_MEM = 256 * 1024 * 1024;

function deriveScrypt(password: string, salt: Buffer, opts: ScryptOptions): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password.normalize("NFKC"), salt, 32, { ...opts, maxmem: SCRYPT_MAX_MEM }, (err, key) =>
      err ? reject(err) : resolve(key),
    );
  });
}

async function verifyLegacyScrypt(password: string, stored: string): Promise<boolean> {
  const [, n, r, p, salt, key] = stored.split("$");
  if (!n || !r || !p || !salt || !key) return false;
  const expected = Buffer.from(key, "base64");
  const actual = await deriveScrypt(password, Buffer.from(salt, "base64"), {
    N: Number(n),
    r: Number(r),
    p: Number(p),
  });
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

/** Creates a legacy scrypt hash. Only used by tests of the upgrade path. */
export async function legacyScryptHashForTests(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await deriveScrypt(password, salt, { N: 2 ** 14, r: 8, p: 1 });
  return ["scrypt", 2 ** 14, 8, 1, salt.toString("base64"), key.toString("base64")].join("$");
}
