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

| Product                                                | O Level | A Level |
| ------------------------------------------------------ | ------- | ------- |
| Membership, 30 days (includes one competition subject) | 1,500   | 2,000   |
| Each extra competition subject, 30 days                | 1,000   | 1,500   |
| Single question solution                               | 100     | 100     |
| All solutions for one past paper                       | 500     | 500     |

- **Membership** opens everything at its level: notes, past questions, worked solutions and
  Opportunities. The student chooses **one competition subject** at checkout.
- **Competitive tests and prizes are per subject.** A student sits a subject's tests only while
  entered in it (`CompetitionEntry`). Members add subjects for the extra price.
- Renewing early **extends** the current period; paid days are never lost. An extra subject
  runs 30 days from its own payment.

## Subject income and how it is shared

Every entry's fee is **income of its subject** (a membership counts entirely for its chosen
subject). Each month, per subject (`src/lib/domain/revenue.ts`):

1. Payment fees are taken off online payments (estimate set in `DEFAULT_REVENUE_POLICY`).
2. The rest is split **40% platform, 40% subject team, 20% subject prize pool**.
3. The prize pool is at least 10,000 FCFA in any month with entrants; the platform tops it up.
4. The team share is divided between the subject's team members by weight (1 and 1 is half
   each). Authors see their live estimate in **Earnings**; after the month ends the admin
   fixes the payouts (`TeamPayout`) and pays them by the 15th.
5. A subject with no team keeps its team share with the platform. Staff and a subject's own
   team cannot appear in that subject's prize standings.

## What each kind of student can do

| Feature                             | Visitor | Free account |    Subscriber    |
| ----------------------------------- | :-----: | :----------: | :--------------: |
| Landing page, pricing               |    ✓    |      ✓       |        ✓         |
| Revision notes                      |         |      ✓       |        ✓         |
| Past questions with correct answers |         |      ✓       |        ✓         |
| Worked solutions                    |         | pay per item |        ✓         |
| Weekly and monthly tests            |         |              | entered subjects |
| Leaderboard and prizes              |         |  view only   | entered subjects |

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

Monthly ranking per subject is the sum of a student's best 2 test scores that month.

## Prizes

Implemented in `src/lib/domain/prizes.ts`. All values below are decided.

- **Pool:** 20% of the subject's income for the month after payment fees, at least
  10,000 FCFA in any month with entrants, so early months still have a meaningful prize.
- **Split per subject:** 1st 50%, 2nd 30%, 3rd 20%, rounded down to 500 FCFA.
- **Month:** calendar month in Cameroon time; a test counts in the month it closes.
  Awards are created from `/admin/prizes` only after the month ends.
- **Planned extra categories:** most improved, and most consistent (sat every test of the
  month).
  These keep average students motivated, not only the top few.
- **Best 2 tests count:** a student's monthly total is the sum of their best 2 tests in the
  subject (all tests if the month had fewer). Memberships run 30 days from payment, so a
  student who joins mid-month or misses a week can still win.
- **Eligibility:** entered in the subject, sat at least 2 of its tests in the month, account
  details match the Mobile Money name.
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
| Large question bank, random selection |     ✓     |       |
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
7. **Policies (done):** `/terms` (including the prize rules), `/privacy`, `/refunds` and
   `/contact`, linked in the footer and on sign-up. Prices and prize rules in the text come
   from the same constants the site uses. Set the registered business name and RCCM in
   `site.operator` once the business is registered.
8. **Competition subjects (done):** `/admin/subjects` to create subjects and topics and open
   or close them for competition; membership includes a chosen subject; extra subjects;
   tests and prize pools per subject; cash payments recorded with their subject.
9. **Subject teams and earnings (done):** authors assigned to subjects edit only those
   subjects; live "My earnings" page; monthly team payouts with paid status and reference.
10. **Random test drawing (done):** a test can draw N questions at random from the subject's
    test bank at the moment it opens (cryptographic randomness, once, safe under concurrent
    starts), preferring questions never used before. Test-bank questions stay out of practice
    until a test using them has closed; which questions a test used is shown to admins only.
11. **Ask a question and Tools (done):** members send a question (text and/or a photo, shrunk
    in the browser to under 300 KB) to a subject; the subject's team and the admin answer in
    **Admin → Student questions** (count shown in the menu) and the student reads the reply on
    `/ask`. Five questions a day per member. `/tools` lists calculator links the admin manages
    in **Admin → Tools** (https only, optional subject, order, shown or hidden).
12. **Growth:** SMS or WhatsApp reminders before tests, referral rewards, streaks,
    topic-level progress reports, schools plan.

## Open decisions

- Payment aggregator: compare Campay and Notch Pay on fees, payout API and support.
- Register the domain **studentlife237.com** (chosen; not yet registered).
