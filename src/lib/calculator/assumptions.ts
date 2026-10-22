/**
 * Every number the calculator relies on lives here. The methodology section on
 * the page reads from this file too, so what we show always matches the maths.
 * To change an assumption, change it here.
 */

export type Method = "manual" | "partial" | "automated";
export type PayrollFrequency = "monthly" | "semimonthly" | "biweekly" | "weekly";
export type CorrectionLevel = "rarely" | "sometimes" | "often";
export type CurrencyCode = "USD" | "GBP" | "AUD" | "AED" | "LKR";
export type ProcessId = "payroll" | "corrections" | "leave" | "requests" | "lifecycle" | "reporting";

export const RUNS_PER_YEAR: Record<PayrollFrequency, number> = {
  monthly: 12,
  semimonthly: 24,
  biweekly: 26,
  weekly: 52,
};

/** Share of the fully manual effort that remains for each way of working. */
export const METHOD_FACTOR: Record<Method, number> = {
  manual: 1,
  partial: 0.55,
  automated: 0.2,
};

/** Effort that remains once the process runs in PeoplesHR (same as "automated"). */
export const PEOPLESHR_FACTOR = METHOD_FACTOR.automated;

export const ASSUMPTIONS = {
  productiveHoursPerFte: 1700,
  hoursPerWorkingWeek: 40,
  payroll: {
    /** Preparing, checking and approving one pay run, per country or entity. */
    fixedHoursPerRunPerEntity: 4,
    /** Collecting changes and checking each employee's pay. */
    minutesPerEmployeePerRun: 6,
  },
  corrections: {
    /** Share of payslips that need a correction or re-run. */
    rate: { rarely: 0.005, sometimes: 0.02, often: 0.05 } as Record<CorrectionLevel, number>,
    hoursEach: 0.75,
    /** Corrections avoided once inputs are validated automatically. */
    reductionWithPeoplesHr: 0.7,
  },
  leave: {
    /** Approving requests, updating balances, consolidating timesheets. */
    minutesPerEmployeePerMonth: 10,
  },
  requests: {
    /** Payslip copies, letters, "how much leave do I have?" questions. */
    perEmployeePerMonth: 0.4,
    minutesEach: 15,
  },
  lifecycle: {
    /** Contracts, records, system access and final settlements per joiner or leaver. */
    hoursPerMovement: 3,
  },
  reporting: {
    /** Statutory returns, headcount and payroll reports. */
    hoursPerEntityPerMonth: 6,
  },
  verdict: {
    /** Value recovered for every 1 spent on the subscription. */
    strongAt: 2, // admin time alone returns double the cost
    moderateAt: 1, // pays for itself on admin time alone
  },
} as const;

export interface CurrencyConfig {
  code: CurrencyCode;
  label: string;
  /** Fully loaded hourly cost of an HR or payroll administrator. */
  defaultHourlyCost: number;
  /** Illustrative subscription price per employee per month. Not a quote. */
  defaultPricePerEmployee: number;
  hourlyStep: number;
  priceStep: number;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: "USD", label: "US dollar", defaultHourlyCost: 25, defaultPricePerEmployee: 4, hourlyStep: 1, priceStep: 0.5 },
  GBP: { code: "GBP", label: "British pound", defaultHourlyCost: 22, defaultPricePerEmployee: 3.5, hourlyStep: 1, priceStep: 0.5 },
  AUD: { code: "AUD", label: "Australian dollar", defaultHourlyCost: 40, defaultPricePerEmployee: 6, hourlyStep: 1, priceStep: 0.5 },
  AED: { code: "AED", label: "UAE dirham", defaultHourlyCost: 75, defaultPricePerEmployee: 15, hourlyStep: 5, priceStep: 1 },
  LKR: { code: "LKR", label: "Sri Lankan rupee", defaultHourlyCost: 1200, defaultPricePerEmployee: 250, hourlyStep: 50, priceStep: 25 },
};

export const LIMITS = {
  employees: { min: 5, max: 2000 },
  entities: { min: 1, max: 15 },
  turnoverPct: { min: 0, max: 60 },
} as const;
