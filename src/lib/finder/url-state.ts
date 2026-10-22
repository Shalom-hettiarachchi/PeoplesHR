import { ROUTES } from "@/lib/site";
import { SIZE_MIDPOINT, STEPS, type FinderAnswers, type Step } from "./data";

/** Link to the cost calculator, prefilled with the visitor's team size and countries. */
export function calculatorLink(a: FinderAnswers) {
  const params = new URLSearchParams();
  if (a.size) params.set("e", String(SIZE_MIDPOINT[a.size]));
  if (a.countries) params.set("n", a.countries === "1" ? "1" : a.countries === "2-3" ? "2" : "4");
  const query = params.toString();
  return query ? `${ROUTES.calculator}?${query}` : ROUTES.calculator;
}

/**
 * Shareable answers, e.g. ?s=51-200&c=1&i=retail&t=spreadsheets&ch=payroll,time&m=&w=0-3
 * An empty m= means "none of these" was chosen for must-haves.
 */
const KEYS = { size: "s", countries: "c", industry: "i", tools: "t", challenges: "ch", mustHaves: "m", timeline: "w" } as const;

function allowed(stepId: Step["id"]) {
  const step = STEPS.find((s) => s.id === stepId)!;
  return new Set(step.options.map((o) => o.value as string));
}

export function answersToSearchParams(a: FinderAnswers): URLSearchParams {
  const params = new URLSearchParams();
  if (a.size) params.set(KEYS.size, a.size);
  if (a.countries) params.set(KEYS.countries, a.countries);
  if (a.industry) params.set(KEYS.industry, a.industry);
  if (a.tools) params.set(KEYS.tools, a.tools);
  if (a.challenges.length) params.set(KEYS.challenges, a.challenges.join(","));
  if (a.mustHaves) params.set(KEYS.mustHaves, a.mustHaves.join(","));
  if (a.timeline) params.set(KEYS.timeline, a.timeline);
  return params;
}

/** Reads answers from a link, ignoring anything that isn't a valid option. */
export function answersFromSearchParams(params: URLSearchParams): FinderAnswers {
  const single = <K extends "size" | "countries" | "industry" | "tools" | "timeline">(key: K) => {
    const value = params.get(KEYS[key]);
    return value && allowed(key).has(value) ? (value as FinderAnswers[K]) : undefined;
  };
  const list = <K extends "challenges" | "mustHaves">(key: K, max: number) => {
    const raw = params.get(KEYS[key]);
    if (raw === null) return undefined;
    const ok = allowed(key);
    return [...new Set(raw.split(",").filter((v) => ok.has(v)))].slice(0, max) as NonNullable<FinderAnswers[K]>;
  };

  return {
    size: single("size"),
    countries: single("countries"),
    industry: single("industry"),
    tools: single("tools"),
    challenges: list("challenges", 3) ?? [],
    mustHaves: list("mustHaves", 3),
    timeline: single("timeline"),
  };
}

export function isStepAnswered(step: Step, a: FinderAnswers) {
  if (step.id === "challenges") return a.challenges.length > 0;
  if (step.id === "mustHaves") return a.mustHaves !== undefined;
  return a[step.id] !== undefined;
}

export function isComplete(a: FinderAnswers) {
  return STEPS.every((step) => isStepAnswered(step, a));
}

/** Index of the first unanswered step (or the last step when all are answered). */
export function firstOpenStep(a: FinderAnswers) {
  const index = STEPS.findIndex((step) => !isStepAnswered(step, a));
  return index === -1 ? STEPS.length - 1 : index;
}
