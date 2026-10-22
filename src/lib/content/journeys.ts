import { ROUTES } from "@/lib/site";
import type { Role } from "./types";
import { guidePath } from "./utils";

/** "Start here" paths: a question to read, a tool to try, then a decision. */
export const JOURNEYS: { role: Role; title: string; intro: string; steps: { label: string; href: string; kind: "Guide" | "Tool" }[] }[] = [
  {
    role: "finance",
    title: "I look after payroll",
    intro: "Cut corrections and late changes, then see what fixing them is worth.",
    steps: [
      { kind: "Guide", label: "How to reduce payroll errors", href: guidePath("how-to-reduce-payroll-errors") },
      { kind: "Tool", label: "HR admin cost calculator", href: ROUTES.calculator },
      { kind: "Tool", label: "Find the right package", href: ROUTES.finder },
    ],
  },
  {
    role: "hr",
    title: "I run HR or people ops",
    intro: "Get leave under control and free your team from routine questions.",
    steps: [
      { kind: "Guide", label: "How to track employee leave", href: guidePath("how-to-track-employee-leave") },
      { kind: "Guide", label: "How to reduce payroll errors", href: guidePath("how-to-reduce-payroll-errors") },
      { kind: "Tool", label: "Find the right package", href: ROUTES.finder },
    ],
  },
  {
    role: "owner",
    title: "I run the business",
    intro: "Understand what HR admin costs you, and what changes as you grow abroad.",
    steps: [
      { kind: "Tool", label: "HR admin cost calculator", href: ROUTES.calculator },
      { kind: "Guide", label: "Paying employees in another country", href: guidePath("multi-country-payroll-guide") },
      { kind: "Tool", label: "Find the right package", href: ROUTES.finder },
    ],
  },
];
