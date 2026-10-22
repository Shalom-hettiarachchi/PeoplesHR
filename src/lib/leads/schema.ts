import { z } from "zod";

/** Shared by the browser form and the API route so both validate the same way. */

export const LEAD_SOURCES = ["cost-calculator", "software-finder", "content-hub"] as const;
export const LEAD_INTENTS = ["report", "demo", "checklist"] as const;

export const ROLES = [
  { value: "hr", label: "HR / People team" },
  { value: "hr-lead", label: "Head of HR / People" },
  { value: "finance", label: "Finance / Payroll" },
  { value: "owner", label: "Founder / Managing director" },
  { value: "operations", label: "Operations" },
  { value: "other", label: "Something else" },
] as const;

const roleValues = ROLES.map((r) => r.value) as [string, ...string[]];

export const leadSchema = z.object({
  email: z.email({ error: "Enter a valid email address, like name@company.com" }),
  firstName: z.string().trim().max(80).optional(),
  company: z.string().trim().max(120).optional(),
  role: z.enum(roleValues).optional(),
  marketingConsent: z.boolean().default(false),
  source: z.enum(LEAD_SOURCES),
  intent: z.enum(LEAD_INTENTS),
  /** What the visitor told the tool. Sales sees this so nobody repeats questions. */
  context: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).default({}),
  /** Honeypot: hidden from people, bots tend to fill it in. */
  website: z.string().optional(),
});

export type LeadInput = z.input<typeof leadSchema>;
export type Lead = z.output<typeof leadSchema>;
export type LeadSource = (typeof LEAD_SOURCES)[number];
export type LeadIntent = (typeof LEAD_INTENTS)[number];
export type LeadContext = Lead["context"];
