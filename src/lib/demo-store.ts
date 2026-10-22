/**
 * Browser-only "demo CRM" for the prototype. Leads and analytics events are
 * also kept in this browser, so the /demo page can show what sales and
 * marketing would see, on any deployment (no database needed).
 */

import type { LeadContext, LeadIntent, LeadSource } from "@/lib/leads/schema";
import type { LeadTier } from "@/lib/leads/score";

export interface DemoLead {
  id: string;
  at: string;
  source: LeadSource;
  intent: LeadIntent;
  email: string;
  firstName?: string;
  company?: string;
  role?: string;
  context: LeadContext;
  tier: LeadTier;
  score: number;
  reasons: string[];
}

export interface DemoEvent {
  event: string;
  props: Record<string, unknown>;
  at: string;
}

const LEADS_KEY = "peopleshr-demo-leads";
const EVENTS_KEY = "peopleshr-demo-events";
const MAX_EVENTS = 300;
export const DEMO_UPDATED = "peopleshr:demo-updated";

function read<T>(storage: Storage, key: string): T[] {
  try {
    return JSON.parse(storage.getItem(key) ?? "[]") as T[];
  } catch {
    return [];
  }
}

function write(storage: Storage, key: string, value: unknown) {
  try {
    storage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event(DEMO_UPDATED));
  } catch {
    // Storage blocked or full: the demo view just won't show it.
  }
}

export function saveDemoLead(lead: DemoLead) {
  write(localStorage, LEADS_KEY, [lead, ...read<DemoLead>(localStorage, LEADS_KEY)].slice(0, 50));
}

export function loadDemoLeads(): DemoLead[] {
  return read<DemoLead>(localStorage, LEADS_KEY);
}

export function saveDemoEvent(event: DemoEvent) {
  write(sessionStorage, EVENTS_KEY, [event, ...read<DemoEvent>(sessionStorage, EVENTS_KEY)].slice(0, MAX_EVENTS));
}

export function loadDemoEvents(): DemoEvent[] {
  return read<DemoEvent>(sessionStorage, EVENTS_KEY);
}

export function clearDemoData() {
  try {
    localStorage.removeItem(LEADS_KEY);
    sessionStorage.removeItem(EVENTS_KEY);
    window.dispatchEvent(new Event(DEMO_UPDATED));
  } catch {
    // ignore
  }
}
