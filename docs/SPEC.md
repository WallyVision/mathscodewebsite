# StudentLife237: product specification

**StudentLife237**, "Equal opportunities to all", has two sections: **GCEPrep237** ("Prepare
for the GCE smarter."), the GCE revision and testing product described below, and
**Opportunities** (scholarships, jobs, travel, finance, careers). The home page and the
student dashboard show both as big tiles; the header links GCE Prep, Opportunities and
Account, and every GCEPrep237 page has a Home · Revise · Tests bar.

GCEPrep237 is an online revision and testing platform for **Cameroon GCE O Level and A Level** students.
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

- **Pool:** 15% of the month's subscription revenue for that level, shared equally between
  the level's subjects. Each subject's pool is at least 10,000 FCFA, so early months still
  have a meaningful prize (with 4 subjects, at least 40,000 FCFA a month in total).
- **Split per subject:** 1st 50%, 2nd 30%, 3rd 20%, rounded down to 500 FCFA.
- **Month:** calendar month in Cameroon time; a test counts in the month it closes.
  Awards are created from `/admin/prizes` only after the month ends.
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
4. **Payments (done, tested on CamPay demo):** `/checkout` for subscriptions, single
   solutions and whole papers; MTN/Orange prompt via CamPay; waiting page that confirms by
   itself. Access is granted only after the site re-checks the payment with CamPay and the
   amount matches, exactly once per payment. Signed CamPay notifications at
   `/api/payments/campay` trigger the same check.
5. **Admin (done):** `/admin` for authors (questions, notes, past papers, with student
   previews) and admins (test scheduling with a question picker, attempts review and
   disqualification, students with manual payment recording and roles, monthly prize
   standings, awards and payout tracking).
6. **Opportunities (done):** `/opportunities` with five sections (scholarships, jobs,
   travel, finance management, career orientation), buttons on the home page and dashboard.
   Everyone sees the buttons and each section's titles, summaries and deadlines; the full
   article and the apply link are for **subscribers** (either level) and staff, and are not
   sent to anyone else. Visitors are asked to sign up or log in and return to the same post.
   WhatsApp sharing for everyone, anti-scam notice. Authors publish from `/admin/posts`.
7. **Growth:** SMS or WhatsApp reminders before tests, referral rewards, streaks,
   topic-level progress reports, schools plan.

## Open decisions

- Payment aggregator: compare Campay and Notch Pay on fees, payout API and support.
- Register the domain **studentlife237.com** (chosen; not yet registered).
