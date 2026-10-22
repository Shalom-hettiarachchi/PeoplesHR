import type { Lead } from "./schema";

export type LeadTier = "sales-ready" | "warm" | "nurture";

export interface LeadScore {
  score: number;
  tier: LeadTier;
  reasons: string[];
}

const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "icloud.com",
  "live.com",
]);

/**
 * Simple, explainable lead score. In production this would feed CRM routing:
 * "sales-ready" goes to a rep within a day, "warm" gets a tailored follow-up,
 * "nurture" joins an email sequence.
 */
export function scoreLead(lead: Pick<Lead, "email" | "intent" | "role" | "context">): LeadScore {
  let score = 0;
  const reasons: string[] = [];
  const add = (points: number, reason: string) => {
    score += points;
    reasons.push(`${points > 0 ? "+" : ""}${points} ${reason}`);
  };

  if (lead.intent === "demo") add(40, "asked for a demo");
  else if (lead.intent === "report") add(20, "asked for their report");
  else add(10, "downloaded a resource");

  const employees = Number(lead.context.employees);
  if (employees >= 200) add(25, "200+ employees");
  else if (employees >= 50) add(15, "50-199 employees");
  else if (employees >= 10) add(5, "10-49 employees");

  if (lead.context.verdict === "strong") add(20, "strong savings case");
  else if (lead.context.verdict === "moderate") add(10, "moderate savings case");

  if (lead.context.timeline === "0-3") add(20, "buying within 3 months");
  else if (lead.context.timeline === "3-6") add(10, "buying within 6 months");

  if (lead.role && ["hr-lead", "finance", "owner"].includes(lead.role)) add(10, "decision-maker role");

  const domain = lead.email.split("@")[1]?.toLowerCase() ?? "";
  if (FREE_EMAIL_DOMAINS.has(domain)) add(-15, "personal email address");

  const tier: LeadTier = score >= 60 ? "sales-ready" : score >= 35 ? "warm" : "nurture";
  return { score, tier, reasons };
}
