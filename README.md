# StudentLife237

**Equal opportunities to all.** A platform for Cameroonian students with two sections:

- **GCEPrep237** ("Prepare for the GCE smarter."): revision notes, past questions, worked
  solutions and weekly timed tests with prizes for GCE O Level and A Level.
- **Opportunities**: scholarships, jobs, travel, finance management and career orientation.

Names, slogans and the domain live in `src/lib/site.ts`.

Product rules, pricing and roadmap: **[docs/SPEC.md](docs/SPEC.md)**.
Putting the site online: **[docs/DEPLOY.md](docs/DEPLOY.md)**.
Capacity measurements: **[docs/LOAD_TEST.md](docs/LOAD_TEST.md)**.

## Tech stack

| Concern       | Choice                                                  |
| ------------- | ------------------------------------------------------- |
| Web framework | Next.js 15 (App Router, React Server Components)        |
| Language      | TypeScript (strict)                                     |
| Database      | PostgreSQL 16 with Prisma ORM and migrations            |
| Styling       | Tailwind CSS 4                                          |
| Validation    | Zod                                                     |
| Auth          | Phone or email + password; Argon2id hashes; DB sessions |
| Tests         | Vitest                                                  |
| CI            | GitHub Actions: format, lint, typecheck, test, build    |

## Getting started

Requirements: Node.js 20.18+ and PostgreSQL 16.

```bash
npm install
cp .env.example .env          # then set DATABASE_URL
npx prisma migrate dev        # create tables
npm run db:seed               # subjects, topics, sample questions and a test
npm run dev                   # http://localhost:3000
```

## Scripts

| Command                                       | What it does                                                 |
| --------------------------------------------- | ------------------------------------------------------------ |
| `npm run dev`                                 | Development server                                           |
| `npm run build`                               | Production build                                             |
| `npm test`                                    | Unit tests                                                   |
| `npm run lint`                                | ESLint                                                       |
| `npm run typecheck`                           | TypeScript check                                             |
| `npm run format`                              | Prettier                                                     |
| `npm run db:migrate`                          | Create and apply a migration after schema edits              |
| `npm run db:studio`                           | Browse the database in a GUI                                 |
| `npm run admin:grant -- <phone or email>`     | Make an existing account an admin                            |
| `npm run payments:smoke -- <mobile> [amount]` | Send one real CamPay payment request and wait for the result |

## Project layout

```
prisma/
  schema.prisma        Data model (users, content, tests, billing, prizes)
  migrations/          SQL migrations, committed
  seed.ts              Launch curriculum and sample content
src/
  app/                 Routes (pages, layouts, server actions)
    (auth)/            Login, registration, logout
    dashboard/         Student home: the two sections
    gce/               GCEPrep237 home (intro for visitors, revision home for students)
    learn/             Notes, topics, practice questions and past papers
    opportunities/     Scholarships, jobs, travel, finance and career posts (articles for subscribers)
  components/          Shared UI
  lib/
    auth/              Password hashing, sessions, input validation
    domain/            Business rules as pure, tested functions
    db.ts              Prisma client
    site.ts            Brand name and tagline
docs/SPEC.md           Product specification
docs/CONTENT_GUIDE.md  How to write notes, questions and solutions
```

### Design principles

- **Business rules live in `src/lib/domain`** as pure functions with unit tests (pricing,
  access to solutions, test timing, marking, ranking, prizes). Pages and actions call them;
  they never re-implement them.
- **The server is the source of truth** for time, scores and access. The browser is never
  trusted with correct answers before a test closes.
- **Money is whole XAF in integer columns.** No floating-point amounts.
- **Phone numbers are stored in E.164** (`+2376XXXXXXXX`).

## Admin area

Sign in and open **/admin** (an Admin link appears in the header for staff).

| Role   | Can use                                                                |
| ------ | ---------------------------------------------------------------------- |
| Author | Questions, notes, past papers, opportunities and guides                |
| Admin  | Everything above, plus tests, students, manual payments, roles, prizes |

The first admin: register on the site, then either set `ADMIN_ACCOUNTS=677123456` (phone
numbers or emails, comma-separated; applied each time the production server starts) or run:

```bash
npm run admin:grant -- 677123456
```

After that, admins manage people from **/admin/students** and subject teams from
**/admin/subjects** → a subject → Team. Adding someone to a team makes them an **Author** for
that subject: they can write and publish its notes, questions and papers (others' subjects
are hidden from them), Opportunities posts and images, but never see students, payments,
tests or prizes. Authors can import many questions at once from **/admin/questions/import**.

**Earnings** (`/admin/earnings`): authors see their live share of their subjects' income for
the month and their past payouts; the admin sees every subject's split and, after a month
ends, fixes the team payouts and marks each paid with its Mobile Money reference.

Diagrams and pictures are uploaded from any content form or **/admin/media** (Authors too).
They are stored in the database (300 KB each at most) and served from `/media/<id>` with a
year-long cache. Files are checked by their bytes; SVGs with scripts, links or embedded HTML
are refused, and images are served with a sandboxing Content-Security-Policy.

Subjects and topics are created at **/admin/subjects**; a new subject starts closed for
competition until it has content.

Payments received outside the site (cash, direct transfer) can be recorded on a student's
page, as a membership with its competition subject or an extra subject; it adds 30 days and
counts as that subject's income.

## Payments (CamPay)

Students pay by MTN or Orange Mobile Money through [CamPay](https://www.campay.net).
Set these environment variables (values exactly as shown in the CamPay app, with no
quotes or brackets):

| Variable              | Value                                         |
| --------------------- | --------------------------------------------- |
| `CAMPAY_ENVIRONMENT`  | `demo` (test money, default) or `live`        |
| `CAMPAY_APP_USERNAME` | App username from the CamPay application page |
| `CAMPAY_APP_PASSWORD` | App password from the CamPay application page |
| `CAMPAY_WEBHOOK_KEY`  | Webhook key from the CamPay application page  |

In the CamPay application settings, set the webhook URL to
`https://<your domain>/api/payments/campay`. Without it, payments still complete while the
student keeps the waiting page open, but the webhook covers students who close it.

To check credentials and the phone flow (for example before switching to `live`), run
`npm run payments:smoke -- 676999221 25` and confirm the prompt on that phone.

How a payment is trusted: the site never grants access from the browser or from the
notification alone. It asks CamPay for the transaction, checks the amount and currency
match the server's price, then grants access once (repeat checks are harmless).

## Security notes

- Passwords: Argon2id (19 MiB, 2 passes, 1 lane; OWASP's first recommendation) with a
  per-user salt. Older scrypt hashes still verify and are upgraded at the next login.
- Sessions: random 256-bit token in an `HttpOnly`, `SameSite=Lax` cookie (`Secure` in
  production); only its SHA-256 hash is stored.
- Login does the same work for unknown accounts, so response time does not reveal which
  phone numbers are registered.
- Security headers are set in `next.config.ts`.
- CamPay notifications must carry a valid HS256 signature made with the webhook key.
- Repeated attempts are limited per IP, account, phone number or user (login, sign-up,
  payment prompts, password changes) with database counters, so limits hold across servers.
- Password reset links are created by an admin, work once, expire after 24 hours and end
  every session for the account. Changing a password also signs out other devices.
- In production the server refuses to start if required settings are missing or malformed.
