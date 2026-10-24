# Load test

How many students can take a test at the same time, measured on a production build.

## Set-up (24 Oct 2026)

- Website: `next start`, limited to **1 CPU core and 512 MB** (`taskset -c 0`,
  `--max-old-space-size=512`), roughly a small hosting plan.
- Database: PostgreSQL 16 on its own core. Simulated students on the other two cores.
- Each simulated student, through the real pages and server actions: opens GCEPrep237,
  starts a 20-question test, loads the paper, saves an answer to every question,
  submits, opens the results. Students arrive within 3 seconds of each other and save
  an answer about **every second**, 30–60 times faster than real students.

## Results after the fixes below

| Students at once | Requests/s | Start test p95 | Load paper p95 | Save answer p95 | Submit p95 | Failures | Peak memory |
| ---------------- | ---------- | -------------- | -------------- | --------------- | ---------- | -------- | ----------- |
| 50               | 47         | 0.35 s         | 2.6 s          | 0.06 s          | 0.10 s     | 0        | 308 MB      |
| 100              | 82         | 0.70 s         | 4.1 s          | 0.20 s          | 0.35 s     | 0        | 330 MB      |
| 200              | 121        | 0.85 s         | 5.8 s          | 0.69 s          | 0.99 s     | 0        | 379 MB      |
| 400              | 109        | 12.7 s         | 9.7 s          | 2.3 s           | 2.6 s      | 0        | 426 MB      |
| 800              | 107        | 42 s           | 15 s           | 3.5 s           | 3.1 s      | 0        | 467 MB      |

Logins (password checks): 20 students pressing Log in at the same moment all got in within
**1.7 s** on the same 1-core server; about 70 password checks per second per core.

p95 = 95% of requests were at least this fast.

## What it means

One core sustains about **100–120 requests per second**. A real student saves an answer
every 30–60 seconds, so one core can serve roughly **3,000 students answering at the same
time**. Cloud cores are often slower than this machine, so plan on about **1,500 per core**.

The heaviest moment is many students **starting** within the same few seconds (loading the
paper). Opening tests over a long window (e.g. Saturday 08:00 to Sunday 20:00) spreads this
out. Beyond these numbers, add CPU or run more than one copy of the site: sessions, attempt
limits and answers all live in the database, so copies share the load.

## Fixes made because of this test

| Problem found                                             | Fix                                                            |
| --------------------------------------------------------- | -------------------------------------------------------------- |
| Starting a test took 12 s (p95) with 50 students          | Maths is rendered once and cached instead of per student       |
| Start and submit rendered the next page inside the action | The browser navigates itself after the action returns          |
| 28 submissions failed at 800 students (DB queue, 2 s)     | Marking waits up to 15 s for a connection; writes only changes |
| A failed submission showed an error                       | The phone retries a submission 3 times before showing an error |
| Logins: 2.4/s per core and 611 MB peak (scrypt)           | Argon2id (OWASP's first choice): ~70/s per core, 166 MB peak   |

## Run it yourself

Against a test copy of the site and database, never production:

```bash
npm run build && npm start                                    # in one terminal
npx tsx scripts/load-test/setup.ts 200 /tmp/load.json        # 200 students and a test
node scripts/load-test/run.mjs /tmp/load.json http://localhost:3000 200 1000
npx tsx scripts/load-test/setup.ts --cleanup                 # remove the test data
```

`run.mjs` prints requests per second and p50/p95/p99 latency for each step.
