import { describe, expect, it } from "vitest";
import {
  calculate,
  defaultInputs,
  employeesToSlider,
  manualBaselineHours,
  sanitizeInputs,
  sliderToEmployees,
  type CalculatorInputs,
} from "./model";

const allManual = (overrides: Partial<CalculatorInputs> = {}): CalculatorInputs => ({
  ...defaultInputs("USD"),
  methods: { payroll: "manual", leave: "manual", requests: "manual", lifecycle: "manual", reporting: "manual" },
  ...overrides,
});

describe("manualBaselineHours", () => {
  it("matches the documented assumptions for the default scenario", () => {
    const hours = manualBaselineHours(defaultInputs());
    // 12 runs x (4h + 120 employees x 6 min)
    expect(hours.payroll).toBeCloseTo(192);
    // 120 employees x 10 min x 12 months
    expect(hours.leave).toBeCloseTo(240);
    // 120 x 0.4 requests x 12 months x 15 min
    expect(hours.requests).toBeCloseTo(144);
    // 2 x 120 x 15% movements x 3h
    expect(hours.lifecycle).toBeCloseTo(108);
    // 1 entity x 6h x 12
    expect(hours.reporting).toBeCloseTo(72);
  });

  it("adds fixed payroll and reporting effort for each extra country", () => {
    const one = manualBaselineHours(defaultInputs());
    const three = manualBaselineHours({ ...defaultInputs(), entities: 3 });
    expect(three.payroll - one.payroll).toBeCloseTo(12 * 4 * 2);
    expect(three.reporting).toBeCloseTo(one.reporting * 3);
  });
});

describe("calculate", () => {
  it("produces the expected totals for the default scenario", () => {
    const result = calculate(defaultInputs());
    expect(result.currentHours).toBeCloseTo(658.8, 1);
    expect(result.savedHours).toBeCloseTo(501.12, 1);
    expect(result.savedCost).toBeCloseTo(12528, 0);
    expect(result.annualSubscription).toBe(5760);
    expect(result.returnMultiple).toBeCloseTo(2.175, 3);
    expect(result.verdict).toBe("strong");
    expect(result.biggestOpportunity).toBe("leave");
  });

  it("calls it moderate when savings cover the cost but not twice over", () => {
    // LKR defaults: 501 h x 1,200 = 601k recovered vs 250 x 120 x 12 = 360k
    const result = calculate(defaultInputs("LKR"));
    expect(result.returnMultiple).toBeCloseTo(1.67, 2);
    expect(result.verdict).toBe("moderate");
  });

  it("lists payroll corrections straight after payroll", () => {
    const ids = calculate(defaultInputs()).processes.map((p) => p.id);
    expect(ids).toEqual(["payroll", "corrections", "leave", "requests", "lifecycle", "reporting"]);
  });

  it("finds almost nothing to save when everything is already automated", () => {
    const result = calculate({
      ...defaultInputs(),
      corrections: "rarely",
      methods: { payroll: "automated", leave: "automated", requests: "automated", lifecycle: "automated", reporting: "automated" },
    });
    const ratedSavings = result.processes.filter((p) => p.id !== "corrections").map((p) => p.savedHours);
    expect(ratedSavings.every((h) => h === 0)).toBe(true);
    expect(result.verdict).toBe("low");
  });

  it("never reports negative savings for any process", () => {
    const result = calculate(allManual({ employees: 5, annualTurnoverPct: 0 }));
    for (const p of result.processes) expect(p.savedHours).toBeGreaterThanOrEqual(0);
  });

  it("calls a large, fully manual business a strong case", () => {
    const result = calculate(allManual({ employees: 400, entities: 3, corrections: "often" }));
    expect(result.verdict).toBe("strong");
    expect(result.netBenefit).toBeGreaterThan(0);
  });

  it("treats a zero subscription price as an unlimited return rather than dividing by zero", () => {
    const result = calculate({ ...defaultInputs(), pricePerEmployee: 0 });
    expect(result.returnMultiple).toBe(Infinity);
    expect(result.verdict).toBe("strong");
  });
});

describe("sanitizeInputs", () => {
  it("clamps out-of-range and non-numeric values", () => {
    const clean = sanitizeInputs({ ...defaultInputs(), employees: 999999, entities: NaN, annualTurnoverPct: -5 });
    expect(clean.employees).toBe(2000);
    expect(clean.entities).toBe(1);
    expect(clean.annualTurnoverPct).toBe(0);
  });
});

describe("employee slider", () => {
  it("covers the full range", () => {
    expect(sliderToEmployees(0)).toBe(5);
    expect(sliderToEmployees(100)).toBe(2000);
  });

  it("round-trips close to the original headcount", () => {
    for (const n of [5, 25, 120, 450, 1500]) {
      const back = sliderToEmployees(employeesToSlider(n));
      expect(Math.abs(back - n) / n).toBeLessThan(0.05);
    }
  });
});
