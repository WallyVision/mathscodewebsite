/**
 * Sends one small real payment request through CamPay and waits for the
 * result. Use it to check credentials and the phone flow before launch.
 * Touches no database.
 *
 *   npm run payments:smoke -- 676999221 25
 */
import "dotenv/config";
import { Campay } from "../src/lib/payments/campay";
import { normalizeCameroonPhone } from "../src/lib/domain/phone";

const POLL_MS = 5000;
const TIMEOUT_MS = 3 * 60 * 1000;

async function main() {
  const [phoneArg, amountArg = "25"] = process.argv.slice(2);
  const phone = phoneArg ? normalizeCameroonPhone(phoneArg) : null;
  const amount = Number(amountArg);
  const { CAMPAY_APP_USERNAME: username, CAMPAY_APP_PASSWORD: password } = process.env;
  if (!phone || !Number.isInteger(amount) || amount <= 0 || !username || !password) {
    console.error(
      "Usage: npm run payments:smoke -- <mobile number> [amount]  (needs CAMPAY_* variables)",
    );
    process.exitCode = 1;
    return;
  }
  const environment = process.env.CAMPAY_ENVIRONMENT === "live" ? "live" : "demo";
  const campay = new Campay({
    baseUrl: environment === "live" ? "https://www.campay.net" : "https://demo.campay.net",
    username,
    password,
  });

  console.log(`[${environment}] Requesting ${amount} XAF from ${phone}…`);
  const started = await campay.collect({
    amount,
    from: phone.replace(/^\+/, ""),
    description: "StudentLife237 payment test",
    externalReference: `smoke-${Date.now()}`,
  });
  if (!started.ok) {
    console.error(`CamPay refused the request: ${started.message}`);
    process.exitCode = 1;
    return;
  }
  console.log(
    `Reference ${started.reference} (${started.operator ?? "operator unknown"}). Confirm on the phone${started.ussdCode ? ` or dial ${started.ussdCode}` : ""}.`,
  );

  const deadline = Date.now() + TIMEOUT_MS;
  while (Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, POLL_MS));
    const transaction = await campay.getTransaction(started.reference);
    const status = transaction?.status ?? "NOT_FOUND";
    console.log(`  status: ${status}`);
    if (status === "SUCCESSFUL" || status === "FAILED") {
      console.log(JSON.stringify({ reference: started.reference, ...transaction }));
      if (status === "FAILED") process.exitCode = 1;
      return;
    }
  }
  console.log(`Still pending after ${TIMEOUT_MS / 60000} minutes. Reference: ${started.reference}`);
  process.exitCode = 1;
}

main();
