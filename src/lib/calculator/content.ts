import type { CorrectionLevel, Method, PayrollFrequency, ProcessId } from "./assumptions";
import type { Verdict } from "./model";

/** Words shown in the calculator. Kept apart from the maths so copy can change freely. */

export const PROCESS_COPY: Record<
  ProcessId,
  { label: string; question: string; module: string; insight: string }
> = {
  payroll: {
    label: "Payroll processing",
    question: "How do you run payroll?",
    module: "PeoplesHR Payroll",
    insight:
      "Pay runs pull in approved leave, attendance and pay changes automatically, so your team reviews exceptions instead of every payslip.",
  },
  corrections: {
    label: "Payroll corrections",
    question: "How often does a payslip need fixing?",
    module: "PeoplesHR Payroll checks",
    insight:
      "Built-in checks flag missing data and unusual changes before a pay run is approved, so fewer mistakes reach employees.",
  },
  leave: {
    label: "Leave and attendance",
    question: "How do you track leave and attendance?",
    module: "PeoplesHR Leave & Attendance",
    insight:
      "Employees request leave from their phone, managers approve in one tap and balances update themselves. Attendance flows straight into payroll.",
  },
  requests: {
    label: "Employee requests",
    question: "How do employees get payslips, letters and answers to HR questions?",
    module: "PeoplesHR Employee Self-Service",
    insight:
      "Employees download payslips, check leave balances and request letters themselves, which removes most routine questions from your inbox.",
  },
  lifecycle: {
    label: "Onboarding and offboarding",
    question: "How do you handle joiners and leavers?",
    module: "PeoplesHR Onboarding",
    insight:
      "New starters complete their own details and documents before day one, and leavers' final settlements are calculated for you.",
  },
  reporting: {
    label: "Reporting and compliance",
    question: "How do you produce statutory and management reports?",
    module: "PeoplesHR Analytics & Compliance",
    insight:
      "Statutory returns and headcount, cost and turnover reports are generated from live data instead of rebuilt in spreadsheets each month.",
  },
};

export const METHOD_OPTIONS: { value: Method; label: string; description: string }[] = [
  { value: "manual", label: "Mostly manual", description: "Spreadsheets, paper or email" },
  { value: "partial", label: "Partly automated", description: "Some software, plenty of workarounds" },
  { value: "automated", label: "Automated", description: "Handled end to end by an HR system" },
];

export const CORRECTION_OPTIONS: { value: CorrectionLevel; label: string; description: string }[] = [
  { value: "rarely", label: "Rarely", description: "Fewer than 1 in 100 payslips" },
  { value: "sometimes", label: "Sometimes", description: "About 2 in 100 payslips" },
  { value: "often", label: "Often", description: "5 or more in 100 payslips" },
];

export const FREQUENCY_OPTIONS: { value: PayrollFrequency; label: string }[] = [
  { value: "monthly", label: "Monthly (12 pay runs)" },
  { value: "semimonthly", label: "Twice a month (24 pay runs)" },
  { value: "biweekly", label: "Every two weeks (26 pay runs)" },
  { value: "weekly", label: "Weekly (52 pay runs)" },
];

export const VERDICT_COPY: Record<Verdict, { badge: string; headline: string; body: string }> = {
  strong: {
    badge: "Strong case",
    headline: "Automating this would pay for itself at least twice over.",
    body: "The admin time you'd get back is worth at least double what an HR system would cost. That's before counting fewer errors and less compliance risk.",
  },
  moderate: {
    badge: "Worth exploring",
    headline: "The time you'd save covers the cost, with some to spare.",
    body: "It pays for itself on admin time alone. The case gets stronger as you grow, add countries or want fewer payroll mistakes.",
  },
  low: {
    badge: "Probably not yet",
    headline: "On admin time alone, new software wouldn't pay for itself yet.",
    body: "That's worth knowing. Your processes may already be in good shape, or your team is small enough that a few process fixes will do more than a new system.",
  },
};
