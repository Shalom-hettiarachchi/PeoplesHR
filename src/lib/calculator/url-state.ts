import { CURRENCIES, RUNS_PER_YEAR, type CorrectionLevel, type CurrencyCode, type Method, type PayrollFrequency } from "./assumptions";
import { defaultInputs, RATED_PROCESSES, sanitizeInputs, type CalculatorInputs } from "./model";

/**
 * Short query-string format so a result can be shared with a manager:
 * ?e=120&n=1&f=monthly&c=USD&m=pmmmp&x=sometimes&h=25&t=15&p=4
 * m holds one letter per process: m = manual, p = partial, a = automated.
 */

const METHOD_CODES: Record<Method, string> = { manual: "m", partial: "p", automated: "a" };
const CODE_TO_METHOD: Record<string, Method> = { m: "manual", p: "partial", a: "automated" };
const CORRECTION_LEVELS: CorrectionLevel[] = ["rarely", "sometimes", "often"];

export function toSearchParams(inputs: CalculatorInputs): URLSearchParams {
  return new URLSearchParams({
    e: String(inputs.employees),
    n: String(inputs.entities),
    f: inputs.payrollFrequency,
    c: inputs.currency,
    m: RATED_PROCESSES.map((id) => METHOD_CODES[inputs.methods[id]]).join(""),
    x: inputs.corrections,
    h: String(inputs.hourlyCost),
    t: String(inputs.annualTurnoverPct),
    p: String(inputs.pricePerEmployee),
  });
}

/** Reads a shared link. Anything missing or invalid falls back to the defaults. */
export function fromSearchParams(params: URLSearchParams): CalculatorInputs | null {
  if (!params.has("e")) return null;

  const currency = (params.get("c") ?? "") in CURRENCIES ? (params.get("c") as CurrencyCode) : "USD";
  const base = defaultInputs(currency);
  const num = (key: string, fallback: number) => {
    const raw = params.get(key);
    const value = raw === null || raw === "" ? NaN : Number(raw);
    return Number.isFinite(value) ? value : fallback;
  };

  const frequency = params.get("f") ?? "";
  const corrections = params.get("x") ?? "";
  const codes = params.get("m") ?? "";

  const methods = { ...base.methods };
  RATED_PROCESSES.forEach((id, i) => {
    const method = CODE_TO_METHOD[codes[i]];
    if (method) methods[id] = method;
  });

  return sanitizeInputs({
    employees: num("e", base.employees),
    entities: num("n", base.entities),
    payrollFrequency: frequency in RUNS_PER_YEAR ? (frequency as PayrollFrequency) : base.payrollFrequency,
    currency,
    methods,
    corrections: CORRECTION_LEVELS.includes(corrections as CorrectionLevel)
      ? (corrections as CorrectionLevel)
      : base.corrections,
    hourlyCost: num("h", base.hourlyCost),
    annualTurnoverPct: num("t", base.annualTurnoverPct),
    pricePerEmployee: num("p", base.pricePerEmployee),
  });
}
