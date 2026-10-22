import {
  CHALLENGE_NEEDS,
  COUNTRY_ORDER,
  MUST_HAVE_NEEDS,
  optionLabel,
  PACKAGES,
  SIZE_ORDER,
  type FinderAnswers,
  type ModuleId,
  type Package,
} from "./data";

/** A weight of 3 or more means the visitor can't do without this module. */
export const MUST_WEIGHT = 3;
/** Most add-ons we'll suggest before stepping up to a bigger package instead. */
export const MAX_ADD_ONS = 2;
const CORE: ModuleId[] = ["core-hr", "leave", "self-service"];

export interface Need {
  module: ModuleId;
  weight: number;
  reasons: string[];
}

export interface PackageMatch {
  pkg: Package;
  /** 0-100: how well the package covers the needs without paying for extras. */
  match: number;
  addOns: ModuleId[];
  /** Must-have modules this package can't provide even with add-ons. */
  missing: ModuleId[];
  fitsSize: boolean;
}

export interface Recommendation {
  recommended: PackageMatch;
  matches: PackageMatch[];
  /** Every need, strongest first. */
  needs: Need[];
  /** Modules the next package up would add that the visitor doesn't need. */
  whyNotBigger: { pkg: Package; unneeded: ModuleId[] } | null;
}

/** Turns answers into weighted module needs, remembering why each was added. */
export function computeNeeds(answers: FinderAnswers): Need[] {
  const needs = new Map<ModuleId, Need>();
  const add = (module: ModuleId, weight: number, reason: string) => {
    const need = needs.get(module) ?? { module, weight: 0, reasons: [] };
    need.weight += weight;
    if (!need.reasons.includes(reason)) need.reasons.push(reason);
    needs.set(module, need);
  };

  for (const challenge of answers.challenges) {
    const reason = `You said: “${optionLabel("challenges", challenge)}”`;
    for (const [module, weight] of Object.entries(CHALLENGE_NEEDS[challenge])) {
      add(module as ModuleId, weight, reason);
    }
  }

  for (const must of answers.mustHaves ?? []) {
    add(MUST_HAVE_NEEDS[must], MUST_WEIGHT, `You need ${optionLabel("mustHaves", must).replace(/^A /, "a ").toLowerCase()}`);
  }

  switch (answers.tools) {
    case "spreadsheets":
      add("payroll", 3, "You run payroll in spreadsheets today");
      break;
    case "legacy-hrms":
      add("payroll", 2, "Replacing an older system usually includes payroll");
      break;
    case "payroll-only":
      add("payroll", 1, "You could keep your payroll tool or bring payroll in-house");
      break;
    case "outsourced":
      add("payroll", 1, "Your payroll is outsourced, so this is optional");
      break;
  }

  if (answers.countries === "2-3") add("multi-country", 3, "You pay people in 2 or 3 countries");
  if (answers.countries === "4+") add("multi-country", 4, "You pay people in 4 or more countries");

  if (answers.size === "201-500") {
    add("workflows", 1, "Teams of 200+ usually need approval chains");
    add("analytics", 1, "At 200+ people, reporting needs grow");
  }
  if (answers.size === "500+") {
    add("workflows", 2, "Teams of 500+ need structured approvals");
    add("analytics", 2, "At 500+ people, leaders expect live dashboards");
    add("integrations", 2, "Larger organisations connect HR to finance and ERP");
  }

  if (answers.industry && ["retail", "manufacturing", "healthcare"].includes(answers.industry)) {
    add("leave", 2, "Shift-based teams need reliable attendance tracking");
  }
  if (answers.industry === "healthcare" || answers.industry === "finance") {
    add("compliance", 2, "Regulated industries face stricter reporting");
  }

  return [...needs.values()].sort((a, b) => b.weight - a.weight);
}

function withinSize(pkg: Package, answers: FinderAnswers) {
  const size = answers.size ? SIZE_ORDER.indexOf(answers.size) : -1;
  // Minimum sizes don't apply when many countries force a bigger package anyway.
  const bigEnough = !pkg.minSize || size === -1 || answers.countries === "4+" || size >= SIZE_ORDER.indexOf(pkg.minSize);
  const sizeOk = bigEnough && (size === -1 || size <= SIZE_ORDER.indexOf(pkg.maxSize));
  const countriesOk =
    !answers.countries || COUNTRY_ORDER.indexOf(answers.countries) <= COUNTRY_ORDER.indexOf(pkg.maxCountries);
  return sizeOk && countriesOk;
}

/** Nice-to-haves count for half, so they can't outweigh real needs. */
const effective = (n: Need) => (n.weight >= MUST_WEIGHT ? n.weight : n.weight * 0.5);
/** Match points lost for each included module the visitor doesn't really need (capped). */
const UNNEEDED_PENALTY = 5;
const MAX_UNNEEDED_PENALTY = 25;

export function scorePackage(pkg: Package, needs: Need[], answers: FinderAnswers): PackageMatch {
  const total = needs.reduce((sum, n) => sum + effective(n), 0);
  let covered = 0;
  const addOns: ModuleId[] = [];
  const missing: ModuleId[] = [];

  for (const need of needs) {
    if (pkg.includes.includes(need.module)) {
      covered += effective(need);
    } else if (pkg.addOns.includes(need.module)) {
      covered += effective(need) * 0.75;
      if (need.weight >= MUST_WEIGHT) addOns.push(need.module);
    } else if (need.weight >= MUST_WEIGHT) {
      missing.push(need.module);
    }
  }

  // Penalise paying for modules that aren't must-haves.
  const musts = new Set(needs.filter((n) => n.weight >= MUST_WEIGHT).map((n) => n.module));
  const unneeded = pkg.includes.filter((m) => !CORE.includes(m) && !musts.has(m)).length;

  const fitsSize = withinSize(pkg, answers);
  let match =
    (total === 0 ? 100 : (covered / total) * 100) - Math.min(MAX_UNNEEDED_PENALTY, unneeded * UNNEEDED_PENALTY);
  if (!fitsSize) match = Math.min(match, 60);

  return { pkg, match: Math.round(Math.max(0, Math.min(100, match))), addOns, missing, fitsSize };
}

/**
 * Recommends the smallest package that covers every must-have (allowing up to
 * two add-ons) and suits the company's size and countries.
 */
export function recommend(answers: FinderAnswers): Recommendation {
  const needs = computeNeeds(answers);
  const matches = PACKAGES.map((pkg) => scorePackage(pkg, needs, answers));

  const recommended =
    matches.find((m) => m.fitsSize && m.missing.length === 0 && m.addOns.length <= MAX_ADD_ONS) ??
    matches[matches.length - 1];

  const next = PACKAGES[PACKAGES.indexOf(recommended.pkg) + 1];
  const neededModules = new Set(needs.filter((n) => n.weight >= MUST_WEIGHT).map((n) => n.module));
  const unneeded = next
    ? next.includes.filter((m) => !recommended.pkg.includes.includes(m) && !neededModules.has(m))
    : [];

  return {
    recommended,
    matches,
    needs,
    whyNotBigger: next && unneeded.length > 0 ? { pkg: next, unneeded } : null,
  };
}
