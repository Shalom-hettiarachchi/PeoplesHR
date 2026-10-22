import { describe, expect, it } from "vitest";
import { buildBrief } from "./brief";

describe("buildBrief", () => {
  it("summarises a calculator lead with a replay link", () => {
    const brief = buildBrief({
      source: "cost-calculator",
      intent: "demo",
      tier: "sales-ready",
      context: {
        employees: 450,
        entities: 3,
        currency: "USD",
        verdict: "strong",
        savedHoursPerYear: 2413,
        savedCostPerYear: 60325,
        biggestOpportunity: "leave",
        scenario: "e=450&n=3",
      },
    });
    expect(brief.headline).toBe("Could recover $60,325 a year, mostly in leave and attendance");
    expect(brief.sla).toBe("Call within 1 working day");
    expect(brief.nextAction).toContain("leave and attendance");
    expect(brief.replayHref).toBe("/tools/hr-admin-cost-calculator?e=450&n=3");
    expect(brief.facts.find((f) => f.label === "Verdict")?.value).toBe("Strong case");
  });

  it("summarises a finder lead in plain language", () => {
    const brief = buildBrief({
      source: "software-finder",
      intent: "report",
      tier: "warm",
      context: {
        sizeBand: "51-200",
        countries: "2-3",
        challenges: "payroll,hiring",
        timeline: "3-6",
        recommendedPackage: "talent",
        addOns: "multi-country",
        match: 86,
        answers: "s=51-200",
      },
    });
    expect(brief.headline).toBe("Recommended Talent Suite, in 3 to 6 months");
    expect(brief.facts.find((f) => f.label === "Recommended")?.value).toBe("Talent Suite + Multi-country payroll (86% match)");
    expect(brief.facts.find((f) => f.label === "Main problems")?.value).toContain("Payroll takes too long");
    expect(brief.replayHref).toBe("/tools/hr-software-finder?s=51-200");
  });

  it("summarises a checklist download", () => {
    const brief = buildBrief({
      source: "content-hub",
      intent: "checklist",
      tier: "nurture",
      context: { guide: "how-to-reduce-payroll-errors", checklist: "payroll-accuracy" },
    });
    expect(brief.headline).toBe("Unlocked the payroll accuracy checklist");
    expect(brief.sla).toBe("Automated email series");
    expect(brief.replayHref).toBe("/resources/how-to-reduce-payroll-errors");
  });

  it("copes with missing context", () => {
    expect(() => buildBrief({ source: "software-finder", intent: "demo", tier: "warm", context: {} })).not.toThrow();
  });
});
