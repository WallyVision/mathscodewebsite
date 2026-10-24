import { NextResponse, type NextRequest } from "next/server";
import { webhookKey } from "@/lib/payments/campay";
import { verifyHs256 } from "@/lib/payments/jwt";
import { findPaymentForNotification, refreshPayment } from "@/lib/payments/service";

/**
 * CamPay payment notifications (the app's webhook URL). The signature proves
 * the request came from CamPay, but the notification's own status is not
 * trusted: the payment is re-checked with CamPay before anything is granted.
 */
async function handle(params: URLSearchParams | Record<string, unknown>) {
  const get = (key: string) => {
    const value = params instanceof URLSearchParams ? params.get(key) : params[key];
    return typeof value === "string" && value !== "" ? value : null;
  };

  const key = webhookKey();
  if (!key) return NextResponse.json({ error: "Webhook key not configured" }, { status: 503 });
  const signature = get("signature");
  if (!signature || !verifyHs256(signature, key)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payment = await findPaymentForNotification(get("reference"), get("external_reference"));
  // Unknown payments are acknowledged so CamPay does not keep retrying them.
  if (!payment) return NextResponse.json({ ok: true, known: false });

  try {
    await refreshPayment(payment.id);
  } catch (err) {
    console.error("Payment refresh after CamPay notification failed", err);
    return NextResponse.json({ error: "Try again later" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}

export async function GET(request: NextRequest) {
  return handle(request.nextUrl.searchParams);
}

export async function POST(request: NextRequest) {
  const type = request.headers.get("content-type") ?? "";
  if (type.includes("application/json")) {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    return handle(body);
  }
  const form = await request.formData().catch(() => null);
  const params = new URLSearchParams();
  form?.forEach((value, k) => typeof value === "string" && params.set(k, value));
  // Some notifications carry their fields in the query string even when POSTed.
  request.nextUrl.searchParams.forEach((value, k) => params.has(k) || params.set(k, value));
  return handle(params);
}
