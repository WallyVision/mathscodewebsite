import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { verifyHs256 } from "./jwt";

function sign(payload: object, key: string, header: object = { alg: "HS256", typ: "JWT" }) {
  const h = Buffer.from(JSON.stringify(header)).toString("base64url");
  const p = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const s = createHmac("sha256", key).update(`${h}.${p}`).digest("base64url");
  return `${h}.${p}.${s}`;
}

describe("verifyHs256", () => {
  const key = "webhook-key";

  it("accepts a token signed with the key", () => {
    expect(verifyHs256(sign({ reference: "r1" }, key), key)).toEqual({ reference: "r1" });
  });

  it("rejects a token signed with another key", () => {
    expect(verifyHs256(sign({ reference: "r1" }, "other"), key)).toBeNull();
  });

  it("rejects a tampered payload", () => {
    const [h, , s] = sign({ amount: 100 }, key).split(".");
    const forged = Buffer.from(JSON.stringify({ amount: 1 })).toString("base64url");
    expect(verifyHs256(`${h}.${forged}.${s}`, key)).toBeNull();
  });

  it("rejects other algorithms, including none", () => {
    expect(verifyHs256(sign({}, key, { alg: "HS512" }), key)).toBeNull();
    const none = `${Buffer.from('{"alg":"none"}').toString("base64url")}.${Buffer.from("{}").toString("base64url")}.`;
    expect(verifyHs256(none, key)).toBeNull();
  });

  it("rejects expired tokens", () => {
    const token = sign({ exp: 1_000 }, key);
    expect(verifyHs256(token, key, new Date(2_000_000))).toBeNull();
  });

  it("rejects malformed input and an empty key", () => {
    expect(verifyHs256("not-a-jwt", key)).toBeNull();
    expect(verifyHs256(sign({}, key), "")).toBeNull();
  });
});
