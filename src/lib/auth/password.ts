import { randomBytes, scrypt, timingSafeEqual, type ScryptOptions } from "node:crypto";

// OWASP-recommended scrypt parameters (N=2^17, r=8, p=1).
const PARAMS = { N: 2 ** 17, r: 8, p: 1 } as const;
const KEY_LENGTH = 32;
const MAX_MEM = 256 * 1024 * 1024;

function deriveKey(password: string, salt: Buffer, opts: ScryptOptions): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(
      password.normalize("NFKC"),
      salt,
      KEY_LENGTH,
      { ...opts, maxmem: MAX_MEM },
      (err, key) => (err ? reject(err) : resolve(key)),
    );
  });
}

/** Returns a self-describing hash: scrypt$N$r$p$salt$key (base64). */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await deriveKey(password, salt, PARAMS);
  return [
    "scrypt",
    PARAMS.N,
    PARAMS.r,
    PARAMS.p,
    salt.toString("base64"),
    key.toString("base64"),
  ].join("$");
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, n, r, p, salt, key] = stored.split("$");
  if (scheme !== "scrypt" || !n || !r || !p || !salt || !key) return false;
  const expected = Buffer.from(key, "base64");
  const actual = await deriveKey(password, Buffer.from(salt, "base64"), {
    N: Number(n),
    r: Number(r),
    p: Number(p),
  });
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
