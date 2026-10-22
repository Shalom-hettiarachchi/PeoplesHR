import { describe, expect, it } from "vitest";
import type { FinderAnswers } from "./data";
import { computeNeeds, recommend } from "./recommend";
import { answersFromSearchParams, answersToSearchParams, firstOpenStep, isComplete } from "./url-state";

const answers = (overrides: Partial<FinderAnswers>): FinderAnswers => ({
  size: "51-200",
  countries: "1",
  industry: "services",
  tools: "spreadsheets",
  challenges: ["payroll"],
  mustHaves: [],
  timeline: "3-6",
  ...overrides,
});

describe("recommend", () => {
  it("suggests Essentials for a small team that outsources payroll", () => {
    const r = recommend(answers({ size: "1-20", tools: "outsourced", challenges: ["time", "requests"] }));
    expect(r.recommended.pkg.id).toBe("essentials");
    expect(r.recommended.addOns).toEqual([]);
  });

  it("suggests Payroll Plus when payroll is the main problem", () => {
    const r = recommend(answers({ industry: "retail", challenges: ["payroll", "time"] }));
    expect(r.recommended.pkg.id).toBe("payroll-plus");
  });

  it("steps up to Talent Suite when hiring is a priority", () => {
    const r = recommend(answers({ challenges: ["payroll", "hiring"] }));
    expect(r.recommended.pkg.id).toBe("talent");
  });

  it("uses an add-on rather than a bigger package for 2-3 countries", () => {
    const r = recommend(answers({ size: "201-500", countries: "2-3" }));
    expect(r.recommended.pkg.id).toBe("payroll-plus");
    expect(r.recommended.addOns).toEqual(["multi-country"]);
  });

  it("recommends Enterprise for 4+ countries or 500+ people", () => {
    expect(recommend(answers({ countries: "4+" })).recommended.pkg.id).toBe("enterprise");
    expect(recommend(answers({ size: "500+" })).recommended.pkg.id).toBe("enterprise");
  });

  it("moves to Enterprise instead of stacking more than two add-ons", () => {
    const r = recommend(answers({ challenges: ["global", "reporting"], mustHaves: ["integrations"], countries: "2-3" }));
    expect(r.recommended.pkg.id).toBe("enterprise");
  });

  it("explains what the next package up would add that isn't needed", () => {
    const r = recommend(answers({ challenges: ["payroll"] }));
    expect(r.whyNotBigger?.pkg.id).toBe("talent");
    expect(r.whyNotBigger?.unneeded).toEqual(["onboarding", "recruitment", "performance"]);
  });

  it("does not give Enterprise a perfect match for a small, simple team", () => {
    const r = recommend(answers({ size: "1-20", tools: "outsourced", challenges: ["time"] }));
    const enterprise = r.matches.find((m) => m.pkg.id === "enterprise")!;
    const essentials = r.matches.find((m) => m.pkg.id === "essentials")!;
    expect(essentials.match).toBeGreaterThan(enterprise.match);
  });

  it("gives the recommended package the best match in typical cases", () => {
    const cases = [
      answers({ challenges: ["payroll"] }),
      answers({ challenges: ["payroll", "hiring"] }),
      answers({ size: "1-20", tools: "outsourced", challenges: ["time", "requests"] }),
      answers({ size: "500+", challenges: ["reporting", "global"], countries: "4+" }),
    ];
    for (const a of cases) {
      const r = recommend(a);
      const best = Math.max(...r.matches.map((m) => m.match));
      expect(r.recommended.match).toBe(best);
    }
  });

  it("works on partial answers for the live preview", () => {
    expect(() => recommend({ challenges: [] })).not.toThrow();
    expect(recommend({ challenges: [] }).recommended.pkg.id).toBe("essentials");
  });
});

describe("computeNeeds", () => {
  it("records why each module is needed", () => {
    const needs = computeNeeds(answers({ industry: "healthcare", challenges: ["compliance"] }));
    const compliance = needs.find((n) => n.module === "compliance")!;
    expect(compliance.weight).toBe(5);
    expect(compliance.reasons).toContain("Regulated industries face stricter reporting");
  });
});

describe("finder URL state", () => {
  it("round-trips complete answers, including 'none' for must-haves", () => {
    const a = answers({ challenges: ["payroll", "hiring"], mustHaves: [] });
    const back = answersFromSearchParams(answersToSearchParams(a));
    expect(back).toEqual(a);
    expect(isComplete(back)).toBe(true);
  });

  it("drops invalid values and finds the first unanswered step", () => {
    const a = answersFromSearchParams(new URLSearchParams("s=huge&c=1&ch=payroll,nope"));
    expect(a.size).toBeUndefined();
    expect(a.challenges).toEqual(["payroll"]);
    expect(firstOpenStep(a)).toBe(0);
    expect(isComplete(a)).toBe(false);
  });
});
