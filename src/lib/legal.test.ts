import { describe, expect, it } from "vitest";
import { privacyMarkdown, refundsMarkdown, termsMarkdown } from "./legal";

describe("legal pages", () => {
  it("state the prices and prize rules the site applies", () => {
    const terms = termsMarkdown();
    expect(terms).toContain("1,500 FCFA");
    expect(terms).toContain("2,000 FCFA");
    expect(terms).toContain("20%");
    expect(terms).toContain("1,000 FCFA");
    expect(terms).toContain("10,000 FCFA");
    expect(terms).toContain("1st 50%, 2nd 30%, 3rd 20%");
  });

  it("link to each other", () => {
    expect(termsMarkdown()).toContain("](/privacy)");
    expect(privacyMarkdown()).toContain("](/contact)");
    expect(refundsMarkdown()).toContain("](/terms)");
  });
});
