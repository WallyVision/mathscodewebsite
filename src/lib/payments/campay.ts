import "server-only";

/** The parts of CamPay the site uses, so tests can substitute a fake. */
export interface PaymentProvider {
  readonly name: string;
  collect(params: CollectParams): Promise<CollectResult>;
  getTransaction(reference: string): Promise<ProviderTransaction | null>;
}

export interface CollectParams {
  amount: number;
  /** Payer's number without "+", e.g. 237677123456 */
  from: string;
  description: string;
  externalReference: string;
}

export type CollectResult =
  | { ok: true; reference: string; ussdCode: string | null; operator: string | null }
  | { ok: false; message: string };

export interface ProviderTransaction {
  reference: string;
  status: string;
  amount: unknown;
  currency: string;
  operator: string | null;
  operatorReference: string | null;
}

const BASE_URLS = {
  demo: "https://demo.campay.net",
  live: "https://www.campay.net",
} as const;

// Refresh the access token this long before CamPay says it expires.
const TOKEN_MARGIN_MS = 5 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 20_000;

export class CampayError extends Error {}

export class Campay implements PaymentProvider {
  readonly name = "campay";
  private token: { value: string; expiresAt: number } | null = null;

  constructor(private readonly config: { baseUrl: string; username: string; password: string }) {}

  private async request(
    path: string,
    init: RequestInit = {},
    authenticated = true,
  ): Promise<Response> {
    const headers = new Headers(init.headers);
    headers.set("Content-Type", "application/json");
    if (authenticated) headers.set("Authorization", `Token ${await this.accessToken()}`);
    return fetch(`${this.config.baseUrl}${path}`, {
      ...init,
      headers,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      cache: "no-store",
    });
  }

  private async accessToken(): Promise<string> {
    if (this.token && Date.now() < this.token.expiresAt - TOKEN_MARGIN_MS) return this.token.value;
    const response = await this.request(
      "/api/token/",
      {
        method: "POST",
        body: JSON.stringify({ username: this.config.username, password: this.config.password }),
      },
      false,
    );
    const body = (await response.json().catch(() => ({}))) as {
      token?: string;
      expires_in?: number;
    };
    if (!response.ok || !body.token) {
      throw new CampayError(
        `CamPay login failed (HTTP ${response.status}). Check the app username and password.`,
      );
    }
    this.token = { value: body.token, expiresAt: Date.now() + (body.expires_in ?? 3600) * 1000 };
    return body.token;
  }

  /** Runs a request, logging in again once if CamPay says the token is no longer valid. */
  private async withAuthRetry(path: string, init: RequestInit = {}): Promise<Response> {
    const response = await this.request(path, init);
    if (response.status !== 401) return response;
    this.token = null;
    return this.request(path, init);
  }

  async collect(params: CollectParams): Promise<CollectResult> {
    const response = await this.withAuthRetry("/api/collect/", {
      method: "POST",
      body: JSON.stringify({
        amount: String(params.amount),
        currency: "XAF",
        from: params.from,
        description: params.description,
        external_reference: params.externalReference,
      }),
    });
    const body = (await response.json().catch(() => ({}))) as Record<string, unknown>;
    if (!response.ok || typeof body.reference !== "string") {
      const message = typeof body.message === "string" ? body.message : `HTTP ${response.status}`;
      return { ok: false, message };
    }
    return {
      ok: true,
      reference: body.reference,
      ussdCode: typeof body.ussd_code === "string" ? body.ussd_code : null,
      operator: typeof body.operator === "string" ? body.operator : null,
    };
  }

  async getTransaction(reference: string): Promise<ProviderTransaction | null> {
    const response = await this.withAuthRetry(`/api/transaction/${encodeURIComponent(reference)}/`);
    if (response.status === 404) return null;
    if (!response.ok)
      throw new CampayError(`CamPay status check failed (HTTP ${response.status}).`);
    const body = (await response.json()) as Record<string, unknown>;
    return {
      reference: String(body.reference ?? reference),
      status: String(body.status ?? "PENDING"),
      amount: body.amount,
      currency: String(body.currency ?? ""),
      operator: typeof body.operator === "string" ? body.operator : null,
      operatorReference:
        typeof body.operator_reference === "string" ? body.operator_reference : null,
    };
  }
}

let provider: PaymentProvider | null = null;

/** The configured provider, or null when CamPay credentials are not set. */
export function getPaymentProvider(): PaymentProvider | null {
  if (provider) return provider;
  const username = process.env.CAMPAY_APP_USERNAME;
  const password = process.env.CAMPAY_APP_PASSWORD;
  if (!username || !password) return null;
  const environment = process.env.CAMPAY_ENVIRONMENT === "live" ? "live" : "demo";
  provider = new Campay({ baseUrl: BASE_URLS[environment], username, password });
  return provider;
}

/** For tests: replace the provider. */
export function setPaymentProvider(next: PaymentProvider | null): void {
  provider = next;
}

export function webhookKey(): string | null {
  return process.env.CAMPAY_WEBHOOK_KEY || null;
}
