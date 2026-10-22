/**
 * Packages, modules and questions for the HR software finder.
 * Packages and prices are illustrative for this prototype (the brief allows
 * invented plans). Change the offer here; the logic and UI read from it.
 */

export type ModuleId =
  | "core-hr"
  | "leave"
  | "self-service"
  | "payroll"
  | "compliance"
  | "workflows"
  | "onboarding"
  | "recruitment"
  | "performance"
  | "learning"
  | "multi-country"
  | "analytics"
  | "integrations";

export const MODULES: Record<ModuleId, { name: string; summary: string }> = {
  "core-hr": { name: "Core HR and employee records", summary: "One place for every employee's details, contracts and documents" },
  leave: { name: "Leave, attendance and shifts", summary: "Leave requests, approvals, balances, clock-ins and rosters" },
  "self-service": { name: "Employee self-service app", summary: "Payslips, leave and HR requests from any phone" },
  payroll: { name: "Payroll", summary: "Pay runs, payslips, deductions and bank files" },
  compliance: { name: "Statutory compliance and filings", summary: "Tax, social security and labour reports ready to submit" },
  workflows: { name: "Approval workflows", summary: "Multi-step approvals for changes, expenses and requests" },
  onboarding: { name: "Onboarding and offboarding", summary: "Checklists, e-signatures and final settlements" },
  recruitment: { name: "Recruitment", summary: "Job posts, applicant tracking and interview scheduling" },
  performance: { name: "Performance and goals", summary: "Reviews, goals and continuous feedback" },
  learning: { name: "Learning and training", summary: "Courses, certifications and training records" },
  "multi-country": { name: "Multi-country payroll", summary: "Separate entities, currencies and local rules in one system" },
  analytics: { name: "Advanced HR analytics", summary: "Dashboards for headcount, cost, turnover and absence" },
  integrations: { name: "Integrations and open API", summary: "Connect accounting, ERP, banking and other tools" },
};

export type PackageId = "essentials" | "payroll-plus" | "talent" | "enterprise";
export type SizeBand = "1-20" | "21-50" | "51-200" | "201-500" | "500+";
export type CountriesBand = "1" | "2-3" | "4+";

export interface Package {
  id: PackageId;
  name: string;
  tagline: string;
  bestFor: string;
  includes: ModuleId[];
  addOns: ModuleId[];
  /** Smallest and largest company size the package is designed for. */
  minSize?: SizeBand;
  maxSize: SizeBand;
  maxCountries: CountriesBand;
  /** Illustrative USD price per employee per month. null = custom pricing. */
  priceFrom: number | null;
}

const CORE: ModuleId[] = ["core-hr", "leave", "self-service"];

/** Ordered smallest to largest; the finder recommends the smallest package that fits. */
export const PACKAGES: Package[] = [
  {
    id: "essentials",
    name: "Essentials",
    tagline: "Get HR out of spreadsheets",
    bestFor: "Small teams that need clean records, leave tracking and a self-service app",
    includes: [...CORE],
    addOns: ["onboarding", "integrations"],
    maxSize: "21-50",
    maxCountries: "1",
    priceFrom: 2.5,
  },
  {
    id: "payroll-plus",
    name: "Payroll Plus",
    tagline: "HR and payroll, done right every month",
    bestFor: "Growing businesses whose biggest headache is payroll and compliance",
    includes: [...CORE, "payroll", "compliance", "workflows"],
    addOns: ["onboarding", "multi-country", "integrations", "analytics"],
    maxSize: "201-500",
    maxCountries: "2-3",
    priceFrom: 4,
  },
  {
    id: "talent",
    name: "Talent Suite",
    tagline: "Hire, grow and keep good people",
    bestFor: "Companies hiring fast or focused on retention, with payroll included",
    includes: [...CORE, "payroll", "compliance", "workflows", "onboarding", "recruitment", "performance"],
    addOns: ["learning", "multi-country", "integrations", "analytics"],
    maxSize: "201-500",
    maxCountries: "2-3",
    priceFrom: 6.5,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "Every module, every country",
    bestFor: "Large or multi-country organisations that need everything connected",
    includes: Object.keys(MODULES) as ModuleId[],
    addOns: [],
    minSize: "201-500",
    maxSize: "500+",
    maxCountries: "4+",
    priceFrom: null,
  },
];

export const SIZE_ORDER: SizeBand[] = ["1-20", "21-50", "51-200", "201-500", "500+"];
export const COUNTRY_ORDER: CountriesBand[] = ["1", "2-3", "4+"];

/** Typical headcount for each band, used to prefill the cost calculator and score leads. */
export const SIZE_MIDPOINT: Record<SizeBand, number> = {
  "1-20": 12,
  "21-50": 35,
  "51-200": 120,
  "201-500": 330,
  "500+": 800,
};

export type Industry = "retail" | "manufacturing" | "services" | "healthcare" | "finance" | "other";
export type CurrentTools = "spreadsheets" | "payroll-only" | "legacy-hrms" | "outsourced";
export type Challenge = "payroll" | "time" | "requests" | "hiring" | "retention" | "compliance" | "reporting" | "global";
export type MustHave = "mobile" | "integrations" | "approvals";
export type Timeline = "0-3" | "3-6" | "research";

export interface FinderAnswers {
  size?: SizeBand;
  countries?: CountriesBand;
  industry?: Industry;
  tools?: CurrentTools;
  challenges: Challenge[];
  /** undefined = not answered yet, [] = answered "none of these". */
  mustHaves?: MustHave[];
  timeline?: Timeline;
}

