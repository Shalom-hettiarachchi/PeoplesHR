import type { ModuleId } from "@/lib/finder/data";

export type Topic = "payroll" | "leave" | "compliance";
export type Stage = "problem" | "solution" | "ready";
export type Role = "hr" | "finance" | "owner";
export type ChecklistId = "payroll-accuracy" | "leave-policy" | "hr-software-buyers";
export type ToolEmbed = "corrections-estimator" | "leave-estimator" | "finder";

export const TOPICS: Record<Topic, string> = {
  payroll: "Payroll",
  leave: "Leave and attendance",
  compliance: "Multi-country and compliance",
};

export const STAGES: Record<Stage, string> = {
  problem: "Understanding the problem",
  solution: "Comparing solutions",
  ready: "Ready to act",
};

export const ROLES: Record<Role, string> = {
  hr: "HR and people teams",
  finance: "Finance and payroll",
  owner: "Founders and managers",
};

/**
 * Inline text supports **bold** and [links](/path) so guides can link to each
 * other and to tools (internal linking matters for search and for visitors).
 */
export type Block =
  | { type: "p"; text: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "steps"; items: { title: string; text: string }[] }
  | { type: "callout"; tone: "tip" | "warning"; title: string; text: string }
  | { type: "table"; caption: string; head: string[]; rows: string[][] }
  | { type: "tool"; tool: ToolEmbed }
  | { type: "checklist"; checklist: ChecklistId };

export interface Section {
  /** Becomes the anchor, so links to a specific question keep working. */
  id: string;
  /** Written as the question a reader would ask. */
  heading: string;
  blocks: Block[];
}

export interface Guide {
  slug: string;
  title: string;
  description: string;
  topic: Topic;
  stage: Stage;
  roles: Role[];
  published: string;
  updated: string;
  /** Two or three sentences that answer the title on their own (for readers, search snippets and AI answers). */
  quickAnswer: string;
  takeaways: string[];
  sections: Section[];
  faq: { q: string; a: string }[];
  productTieIn: { heading: string; text: string; modules: ModuleId[] };
  related: string[];
  /** Messages for the floating prompt as the reader scrolls. */
  scrollCta: { label: string; href: string }[];
}

export interface Checklist {
  id: ChecklistId;
  title: string;
  pitch: string;
  items: { text: string; detail: string }[];
}
