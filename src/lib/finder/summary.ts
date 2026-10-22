import { optionLabel, type FinderAnswers, type Step } from "./data";

/** One-line, human-readable summary of an answered step. */
export function summarise(step: Step, a: FinderAnswers): string {
  switch (step.id) {
    case "size":
      return `${optionLabel("size", a.size!)} employees`;
    case "countries":
      return `${optionLabel("countries", a.countries!)} ${a.countries === "1" ? "country" : "countries"}`;
    case "challenges":
      return a.challenges.map((c) => optionLabel("challenges", c)).join("; ");
    case "mustHaves":
      return a.mustHaves?.length ? a.mustHaves.map((m) => optionLabel("mustHaves", m)).join("; ") : "No must-haves";
    default:
      return optionLabel(step.id, a[step.id] as string);
  }
}