export const EMPTY_ANSWERS: FinderAnswers = { challenges: [] };

interface Option<T extends string> {
  value: T;
  label: string;
  description?: string;
}

interface StepBase {
  title: string;
  help?: string;
}

export type Step =
  | (StepBase & { id: "size"; kind: "single"; options: Option<SizeBand>[] })
  | (StepBase & { id: "countries"; kind: "single"; options: Option<CountriesBand>[] })
  | (StepBase & { id: "industry"; kind: "single"; options: Option<Industry>[] })
  | (StepBase & { id: "tools"; kind: "single"; options: Option<CurrentTools>[] })
  | (StepBase & { id: "challenges"; kind: "multi"; max: number; options: Option<Challenge>[] })
  | (StepBase & { id: "mustHaves"; kind: "multi"; max: number; options: Option<MustHave>[] })
  | (StepBase & { id: "timeline"; kind: "single"; options: Option<Timeline>[] });

export const STEPS: Step[] = [
  {
    id: "size",
    kind: "single",
    title: "How many people do you employ?",
    options: [
      { value: "1-20", label: "1–20" },
      { value: "21-50", label: "21–50" },
      { value: "51-200", label: "51–200" },
      { value: "201-500", label: "201–500" },
      { value: "500+", label: "More than 500" },
    ],
  },
  {
    id: "countries",
    kind: "single",
    title: "How many countries do you pay people in?",
    help: "Count each country where you have employees on payroll.",
    options: [
      { value: "1", label: "Just one" },
      { value: "2-3", label: "2 or 3" },
      { value: "4+", label: "4 or more" },
    ],
  },
  {
    id: "industry",
    kind: "single",
    title: "Which best describes your business?",
    help: "This helps us spot needs like shift work or strict regulation.",
    options: [
      { value: "retail", label: "Retail, hospitality or leisure", description: "Shift-based teams" },
      { value: "manufacturing", label: "Manufacturing or logistics", description: "Plants, warehouses, field teams" },
      { value: "services", label: "Professional services or tech", description: "Office or remote teams" },
      { value: "healthcare", label: "Healthcare", description: "Clinics, hospitals, care" },
      { value: "finance", label: "Banking, finance or insurance", description: "Highly regulated" },
      { value: "other", label: "Something else" },
    ],
  },
  {
    id: "tools",
    kind: "single",
    title: "How do you manage HR and payroll today?",
    options: [
      { value: "spreadsheets", label: "Spreadsheets and paper", description: "Including email and shared drives" },
      { value: "payroll-only", label: "A payroll tool, plus spreadsheets", description: "HR records live elsewhere" },
      { value: "legacy-hrms", label: "An older HR system", description: "Hard to use or no longer fits" },
      { value: "outsourced", label: "We outsource payroll", description: "An accountant or bureau runs it" },
    ],
  },
  {
    id: "challenges",
    kind: "multi",
    max: 3,
    title: "What's causing the most trouble right now?",
    help: "Pick up to three. These shape the recommendation most.",
    options: [
      { value: "payroll", label: "Payroll takes too long or has errors" },
      { value: "time", label: "Tracking leave, attendance and shifts" },
      { value: "requests", label: "Too many routine employee questions" },
      { value: "hiring", label: "Hiring and onboarding new people" },
      { value: "retention", label: "Keeping and developing good people" },
      { value: "compliance", label: "Keeping up with labour and tax rules" },
      { value: "reporting", label: "Getting reliable HR reports" },
      { value: "global", label: "Managing teams across countries" },
    ],
  },
  {
    id: "mustHaves",
    kind: "multi",
    max: 3,
    title: "Anything you can't do without?",
    help: "Optional. Skip if none of these matter yet.",
    options: [
      { value: "mobile", label: "A mobile app for employees" },
      { value: "integrations", label: "Connects to our accounting or ERP" },
      { value: "approvals", label: "Multi-step approvals" },
    ],
  },
  {
    id: "timeline",
    kind: "single",
    title: "When are you hoping to have something in place?",
    options: [
      { value: "0-3", label: "Within 3 months", description: "We're actively choosing" },
      { value: "3-6", label: "In 3 to 6 months", description: "Planning ahead" },
      { value: "research", label: "Just researching", description: "No timeline yet" },
    ],
  },
];

/** How each answer translates into module needs (weights add up; 3+ means "must have"). */
export const CHALLENGE_NEEDS: Record<Challenge, Partial<Record<ModuleId, number>>> = {
  payroll: { payroll: 3, compliance: 1 },
  time: { leave: 3, workflows: 1 },
  requests: { "self-service": 3 },
  hiring: { recruitment: 3, onboarding: 3 },
  retention: { performance: 3, learning: 2 },
  compliance: { compliance: 3, payroll: 2 },
  reporting: { analytics: 3 },
  global: { "multi-country": 3, payroll: 2 },
};

export const MUST_HAVE_NEEDS: Record<MustHave, ModuleId> = {
  mobile: "self-service",
  integrations: "integrations",
  approvals: "workflows",
};

export function optionLabel(stepId: Step["id"], value: string) {
  const step = STEPS.find((s) => s.id === stepId);
  return (step?.options as Option<string>[] | undefined)?.find((o) => o.value === value)?.label ?? value;
}
