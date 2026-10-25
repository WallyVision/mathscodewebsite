/**
 * Text of the terms, privacy and refund pages. Prices and prize rules come
 * from the same constants the site uses, so the pages cannot drift from what
 * the code does. Have a Cameroonian lawyer review these before the first
 * prize payout (see docs/SPEC.md).
 */
import { DEFAULT_PRIZE_POLICY } from "@/lib/domain/prizes";
import {
  formatXaf,
  SUBSCRIPTION_DAYS,
  SUBSCRIPTION_PRICE,
  UNLOCK_PRICE,
} from "@/lib/domain/pricing";
import { site } from "@/lib/site";

export const LEGAL_UPDATED = "25 October 2026";

/** Days after a payment within which a refund can be requested. */
export const REFUND_REQUEST_DAYS = 7;
/** Days after verification within which prizes are paid. */
export const PRIZE_PAYOUT_DAYS = 14;

const percent = (share: number) => `${Math.round(share * 100)}%`;

function operatorLine(): string {
  const { name, rccm, city } = site.operator;
  return rccm ? `${name} (RCCM ${rccm}), ${city}` : `${name}, ${city}`;
}

export function termsMarkdown(): string {
  const p = DEFAULT_PRIZE_POLICY;
  const places = ["1st", "2nd", "3rd"];
  const split = p.placeShares.map((s, i) => `${places[i] ?? `${i + 1}th`} ${percent(s)}`);
  return `
These terms apply to everyone who uses ${site.name} (the "site"), including its
${site.gcePrep.name} and Opportunities sections. The site is run by ${operatorLine()}
("we", "us"). By creating an account or paying for anything on the site, you accept these
terms, the [Privacy Policy](/privacy) and the [Refund Policy](/refunds).

## 1. Accounts

- One account per person. Give your real name and a phone number you own.
- Keep your password secret. You are responsible for what is done with your account.
- If you are under 18, a parent or guardian must agree to these terms for you and approve
  any payment.
- ${site.gcePrep.name} is not affiliated with the Cameroon GCE Board.

## 2. Subscriptions

| Plan | Price | Length |
| --- | --- | --- |
| O Level | ${formatXaf(SUBSCRIPTION_PRICE.O_LEVEL)} | ${SUBSCRIPTION_DAYS} days |
| A Level | ${formatXaf(SUBSCRIPTION_PRICE.A_LEVEL)} | ${SUBSCRIPTION_DAYS} days |

- A subscription covers every subject at its level: tests, worked solutions, leaderboards,
  prizes and the full Opportunities articles.
- It starts when your payment is confirmed. Paying again before it ends adds
  ${SUBSCRIPTION_DAYS} days after the current end date, so no paid days are lost.
- Subscriptions **do not renew automatically**. Nothing is taken from your Mobile Money
  account unless you confirm a payment with your PIN.
- We may change prices. A change never affects a period you have already paid for.

## 3. Single solutions

Without a subscription you can unlock one worked solution for
${formatXaf(UNLOCK_PRICE.questionSolution)}, or every solution of a past paper for
${formatXaf(UNLOCK_PRICE.paperSolutions)}. Unlocked solutions stay available on your account.

## 4. Payments

Payments are made by MTN Mobile Money or Orange Money through our payment partner CamPay.
We never see or ask for your Mobile Money PIN. Access is granted only after the payment is
confirmed by CamPay for the right amount.

## 5. Tests

- Each test has an opening window and a time limit. You have **one attempt**.
- The timer runs on our server. Your time keeps running if you close the page or lose your
  connection; answers are saved as you go and submitted automatically when time runs out.
- Correct answers and solutions are shown after the test closes.
- You are responsible for your phone or computer, your connection and your data bundle.
  If a fault **on our side** stops a test for many students, we may cancel the test or
  give everyone affected a new attempt.

## 6. Monthly prizes

Prizes reward skill. There is no chance involved and no extra payment to take part.

- **Pool:** ${percent(p.poolShare)} of the month's subscription income for each level, shared
  equally between that level's subjects. Each subject's pool is at least
  ${formatXaf(p.minimumPool)}.
- **Places:** ${split.join(", ")} of the subject's pool, rounded down to the nearest
  ${formatXaf(p.roundTo)}.
- **Month:** a calendar month in Cameroon time. A test counts in the month it closes.
- **Ranking:** total score across the month's tests in that subject, then the shortest total
  time, then the earliest final submission. Students still equal share the prizes for the
  places they occupy equally.
- **Who can win:** subscribers with an active subscription during the month who sat
  **every** test of that subject in the month. Our staff, content writers and members of
  their households cannot win.
- **Checks before payment:** we review winning attempts. Winners may be asked to show ID and
  to explain some answers on a short call. The name on the account must match the name on
  the Mobile Money account that receives the prize.
- **Payment:** by Mobile Money within ${PRIZE_PAYOUT_DAYS} days after the checks are
  complete. If we cannot reach a winner within 30 days, the prize passes to the next
  eligible student.
- We may withhold a prize and close the account of anyone who cheats (see section 7). Our
  decision after review is final, subject to section 12.

## 7. Fair use

You must not:

- share your account, use more than one account, or let someone else sit a test for you;
- get help from another person, or share questions or answers, while a test is open;
- copy, sell or republish our notes, questions or solutions;
- try to break, overload or get around the security of the site.

We may suspend or close accounts that break these rules. A suspension for cheating does not
give a right to a refund.

## 8. Content

Notes, original questions and worked solutions are our work and are protected by copyright.
You may use them for your own study only. Past GCE questions belong to the Cameroon GCE
Board and are shown, with their year and paper, for revision.

We check our content carefully, but mistakes can happen. Tell us about any error and we will
correct it. If an error affects a test, we treat every student who sat it the same way.

## 9. Opportunities

Scholarship, job, travel, finance and career posts are information only. Always confirm
details, deadlines and requirements on the official website before applying. We do not
guarantee any result and are not responsible for other organisations' websites.
**We never ask for money to get you a scholarship, job or visa.** Report anyone who claims
to act for us and asks for money.

## 10. Availability and responsibility

We work to keep the site available and correct, but we cannot promise it will never be
interrupted. As far as the law allows, we are not responsible for indirect losses, and our
total responsibility to you is limited to the amount you paid us in the three months
before the problem. Nothing in these terms limits rights you have under Cameroonian law.

## 11. Changes

We may update these terms, for example when we add features. The date at the top shows the
latest version. Important changes will be announced on the site before they apply.

## 12. Law and disputes

These terms are governed by the laws of the Republic of Cameroon. Please contact us first
so we can try to settle any problem quickly and amicably. If that fails, the competent
courts of Cameroon will decide.

## 13. Contact

See the [Contact page](/contact).
`;
}

