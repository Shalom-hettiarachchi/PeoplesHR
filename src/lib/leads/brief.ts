import { PROCESS_COPY, VERDICT_COPY } from "@/lib/calculator/content";
import type { ProcessId } from "@/lib/calculator/assumptions";
import { MODULES, optionLabel, PACKAGES, type ModuleId } from "@/lib/finder/data";
import { CHECKLISTS } from "@/lib/content/checklists";
import { GUIDES } from "@/lib/content/guides";
import type { ChecklistId } from "@/lib/content/types";
import { formatMoney, formatNumber } from "@/lib/format";
import { ROUTES } from "@/lib/site";
import type { LeadContext, LeadIntent, LeadSource } from "./schema";
import type { LeadTier } from "./score";

export interface LeadBrief {
  headline: string;
  facts: { label: string; value: string }[];
  nextAction: string;
  /** How quickly someone should follow up. */
  sla: string;
  /** Opens the tool with the prospect's own answers, so sales sees what they saw. */
  replayHref?: string;
}

const SLA: Record<LeadTier, string> = {
  "sales-ready": "Call within 1 working day",
  warm: "Personal email within 2 working days",
  nurture: "Automated email series",
};

const str = (v: unknown) => (v === undefined || v === null || v === "" ? undefined : String(v));

/** Turns a lead's raw tool answers into the short brief a sales rep would read before calling. */
export function buildBrief(lead: { source: LeadSource; intent: LeadIntent; tier: LeadTier; context: LeadContext }): LeadBrief {
  const c = lead.context;
  const facts: LeadBrief["facts"] = [];
  const add = (label: string, value: string | undefined) => value && facts.push({ label, value });

  if (lead.source === "cost-calculator") {
    const currency = str(c.currency) ?? "USD";
    const saved = Number(c.savedCostPerYear ?? 0);
    const verdict = str(c.verdict) as keyof typeof VERDICT_COPY | undefined;
    const process = str(c.biggestOpportunity) as ProcessId | undefined;
    const processLabel = process && process in PROCESS_COPY ? PROCESS_COPY[process].label.toLowerCase() : undefined;

    add("Employees", str(c.employees));
    add("Countries", str(c.entities));
    add("Could recover", `${formatMoney(saved, currency)} a year (${formatNumber(Number(c.savedHoursPerYear ?? 0))} hours)`);
    add("Verdict", verdict ? VERDICT_COPY[verdict].badge : undefined);
    add("Biggest opportunity", processLabel);

    return {
      headline: `Could recover ${formatMoney(saved, currency)} a year${processLabel ? `, mostly in ${processLabel}` : ""}`,
      facts,
      sla: SLA[lead.tier],
      nextAction:
        lead.tier === "sales-ready"
          ? `Open with their biggest opportunity${processLabel ? ` (${processLabel})` : ""} and walk through their own numbers.`
          : lead.tier === "warm"
            ? "Send the report with a short case study from a similar-sized company, and offer a 20-minute walkthrough."
            : "Add to the payroll tips series. Re-score if they come back to a tool.",
      replayHref: str(c.scenario) ? `${ROUTES.calculator}?${c.scenario}` : undefined,
    };
  }

  if (lead.source === "software-finder") {
    const pkg = PACKAGES.find((p) => p.id === c.recommendedPackage);
    const addOns = (str(c.addOns)?.split(",") ?? []).filter((m): m is ModuleId => m in MODULES);
    const challenges = (str(c.challenges)?.split(",") ?? []).map((ch) => optionLabel("challenges", ch));
    const timeline = str(c.timeline);

    add("Team size", str(c.sizeBand) ? `${optionLabel("size", String(c.sizeBand))} employees` : undefined);
    add("Countries", str(c.countries) ? optionLabel("countries", String(c.countries)) : undefined);
    add("Industry", str(c.industry) ? optionLabel("industry", String(c.industry)) : undefined);
    add("Today", str(c.currentTools) ? optionLabel("tools", String(c.currentTools)) : undefined);
    add("Main problems", challenges.join("; ") || undefined);
    add("Timeline", timeline ? optionLabel("timeline", timeline) : undefined);
    add("Recommended", pkg ? `${pkg.name}${addOns.length ? ` + ${addOns.map((m) => MODULES[m].name).join(", ")}` : ""} (${str(c.match) ?? "?"}% match)` : undefined);

    return {
      headline: `Recommended ${pkg?.name ?? "a package"}${timeline ? `, ${optionLabel("timeline", timeline).toLowerCase()}` : ""}`,
      facts,
      sla: SLA[lead.tier],
      nextAction:
        lead.intent === "demo" || lead.tier === "sales-ready"
          ? `Run a demo of ${pkg?.name ?? "the recommended package"} focused on: ${challenges.slice(0, 2).join(" and ").toLowerCase() || "their answers"}.`
          : "Send the recommendation with indicative pricing, and offer a demo when they're ready to shortlist.",
      replayHref: str(c.answers) ? `${ROUTES.finder}?${c.answers}` : undefined,
    };
  }

  const checklist = str(c.checklist) as ChecklistId | undefined;
  const guide = GUIDES.find((g) => g.slug === c.guide);
  add("Downloaded", checklist && checklist in CHECKLISTS ? CHECKLISTS[checklist].title : undefined);
  add("While reading", guide?.title);

  return {
    headline: `Unlocked the ${checklist && checklist in CHECKLISTS ? CHECKLISTS[checklist].title.toLowerCase() : "checklist"}`,
    facts,
    sla: SLA[lead.tier],
    nextAction: "Send the printable checklist, then a related guide and an invitation to try the cost calculator.",
    replayHref: guide ? `/resources/${guide.slug}` : undefined,
  };
}
