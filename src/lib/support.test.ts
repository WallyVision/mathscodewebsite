import { describe, expect, it } from "vitest";
import { formatWhatsApp, whatsAppLink } from "./support";

describe("support contact", () => {
  it("formats a Cameroon WhatsApp number for display", () => {
    expect(formatWhatsApp("237676999221")).toBe("+237 6 76 99 92 21");
  });

  it("builds a wa.me link with encoded text", () => {
    expect(whatsAppLink("237676999221", "Hello A&B")).toBe(
      "https://wa.me/237676999221?text=Hello%20A%26B",
    );
  });
});
