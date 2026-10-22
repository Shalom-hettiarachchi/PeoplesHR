import { describe, expect, it } from "vitest";
import { defaultInputs } from "./model";
import { fromSearchParams, toSearchParams } from "./url-state";

describe("shareable URL state", () => {
  it("round-trips every input", () => {
    const inputs = {
      ...defaultInputs("LKR"),
      employees: 340,
      entities: 4,
      payrollFrequency: "biweekly" as const,
      corrections: "often" as const,
      methods: { payroll: "automated", leave: "partial", requests: "manual", lifecycle: "automated", reporting: "manual" } as const,
      hourlyCost: 1500,
      annualTurnoverPct: 22,
      pricePerEmployee: 450,
    };
    expect(fromSearchParams(toSearchParams(inputs))).toEqual(inputs);
  });

  it("returns null when the link has no calculator state", () => {
    expect(fromSearchParams(new URLSearchParams("utm_source=google"))).toBeNull();
  });

  it("falls back to defaults for tampered values", () => {
    const parsed = fromSearchParams(new URLSearchParams("e=abc&c=XYZ&f=daily&m=zz&x=always&n=99"));
    const defaults = defaultInputs("USD");
    expect(parsed).toEqual({ ...defaults, entities: 15 });
  });
});
