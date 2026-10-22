import { describe, expect, it } from "vitest";
import { scoreLead } from "./score";
import { leadSchema } from "./schema";

describe("scoreLead", () => {
  it("marks a large company asking for a demo as sales-ready", () => {
    const result = scoreLead({
      email: "dana@acme.co",
      intent: "demo",
      role: "hr-lead",
      context: { employees: 250, verdict: "strong" },
    });
    expect(result.tier).toBe("sales-ready");
    expect(result.score).toBe(95);
  });

  it("puts a small team downloading a checklist into nurture", () => {
    const result = scoreLead({ email: "sam@gmail.com", intent: "checklist", context: { employees: 8 } });
    expect(result.tier).toBe("nurture");
  });

  it("explains every point it awards", () => {
    const result = scoreLead({ email: "a@b.co", intent: "report", context: { employees: 60 } });
    expect(result.reasons).toEqual(["+20 asked for their report", "+15 50-199 employees"]);
  });
});

describe("leadSchema", () => {
  it("rejects an invalid email with a helpful message", () => {
    const parsed = leadSchema.safeParse({ email: "nope", source: "cost-calculator", intent: "report" });
    expect(parsed.success).toBe(false);
    expect(parsed.error?.issues[0].message).toMatch(/valid email/);
  });

  it("accepts a minimal valid lead and fills defaults", () => {
    const parsed = leadSchema.parse({ email: "a@b.co", source: "cost-calculator", intent: "report" });
    expect(parsed.marketingConsent).toBe(false);
    expect(parsed.context).toEqual({});
  });
});