export function privacyMarkdown(): string {
  return `
This policy explains what personal information ${site.name} collects, why, and the choices
you have. The site is run by ${operatorLine()}.

## What we collect

| Information | Why |
| --- | --- |
| Name, phone number, email (optional), level | To create your account, show the right content and contact you |
| Password | Stored only as a secure one-way hash; we cannot read it |
| Test answers, scores, times taken, and how often you left the test page | To mark tests, rank students and check prize results are fair |
| Payments: Mobile Money number, amount, status, CamPay reference | To confirm payments, give access and keep accounting records |
| Prize winners: ID details and Mobile Money name | To verify winners and pay prizes |
| Messages you send us | To answer you |

We do **not** receive your Mobile Money PIN.

## Cookies and storage on your device

- One cookie keeps you logged in. It is necessary for the site to work. We use no
  advertising or tracking cookies.
- During a test, your answers are also kept in your browser's storage so they are not lost
  if your connection drops.

We count repeated attempts (for example failed logins) per internet address and account for
a short time, to protect accounts from attacks.

## What others see

Leaderboards show your first name and the first letter of your last name, with your score.
Your phone number and email are never shown to other students.

## Who we share it with

- **CamPay** and the Mobile Money operators (MTN, Orange), to process payments.
- **Our hosting provider**, which stores the site and its database. Its servers may be
  outside Cameroon.
- **Authorities**, only when the law requires it.

We do not sell your information, and we do not share it for advertising.

## How long we keep it

We keep your account information while your account is open. If you ask us to delete your
account, we delete or anonymise your information, except payment and prize records that we
must keep for accounting and legal reasons.

## Your rights

You can ask to see the information we hold about you, to correct it, or to delete your
account. Contact us from the phone number on your account (see the [Contact page](/contact))
so we can confirm it is you. You can also complain to the competent authority in Cameroon.

## Children

Many of our students are under 18. A parent or guardian must agree to the
[Terms and Conditions](/terms) for them. We collect only what is needed to run the service.

## Security

Passwords are hashed, connections are encrypted (HTTPS), and access to personal information
is limited to staff who need it. No system is perfectly secure; tell us at once if you think
your account has been misused.

## Changes

If we change this policy, we update the date at the top and announce important changes on
the site.
`;
}

export function refundsMarkdown(): string {
  return `
Everything on ${site.name} is digital and available as soon as your payment is confirmed.
This policy explains when we give money back.

## We refund or fix it when

- **You paid but did not get access**, and we cannot give it to you: we give the access or
  refund the full amount.
- **You were charged twice** for the same thing: we refund the extra payment.
- **A fault on our side** stopped you from using a paid period or sitting a test: we add
  days to your subscription or refund the affected part, whichever you prefer.

## We do not refund

- a subscription you no longer want after access was given, or the unused days of a period;
- solutions you have unlocked;
- accounts suspended for breaking the [Terms and Conditions](/terms), for example for
  cheating;
- problems with your own phone, connection or data bundle.

A Mobile Money payment that failed or that you cancelled is not taken from your account, so
there is nothing to refund.

## How to ask

1. Message us within **${REFUND_REQUEST_DAYS} days** of the payment (see the
   [Contact page](/contact)), from the phone number on your account.
2. Give the date, the amount, the Mobile Money number used and, if you have it, the
   transaction reference from your Mobile Money SMS.
3. We reply within 3 working days. Approved refunds are sent to the same Mobile Money number
   within 7 working days.

This policy does not limit any rights you have under Cameroonian law.
`;
}
