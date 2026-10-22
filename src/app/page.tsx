import Link from "next/link";
import type { Metadata } from "next";
import { ROUTES } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "PeoplesHR | Free HR tools and guides" },
  description:
    "Work out what manual HR admin costs you, find the HR software package that fits, and get practical guides from PeoplesHR.",
  alternates: { canonical: "/" },
};

const EXPERIENCES = [
  {
    challenge: "Challenge 01",
    title: "HR admin cost calculator",
    body: "Put a number on the hours and money lost to manual payroll, leave and paperwork, and see whether fixing it is worth it.",
    href: ROUTES.calculator,
    stage: "Problem awareness",
    ready: true,
  },
  {
    challenge: "Challenge 02",
    title: "HR software finder",
    body: "Answer a few questions about your team and get a package recommendation with the modules you need, and the ones you don't.",
    href: ROUTES.finder,
    stage: "Comparing options",
    ready: true,
  },
  {
    challenge: "Challenge 05",
    title: "Guides that lead somewhere",
    body: "Answer-first HR and payroll guides, built for search and AI discovery, that connect each question to the right tool or next step.",
    href: ROUTES.resources,
    stage: "Research",
    ready: false,
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <section className="py-16 sm:py-24">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
          PeoplesHR experience prototypes
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight text-ink-950 sm:text-5xl">
          Help visitors understand their HR problem before asking them to talk to sales.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-ink-500">
          Three connected experiences, one for each stage of the buying journey. Each one gives the
          visitor something useful first, then offers a next step that fits where they are.
        </p>
      </section>

      <ul className="grid gap-5 md:grid-cols-3">
        {EXPERIENCES.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="group flex h-full flex-col rounded-2xl border border-ink-200 bg-white p-6 shadow-card transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lift"
            >
              <span className="flex items-center justify-between text-xs font-semibold">
                <span className="text-brand-600">{item.challenge}</span>
                <span className="rounded-full bg-ink-100 px-2.5 py-1 text-ink-700">{item.stage}</span>
              </span>
              <h2 className="mt-4 text-xl font-bold text-ink-950">{item.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">{item.body}</p>
              <span className="mt-6 text-sm font-semibold text-brand-700 group-hover:underline">
                {item.ready ? "Open prototype →" : "In progress →"}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
