import { describe, expect, it } from "vitest";
import { checkEnv } from "./env";

const good = {
  DATABASE_URL: "postgresql://db",
  APP_URL: "https://gceprep237.com",
  CAMPAY_ENVIRONMENT: "live",
  CAMPAY_APP_USERNAME: "user",
  CAMPAY_APP_PASSWORD: "pass",
  CAMPAY_WEBHOOK_KEY: "key",
};

describe("checkEnv", () => {
  it("accepts a complete live configuration", () => {
    expect(checkEnv(good)).toEqual({ errors: [], warnings: [] });
  });

  it("requires the database and an https site address", () => {
    const { errors } = checkEnv({
      ...good,
      DATABASE_URL: undefined,
      APP_URL: "http://gceprep237.com",
    });
    expect(errors).toEqual([
      "DATABASE_URL is not set.",
      "APP_URL must start with https:// in production.",
    ]);
  });

  it("catches credentials pasted with brackets or quotes", () => {
    const { errors } = checkEnv({
      ...good,
      CAMPAY_APP_USERNAME: "<user>",
      CAMPAY_WEBHOOK_KEY: '"key"',
    });
    expect(errors).toHaveLength(2);
    expect(errors[0]).toMatch(/CAMPAY_APP_USERNAME/);
  });

  it("requires every CamPay value for live payments", () => {
    expect(checkEnv({ ...good, CAMPAY_WEBHOOK_KEY: undefined }).errors).toEqual([
      "Live payments need CAMPAY_WEBHOOK_KEY.",
    ]);
  });

  it("only warns when payments are off or in demo mode", () => {
    const off = checkEnv({ DATABASE_URL: "x", APP_URL: "https://a.cm" });
    expect(off.errors).toEqual([]);
    expect(off.warnings[0]).toMatch(/payments are off/);
    expect(checkEnv({ ...good, CAMPAY_ENVIRONMENT: "demo" }).warnings[0]).toMatch(/demo mode/);
  });
});
