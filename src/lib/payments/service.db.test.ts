/**
 * Payment flow against a real database (DATABASE_URL), with a fake CamPay so
 * no network calls are made.
 */
import { createHmac, randomUUID } from "node:crypto";
import { NextRequest } from "next/server";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { GET as webhook } from "@/app/api/payments/campay/route";
import type { CurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { setPaymentProvider, type CollectParams, type PaymentProvider } from "./campay";
import { refreshPayment, startCheckout } from "./service";

const run = randomUUID().slice(0, 8);
const WEBHOOK_KEY = "test-webhook-key";

class FakeCampay implements PaymentProvider {
  readonly name = "campay";
  collected: CollectParams[] = [];
  transactions = new Map<string, { status: string; amount: unknown; currency: string }>();
  failCollect: string | null = null;

  async collect(params: CollectParams) {
    if (this.failCollect) return { ok: false as const, message: this.failCollect };
    this.collected.push(params);
    const reference = `ref-${run}-${this.collected.length}`;
    this.transactions.set(reference, { status: "PENDING", amount: params.amount, currency: "XAF" });
    return { ok: true as const, reference, ussdCode: "*126#", operator: "MTN" };
  }

  async getTransaction(reference: string) {
    const t = this.transactions.get(reference);
    return t ? { reference, ...t, operator: "MTN", operatorReference: "op-1" } : null;
  }

  settle(reference: string, status: string, amount?: unknown) {
    const t = this.transactions.get(reference)!;
    this.transactions.set(reference, { ...t, status, amount: amount ?? t.amount });
  }
}

let fake: FakeCampay;
let user: CurrentUser;
let subjectId: string;
let otherSubjectId: string;
let questionId: string;
let previousKey: string | undefined;

function sign(payload: object) {
  const h = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const p = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${h}.${p}.${createHmac("sha256", WEBHOOK_KEY).update(`${h}.${p}`).digest("base64url")}`;
}

async function checkout(product: Parameters<typeof startCheckout>[1]) {
  const result = await startCheckout(user, product, "+237677000111");
  if (!result.ok) throw new Error(`checkout failed: ${result.reason}`);
  return db.payment.findUniqueOrThrow({ where: { id: result.paymentId } });
}

beforeAll(async () => {
  previousKey = process.env.CAMPAY_WEBHOOK_KEY;
  process.env.CAMPAY_WEBHOOK_KEY = WEBHOOK_KEY;
  const created = await db.user.create({
    data: {
      name: "Paying Student",
      email: `pay-${run}@example.test`,
      passwordHash: "x",
      level: "O_LEVEL",
    },
    select: { id: true, name: true, role: true, level: true, email: true, phone: true },
  });
  user = created;
  const subject = await db.subject.create({
    data: { level: "O_LEVEL", slug: `pay-${run}`, name: `Pay ${run}` },
  });
  subjectId = subject.id;
  const other = await db.subject.create({
    data: { level: "O_LEVEL", slug: `pay-other-${run}`, name: `Other ${run}` },
  });
  otherSubjectId = other.id;
  const q = await db.question.create({
    data: { subjectId, stem: "Paid question", solution: "Worked solution", status: "PUBLISHED" },
  });
  questionId = q.id;
});

beforeEach(() => {
  fake = new FakeCampay();
  setPaymentProvider(fake);
});

afterEach(async () => {
  await db.competitionEntry.deleteMany({ where: { userId: user.id } });
  await db.subscription.deleteMany({ where: { userId: user.id } });
  await db.solutionUnlock.deleteMany({ where: { userId: user.id } });
  await db.payment.deleteMany({ where: { userId: user.id } });
});

afterAll(async () => {
  setPaymentProvider(null);
  process.env.CAMPAY_WEBHOOK_KEY = previousKey;
  await db.subject.deleteMany({ where: { id: { in: [subjectId, otherSubjectId] } } });
  await db.user.delete({ where: { id: user.id } });
  await db.$disconnect();
});

describe("subscription checkout", () => {
  it("asks CamPay for the server's price and records a pending payment", async () => {
    const payment = await checkout({ kind: "SUBSCRIPTION", level: "O_LEVEL", subjectId });
    expect(fake.collected[0]).toMatchObject({
      amount: 1500,
      from: "237677000111",
      externalReference: payment.id,
    });
    expect(payment).toMatchObject({
      status: "PENDING",
      amount: 1500,
      providerReference: `ref-${run}-1`,
    });
    expect(payment.metadata).toMatchObject({ level: "O_LEVEL", ussdCode: "*126#" });
  });

  it("grants 30 days once CamPay confirms, exactly once", async () => {
    const payment = await checkout({ kind: "SUBSCRIPTION", level: "O_LEVEL", subjectId });
    expect((await refreshPayment(payment.id))?.status).toBe("PENDING");

    fake.settle(payment.providerReference!, "SUCCESSFUL");
    // The waiting page, a notification and a retry can all arrive together.
    await Promise.all([
      refreshPayment(payment.id),
      refreshPayment(payment.id),
      refreshPayment(payment.id),
    ]);
    await refreshPayment(payment.id);

    const subs = await db.subscription.findMany({ where: { userId: user.id } });
    expect(subs).toHaveLength(1);
    expect(subs[0]).toMatchObject({ level: "O_LEVEL", paymentId: payment.id });
    // The chosen competition subject runs alongside, and the whole fee is its income.
    const entries = await db.competitionEntry.findMany({ where: { userId: user.id } });
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({
      subjectId,
      source: "MEMBERSHIP",
      income: 1500,
      paymentId: payment.id,
      startsAt: subs[0]!.startsAt,
      endsAt: subs[0]!.endsAt,
    });
    expect((await db.payment.findUniqueOrThrow({ where: { id: payment.id } })).status).toBe(
      "SUCCESSFUL",
    );
  });

  it("never grants a payment whose amount differs from the price", async () => {
    const payment = await checkout({ kind: "SUBSCRIPTION", level: "O_LEVEL", subjectId });
    fake.settle(payment.providerReference!, "SUCCESSFUL", "15");
    const updated = await refreshPayment(payment.id);
    expect(updated?.status).toBe("FAILED");
    expect(updated?.failureReason).toMatch(/did not match/);
    expect(await db.subscription.count({ where: { userId: user.id } })).toBe(0);
  });

  it("records declined payments", async () => {
    const payment = await checkout({ kind: "SUBSCRIPTION", level: "O_LEVEL", subjectId });
    fake.settle(payment.providerReference!, "FAILED");
    expect((await refreshPayment(payment.id))?.status).toBe("FAILED");
  });

  it("records CamPay's reason when the payment cannot start", async () => {
    fake.failCollect = "Invalid phone number";
    const result = await startCheckout(
      user,
      { kind: "SUBSCRIPTION", level: "O_LEVEL", subjectId },
      "+237677000111",
    );
    expect(result).toEqual({
      ok: false,
      reason: "PROVIDER_ERROR",
      message: "Invalid phone number",
    });
    const payment = await db.payment.findFirstOrThrow({ where: { userId: user.id } });
    expect(payment).toMatchObject({ status: "FAILED", failureReason: "Invalid phone number" });
  });

  it("reuses a payment still waiting on the phone instead of prompting twice", async () => {
    const first = await checkout({ kind: "SUBSCRIPTION", level: "O_LEVEL", subjectId });
    const second = await checkout({ kind: "SUBSCRIPTION", level: "O_LEVEL", subjectId });
    expect(second.id).toBe(first.id);
    expect(fake.collected).toHaveLength(1);
  });
});

describe("solution unlocks", () => {
  it("unlocks a single solution after payment", async () => {
    const payment = await checkout({ kind: "QUESTION_SOLUTION", questionId });
    expect(payment.amount).toBe(100);
    fake.settle(payment.providerReference!, "SUCCESSFUL");
    await refreshPayment(payment.id);
    expect(await db.solutionUnlock.count({ where: { userId: user.id, questionId } })).toBe(1);
  });

  it("refuses to sell what the student already has", async () => {
    await db.subscription.create({
      data: {
        userId: user.id,
        level: "O_LEVEL",
        startsAt: new Date(Date.now() - 1000),
        endsAt: new Date(Date.now() + 86_400_000),
      },
    });
    expect(
      await startCheckout(user, { kind: "QUESTION_SOLUTION", questionId }, "+237677000111"),
    ).toEqual({
      ok: false,
      reason: "ALREADY_OWNED",
    });
    expect(fake.collected).toHaveLength(0);
  });

  it("refuses unknown items", async () => {
    expect(
      await startCheckout(
        user,
        { kind: "QUESTION_SOLUTION", questionId: "missing" },
        "+237677000111",
      ),
    ).toEqual({ ok: false, reason: "NOT_FOUND" });
  });
});

describe("competition subjects", () => {
  const member = async () => {
    const payment = await checkout({ kind: "SUBSCRIPTION", level: "O_LEVEL", subjectId });
    fake.settle(payment.providerReference!, "SUCCESSFUL");
    await refreshPayment(payment.id);
  };

  it("sells an extra subject only to members, priced by level", async () => {
    const extra = {
      kind: "COMPETITION_ENTRY",
      level: "O_LEVEL",
      subjectId: otherSubjectId,
    } as const;
    expect(await startCheckout(user, extra, "+237677000111")).toEqual({
      ok: false,
      reason: "MEMBERSHIP_REQUIRED",
    });

    await member();
    const payment = await checkout(extra);
    expect(payment.amount).toBe(1000);
    fake.settle(payment.providerReference!, "SUCCESSFUL");
    await refreshPayment(payment.id);
    const entry = await db.competitionEntry.findFirstOrThrow({
      where: { userId: user.id, subjectId: otherSubjectId },
    });
    expect(entry).toMatchObject({ source: "EXTRA", income: 1000, paymentId: payment.id });
  });

  it("extends an extra subject bought again before it ends", async () => {
    await member();
    for (let i = 0; i < 2; i++) {
      const payment = await checkout({
        kind: "COMPETITION_ENTRY",
        level: "O_LEVEL",
        subjectId: otherSubjectId,
      });
      fake.settle(payment.providerReference!, "SUCCESSFUL");
      await refreshPayment(payment.id);
    }
    const [first, second] = await db.competitionEntry.findMany({
      where: { userId: user.id, subjectId: otherSubjectId },
      orderBy: { startsAt: "asc" },
    });
    expect(second!.startsAt).toEqual(first!.endsAt);
  });

  it("refuses a subject that is closed, missing or at another level", async () => {
    await db.subject.update({ where: { id: otherSubjectId }, data: { competitionOpen: false } });
    try {
      expect(
        await startCheckout(
          user,
          { kind: "SUBSCRIPTION", level: "O_LEVEL", subjectId: otherSubjectId },
          "+237677000111",
        ),
      ).toEqual({ ok: false, reason: "SUBJECT_CLOSED" });
    } finally {
      await db.subject.update({ where: { id: otherSubjectId }, data: { competitionOpen: true } });
    }
    for (const product of [
      { kind: "SUBSCRIPTION", level: "A_LEVEL", subjectId },
      { kind: "SUBSCRIPTION", level: "O_LEVEL", subjectId: "missing" },
      { kind: "SUBSCRIPTION", level: "O_LEVEL" },
    ] as const) {
      expect(await startCheckout(user, product, "+237677000111"), JSON.stringify(product)).toEqual({
        ok: false,
        reason: "NOT_FOUND",
      });
    }
    expect(fake.collected).toHaveLength(0);
  });
});

describe("CamPay notifications", () => {
  const notify = (params: Record<string, string>) =>
    webhook(new NextRequest(`http://localhost/api/payments/campay?${new URLSearchParams(params)}`));

  it("rejects notifications without a valid signature", async () => {
    const payment = await checkout({ kind: "SUBSCRIPTION", level: "O_LEVEL", subjectId });
    fake.settle(payment.providerReference!, "SUCCESSFUL");
    const forged = await notify({
      reference: payment.providerReference!,
      status: "SUCCESSFUL",
      signature: "bad",
    });
    expect(forged.status).toBe(401);
    expect((await db.payment.findUniqueOrThrow({ where: { id: payment.id } })).status).toBe(
      "PENDING",
    );
  });

  it("re-checks the payment with CamPay instead of trusting the notification", async () => {
    const payment = await checkout({ kind: "SUBSCRIPTION", level: "O_LEVEL", subjectId });
    // Signed and claims success, but CamPay still reports PENDING.
    const early = await notify({
      reference: payment.providerReference!,
      status: "SUCCESSFUL",
      signature: sign({ reference: payment.providerReference }),
    });
    expect(early.status).toBe(200);
    expect(await db.subscription.count({ where: { userId: user.id } })).toBe(0);

    fake.settle(payment.providerReference!, "SUCCESSFUL");
    const confirmed = await notify({
      external_reference: payment.id,
      status: "SUCCESSFUL",
      signature: sign({ reference: payment.providerReference }),
    });
    expect(confirmed.status).toBe(200);
    expect(await db.subscription.count({ where: { userId: user.id } })).toBe(1);
  });
});
