/**
 * Checks the environment variables the site needs. Errors stop a production
 * server from starting; warnings are logged.
 */
export function checkEnv(env: Record<string, string | undefined>): {
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!env.DATABASE_URL) errors.push("DATABASE_URL is not set.");
  if (!env.APP_URL) {
    errors.push("APP_URL is not set (e.g. https://gceprep237.com).");
  } else if (!/^https:\/\//.test(env.APP_URL)) {
    errors.push("APP_URL must start with https:// in production.");
  }

  const campay = ["CAMPAY_APP_USERNAME", "CAMPAY_APP_PASSWORD", "CAMPAY_WEBHOOK_KEY"] as const;
  const missing = campay.filter((name) => !env[name]);
  for (const name of campay) {
    const value = env[name];
    if (value && (/^[<"']|[>"']$/.test(value) || value !== value.trim())) {
      errors.push(
        `${name} has quotes, brackets or spaces around it. Paste the value exactly as CamPay shows it.`,
      );
    }
  }
  if (env.CAMPAY_ENVIRONMENT && !["demo", "live"].includes(env.CAMPAY_ENVIRONMENT)) {
    errors.push('CAMPAY_ENVIRONMENT must be "demo" or "live".');
  }
  if (env.CAMPAY_ENVIRONMENT === "live" && missing.length > 0) {
    errors.push(`Live payments need ${missing.join(", ")}.`);
  } else if (missing.length > 0) {
    warnings.push(`Online payments are off: ${missing.join(", ")} not set.`);
  } else if (env.CAMPAY_ENVIRONMENT !== "live") {
    warnings.push(
      "CamPay is in demo mode: payments use test money. Set CAMPAY_ENVIRONMENT=live to take real payments.",
    );
  }
  return { errors, warnings };
}
