import {
  ASSUMPTIONS as A,
  CURRENCIES,
  LIMITS,
  METHOD_FACTOR,
  PEOPLESHR_FACTOR,
  RUNS_PER_YEAR,
  type CorrectionLevel,
  type CurrencyCode,
  type Method,
  type PayrollFrequency,
  type ProcessId,
} from "./assumptions";

/** Processes the visitor rates as manual, partly automated or automated. */
export const RATED_PROCESSES = ["payroll", "leave", "requests", "lifecycle", "reporting"] as const;
export type RatedProcessId = (typeof RATED_PROCESSES)[number];

export interface CalculatorInputs {
  employees: number;
  /** Countries or legal entities the business runs payroll in. */
  entities: number;
  payrollFrequency: PayrollFrequency;
  currency: CurrencyCode;
  methods: Record<RatedProcessId, Method>;
  corrections: CorrectionLevel;
  hourlyCost: number;
  annualTurnoverPct: number;
  pricePerEmployee: number;
}

export interface ProcessResult {
  id: ProcessId;
  currentHours: number;
  futureHours: number;
  savedHours: number;
  savedCost: number;
}

export type Verdict = "strong" | "moderate" | "low";

export interface CalculatorResult {
  processes: ProcessResult[];
  currentHours: number;
  savedHours: number;
  currentCost: number;
  savedCost: number;
  currentFte: number;
  savedWorkingWeeks: number;
  annualSubscription: number;
  netBenefit: number;
  /** Value recovered for every 1 spent on the subscription. */
  returnMultiple: number;
  verdict: Verdict;
  /** Process with the most recoverable time, or null if nothing can be saved. */
  biggestOpportunity: ProcessId | null;
}

export function defaultInputs(currency: CurrencyCode = "USD"): CalculatorInputs {
  return {
    employees: 120,
    entities: 1,
    payrollFrequency: "monthly",
    currency,
    methods: { payroll: "partial", leave: "manual", requests: "manual", lifecycle: "manual", reporting: "partial" },
    corrections: "sometimes",
    hourlyCost: CURRENCIES[currency].defaultHourlyCost,
    annualTurnoverPct: 15,
    pricePerEmployee: CURRENCIES[currency].defaultPricePerEmployee,
  };
}

const clamp = (value: number, min: number, max: number) =>
  Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : min;

/** Keeps inputs within sensible ranges (used for typed values and shared links). */
export function sanitizeInputs(inputs: CalculatorInputs): CalculatorInputs {
  return {
    ...inputs,
    employees: Math.round(clamp(inputs.employees, LIMITS.employees.min, LIMITS.employees.max)),
    entities: Math.round(clamp(inputs.entities, LIMITS.entities.min, LIMITS.entities.max)),
    annualTurnoverPct: clamp(inputs.annualTurnoverPct, LIMITS.turnoverPct.min, LIMITS.turnoverPct.max),
    hourlyCost: clamp(inputs.hourlyCost, 0, 1_000_000),
    pricePerEmployee: clamp(inputs.pricePerEmployee, 0, 1_000_000),
  };
}

/** Hours per year each process would take if it were done entirely by hand. */
export function manualBaselineHours(inputs: CalculatorInputs): Record<RatedProcessId, number> {
  const { employees, entities } = inputs;
  const runs = RUNS_PER_YEAR[inputs.payrollFrequency];
  const movements = 2 * employees * (inputs.annualTurnoverPct / 100); // joiners + leavers

  return {
    payroll: runs * (A.payroll.fixedHoursPerRunPerEntity * entities + (employees * A.payroll.minutesPerEmployeePerRun) / 60),
    leave: (employees * A.leave.minutesPerEmployeePerMonth * 12) / 60,
    requests: (employees * A.requests.perEmployeePerMonth * 12 * A.requests.minutesEach) / 60,
    lifecycle: movements * A.lifecycle.hoursPerMovement,
    reporting: entities * A.reporting.hoursPerEntityPerMonth * 12,
  };
}

export function calculate(raw: CalculatorInputs): CalculatorResult {
  const inputs = sanitizeInputs(raw);
  const baseline = manualBaselineHours(inputs);
  const cost = (hours: number) => hours * inputs.hourlyCost;

  const processes: ProcessResult[] = RATED_PROCESSES.map((id) => {
    const currentHours = baseline[id] * METHOD_FACTOR[inputs.methods[id]];
    // Never claim PeoplesHR makes a process slower than it is today.
    const futureHours = Math.min(currentHours, baseline[id] * PEOPLESHR_FACTOR);
    const savedHours = currentHours - futureHours;
    return { id, currentHours, futureHours, savedHours, savedCost: cost(savedHours) };
  });

  const payslips = inputs.employees * RUNS_PER_YEAR[inputs.payrollFrequency];
  const currentCorrections = payslips * A.corrections.rate[inputs.corrections] * A.corrections.hoursEach;
  const futureCorrections = currentCorrections * (1 - A.corrections.reductionWithPeoplesHr);
  // Corrections sit right after payroll in the breakdown.
  processes.splice(1, 0, {
    id: "corrections",
    currentHours: currentCorrections,
    futureHours: futureCorrections,
    savedHours: currentCorrections - futureCorrections,
    savedCost: cost(currentCorrections - futureCorrections),
  });

  const currentHours = sum(processes.map((p) => p.currentHours));
  const savedHours = sum(processes.map((p) => p.savedHours));
  const savedCost = cost(savedHours);
  const annualSubscription = inputs.pricePerEmployee * inputs.employees * 12;
  const returnMultiple = annualSubscription > 0 ? savedCost / annualSubscription : savedCost > 0 ? Infinity : 0;

  const verdict: Verdict =
    returnMultiple >= A.verdict.strongAt ? "strong" : returnMultiple >= A.verdict.moderateAt ? "moderate" : "low";

  const top = processes.reduce((best, p) => (p.savedHours > best.savedHours ? p : best), processes[0]);

  return {
    processes,
    currentHours,
    savedHours,
    currentCost: cost(currentHours),
    savedCost,
    currentFte: currentHours / A.productiveHoursPerFte,
    savedWorkingWeeks: savedHours / A.hoursPerWorkingWeek,
    annualSubscription,
    netBenefit: savedCost - annualSubscription,
    returnMultiple,
    verdict,
    biggestOpportunity: top.savedHours > 0 ? top.id : null,
  };
}

function sum(values: number[]) {
  return values.reduce((total, v) => total + v, 0);
}

/** Maps a 0-100 slider position to a headcount on a log scale, so small teams get fine control. */
export function sliderToEmployees(position: number) {
  const { min, max } = LIMITS.employees;
  const value = Math.exp(Math.log(min) + (Math.log(max) - Math.log(min)) * (position / 100));
  const step = value < 50 ? 1 : value < 200 ? 5 : value < 1000 ? 10 : 50;
  return Math.round(value / step) * step;
}

export function employeesToSlider(employees: number) {
  const { min, max } = LIMITS.employees;
  const clamped = clamp(employees, min, max);
  return ((Math.log(clamped) - Math.log(min)) / (Math.log(max) - Math.log(min))) * 100;
}
