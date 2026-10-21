import { describe, expect, it } from "vitest";
import { parseIdentifier, registerSchema } from "./validation";

describe("registerSchema", () => {
  const valid = {
    name: " Ngwa Brenda ",
    phone: "677 12 34 56",
    email: "",
    level: "O_LEVEL",
    password: "longenough",
  };

  it("normalises phone, trims name and treats a blank email as none", () => {
    expect(registerSchema.parse(valid)).toEqual({
      name: "Ngwa Brenda",
      phone: "+237677123456",
      email: null,
      level: "O_LEVEL",
      password: "longenough",
    });
  });

  it("lowercases email", () => {
    expect(registerSchema.parse({ ...valid, email: "Brenda@Example.com" }).email).toBe(
      "brenda@example.com",
    );
  });

  it("rejects a bad phone and short password", () => {
    const result = registerSchema.safeParse({ ...valid, phone: "12345", password: "short" });
    expect(result.success).toBe(false);
    const paths = result.error?.issues.map((i) => i.path[0]);
    expect(paths).toEqual(expect.arrayContaining(["phone", "password"]));
  });
});

describe("parseIdentifier", () => {
  it("detects email and phone", () => {
    expect(parseIdentifier("A@B.cm")).toEqual({ email: "a@b.cm" });
    expect(parseIdentifier("677123456")).toEqual({ phone: "+237677123456" });
    expect(parseIdentifier("hello")).toBeNull();
  });
});
