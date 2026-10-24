/**
 * Deterministic PRNG (mulberry32). Each attempt stores a seed so a student
 * sees the same order on reload, while different students see different orders.
 */
export function createRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher–Yates shuffle returning a new array. */
export function seededShuffle<T>(items: readonly T[], seed: number): T[] {
  const out = [...items];
  const rng = createRng(seed);
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j] as T, out[i] as T];
  }
  return out;
}

/** Derive an independent seed for a sub-sequence, e.g. one question's options. */
export function deriveSeed(seed: number, salt: string): number {
  let h = seed ^ 0x9e3779b9;
  for (let i = 0; i < salt.length; i++) {
    h = Math.imul(h ^ salt.charCodeAt(i), 0x01000193);
  }
  return h >>> 0;
}
