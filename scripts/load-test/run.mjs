/**
 * Simulated students taking a test at the same time, through the real
 * pages and server actions of a running production build.
 *
 *   node scripts/load-test/run.mjs <data.json> <base url> <students> [think ms]
 *
 * Each student: opens GCEPrep237, starts the test, loads the paper, saves
 * an answer to every question (pausing `think` ms between answers),
 * submits, and opens the results. Prints latency percentiles per step.
 */
import { readFileSync } from "node:fs";

const [dataFile, base, studentsArg, thinkArg = "1000"] = process.argv.slice(2);
const data = JSON.parse(readFileSync(dataFile, "utf8"));
const students = Math.min(Number(studentsArg), data.tokens.length);
const think = Number(thinkArg);

// Server action ids from the build, looked up by function name.
const manifest = JSON.parse(readFileSync(".next/server/server-reference-manifest.json", "utf8"));
const actionId = (name) => {
  const entry = Object.entries(manifest.node).find(([, v]) => v.exportedName === name);
  if (!entry) throw new Error(`Action ${name} not found in build`);
  return entry[0];
};
const ACTIONS = {
  startTest: actionId("startTest"),
  saveAnswer: actionId("saveAnswerAction"),
  submitTest: actionId("submitTest"),
};

const samples = {}; // step -> [ms]
const failures = {}; // step -> count
const errorsSeen = new Map();

function record(step, ms, ok, detail) {
  (samples[step] ??= []).push(ms);
  if (!ok) {
    failures[step] = (failures[step] ?? 0) + 1;
    const key = `${step}: ${detail}`;
    errorsSeen.set(key, (errorsSeen.get(key) ?? 0) + 1);
  }
}

async function timed(step, fn) {
  const start = performance.now();
  try {
    const res = await fn();
    const ok = res.status < 400;
    // Drain the body so the timing includes the full response.
    const body = await res.text();
    record(
      step,
      performance.now() - start,
      ok && !/Internal Server Error|digest/.test(body.slice(0, 2000)),
      `HTTP ${res.status}`,
    );
    return body;
  } catch (err) {
    record(step, performance.now() - start, false, err.cause?.code ?? err.message);
    return null;
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const jitter = (ms) => ms * (0.5 + Math.random());

function page(token, path) {
  return fetch(base + path, { headers: { cookie: `session=${token}` }, redirect: "manual" });
}

function action(token, path, id, args) {
  return fetch(base + path, {
    method: "POST",
    redirect: "manual",
    headers: {
      cookie: `session=${token}`,
      "Next-Action": id,
      "Content-Type": "text/plain;charset=UTF-8",
      Accept: "text/x-component",
    },
    body: JSON.stringify(args),
  });
}

async function student(token) {
  const t = data.testId;
  // Spread arrivals over the first few seconds, as real students do not click at the same millisecond.
  await sleep(Math.random() * 3000);
  await timed("open GCEPrep237", () => page(token, "/gce"));
  await timed("start test", () => action(token, `/tests/${t}`, ACTIONS.startTest, [t]));
  await timed("load paper", () => page(token, `/tests/${t}/take`));
  const answers = {};
  for (const q of data.questions) {
    await sleep(jitter(think));
    const optionId = q.optionIds[Math.floor(Math.random() * q.optionIds.length)];
    answers[q.id] = optionId;
    await timed("save answer", () =>
      action(token, `/tests/${t}/take`, ACTIONS.saveAnswer, [t, q.id, optionId]),
    );
  }
  await timed("submit", () => action(token, `/tests/${t}/take`, ACTIONS.submitTest, [t, answers]));
  await timed("results", () => page(token, `/tests/${t}/results`));
}

const pct = (sorted, p) =>
  sorted[Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length))];

const started = performance.now();
await Promise.all(data.tokens.slice(0, students).map(student));
const seconds = (performance.now() - started) / 1000;

const total = Object.values(samples).reduce((n, s) => n + s.length, 0);
const failed = Object.values(failures).reduce((n, f) => n + f, 0);
const rows = Object.entries(samples).map(([step, list]) => {
  const s = [...list].sort((a, b) => a - b);
  return {
    step,
    n: s.length,
    p50: Math.round(pct(s, 50)),
    p95: Math.round(pct(s, 95)),
    p99: Math.round(pct(s, 99)),
    max: Math.round(s.at(-1)),
    failed: failures[step] ?? 0,
  };
});
console.log(
  JSON.stringify({
    students,
    thinkMs: think,
    seconds: Math.round(seconds),
    requests: total,
    failed,
    rps: Math.round(total / seconds),
    rows,
    errors: Object.fromEntries(errorsSeen),
  }),
);
