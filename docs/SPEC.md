# Prep237: product specification

**Prep237**, "Revise. Compete. Win.", is an online revision and testing platform for **Cameroon GCE O Level and A Level** students.
Students revise with notes and past questions, sit timed weekly and monthly tests, see
where they rank, and compete for cash prizes paid by Mobile Money.

## Goals

1. **Revenue:** recurring subscriptions plus pay-per-solution sales.
2. **Engagement:** students come back every week (tests, leaderboard, streaks, prizes).
3. **Learning:** students see their weak topics and improve before the GCE.

## Launch scope

| Item          | Decision                                                |
| ------------- | ------------------------------------------------------- |
| Exam board    | Cameroon GCE Board (anglophone subsystem)               |
| Levels        | O Level and A Level                                     |
| Subjects      | Mathematics and Physics at both levels                  |
| Question type | Multiple choice (4 options, A–D), auto-marked           |
| Language      | English                                                 |
| Payments      | MTN Mobile Money and Orange Money through an aggregator |
| Content       | Written by the owner, plus paid teachers as needed      |

## Pricing

All prices in XAF (FCFA). Defined in `src/lib/domain/pricing.ts`.

| Product                          | Price | Status  |
| -------------------------------- | ----- | ------- |
| O Level subscription (30 days)   | 1,500 | Decided |
| A Level subscription (30 days)   | 2,000 | Decided |
| Single question solution         | 100   | Decided |
| All solutions for one past paper | 500   | Decided |

- A subscription covers **every subject at its level**.
- Renewing early **extends** the current period; paid days are never lost.

## What each kind of student can do

| Feature                             | Visitor | Free account | Subscriber |
| ----------------------------------- | :-----: | :----------: | :--------: |
| Landing page, pricing               |    ✓    |      ✓       |     ✓      |
| Revision notes                      |         |      ✓       |     ✓      |
| Past questions with correct answers |         |      ✓       |     ✓      |
| Worked solutions                    |         | pay per item |     ✓      |
| Weekly and monthly tests            |         |              |     ✓      |
| Leaderboard and prizes              |         |  view only   |     ✓      |

## Tests

- Each test belongs to one subject, has an **open window** (e.g. Saturday 08:00 to Sunday
  20:00, Douala time) and a **duration** (e.g. 45 minutes).
- A student has **one attempt**. Their deadline is `start + duration`, but never later than
  the window's close. Submissions get a 30-second grace for slow networks.
- Questions and options are **shuffled per student** with a stored seed, so a reload shows
  the same order but two students see different orders.
- One mark per correct answer; no negative marking.
- Answers are saved as the student goes, so a dropped connection does not lose work.
- Correct answers and solutions are shown only **after the window closes**, so they cannot
  be shared during the test.

## Ranking

Ordered by **score (high first)**, then **time taken (fast first)**, then **submission time
(early first)**. Students equal on all three share a rank. Implemented in
`src/lib/domain/ranking.ts`.

Monthly ranking per subject is the sum of a student's test scores that month.

## Prizes

Implemented in `src/lib/domain/prizes.ts`. All values below are decided.

- **Pool:** 15% of the month's subscription revenue for that level, with a minimum of
  10,000 FCFA so early months still have a meaningful prize.
- **Split per subject:** 1st 50%, 2nd 30%, 3rd 20%, rounded down to 500 FCFA.
- **Planned extra categories:** most improved, and most consistent (sat every test).
  These keep average students motivated, not only the top few.
- **Eligibility:** active subscription, sat every test in the month, account details match
  the Mobile Money name.
- **Verification before payout:** results are reviewed for integrity signals (focus loss,
  impossible speed, identical answer patterns). Winners may be asked to explain answers on
  a short call. Status moves `PENDING_VERIFICATION → VERIFIED → PAID` or `DISQUALIFIED`.
- Published terms and conditions must state that prizes are awarded on skill. Have a
  Cameroonian lawyer review them once before the first payout.

## Integrity measures

| Measure                               | Version 1 | Later |
| ------------------------------------- | :-------: | :---: |
| Single attempt, server-side timer     |     ✓     |       |
| Per-student question and option order |     ✓     |       |
| Answers hidden until window closes    |     ✓     |       |
| App-switch counter (reloads ignored)  |     ✓     |       |
| Winner verification before payout     |     ✓     |       |
| Large question bank, random selection |           |   ✓   |
| One active session per account        |           |   ✓   |

## Content and copyright

- Past paper questions belong to the GCE Board. Show them for revision and cite the year
  and paper; do not resell the papers themselves.
- **Worked solutions, notes and original test questions are our own work** and are the
  paid product.
- Notes and questions are Markdown with LaTeX (`$...$`, `$$...$$`), rendered with KaTeX.

## Roadmap

1. **Foundation (done):** data model, accounts, domain rules, landing page, dashboard.
2. **Content (done):** notes and past questions by subject and topic under `/learn`;
   answers free, solutions behind access checks; maths rendered with KaTeX. Questions in
   a test stay out of the practice bank until that test closes.
3. **Test engine (done):** `/tests` list, overview and rules, one timed attempt per
   student, per-student question and option order, autosave with a local backup and
   retry, automatic submission when time runs out, results with rank, leaderboard, and
   a full answer review with solutions once the test closes.
4. **Payments:** Mobile Money checkout through an aggregator (Campay or Notch Pay), signed
   webhooks, subscriptions and unlocks granted only on confirmed payment.
5. **Admin:** authoring for notes, questions and solutions; test scheduling; results
   review; prize verification and payout records.
6. **Growth:** SMS or WhatsApp reminders before tests, referral rewards, streaks,
   topic-level progress reports, schools plan.

## Open decisions

- Payment aggregator: compare Campay and Notch Pay on fees, payout API and support.
- Register the domain **gceprep237.com** (chosen; not yet registered).
