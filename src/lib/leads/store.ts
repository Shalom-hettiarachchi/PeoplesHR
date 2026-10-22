import type { Lead } from "./schema";
import type { LeadScore } from "./score";

export interface StoredLead extends Omit<Lead, "website"> {
  id: string;
  receivedAt: string;
  score: LeadScore;
}

/**
 * Mock lead store. Keeps leads in memory for the life of the server process.
 * A real build would send these to the CRM (e.g. HubSpot or Salesforce) here.
 */
const globalStore = globalThis as typeof globalThis & { __leads?: StoredLead[] };

export function saveLead(lead: StoredLead) {
  globalStore.__leads ??= [];
  globalStore.__leads.push(lead);
  return lead;
}

export function listLeads(): StoredLead[] {
  return globalStore.__leads ?? [];
}
