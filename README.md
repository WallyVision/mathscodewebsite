# Prep237

Revision notes, past questions, worked solutions and weekly timed tests with prizes for
Cameroon GCE O Level and A Level students.

Product rules, pricing and roadmap: **[docs/SPEC.md](docs/SPEC.md)**.

## Tech stack

| Concern       | Choice                                                |
| ------------- | ----------------------------------------------------- |
| Web framework | Next.js 15 (App Router, React Server Components)      |
| Language      | TypeScript (strict)                                   |
| Database      | PostgreSQL 16 with Prisma ORM and migrations          |
| Styling       | Tailwind CSS 4                                        |
| Validation    | Zod                                                   |
| Auth          | Phone or email + password; scrypt hashes; DB sessions |
| Tests         | Vitest                                                |
| CI            | GitHub Actions: format, lint, typecheck, test, build  |

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

| Command              | What it does                                    |
| -------------------- | ----------------------------------------------- |
| `npm run dev`        | Development server                              |
| `npm run build`      | Production build                                |
| `npm test`           | Unit tests                                      |
| `npm run lint`       | ESLint                                          |
| `npm run typecheck`  | TypeScript check                                |
| `npm run format`     | Prettier                                        |
| `npm run db:migrate` | Create and apply a migration after schema edits |
| `npm run db:studio`  | Browse the database in a GUI                    |

## Project layout

```
prisma/
  schema.prisma        Data model (users, content, tests, billing, prizes)
  migrations/          SQL migrations, committed
  seed.ts              Launch curriculum and sample content
src/
  app/                 Routes (pages, layouts, server actions)
    (auth)/            Login, registration, logout
    dashboard/         Student home
    learn/             Notes, topics, practice questions and past papers
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

## Security notes

- Passwords: scrypt (N=2¹⁷, r=8, p=1) with a per-user salt.
- Sessions: random 256-bit token in an `HttpOnly`, `SameSite=Lax` cookie (`Secure` in
  production); only its SHA-256 hash is stored.
- Login does the same work for unknown accounts, so response time does not reveal which
  phone numbers are registered.
- Security headers are set in `next.config.ts`.
- **To do before launch:** login rate limiting, password reset by SMS or email, payment
  webhook signature verification.
