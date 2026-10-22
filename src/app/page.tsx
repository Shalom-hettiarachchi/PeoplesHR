import Link from "next/link";
import type { Metadata } from "next";
import { ROUTES } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "PeoplesHR | Free HR tools and guides" },
  description:
    "Work out what manual HR admin costs you, find the HR software package that fits, and get practical guides from PeoplesHR.",
  alternates: { canonical: "/" },
};

/** Ordered the way a typical buyer moves: a question, then the cost, then the choice. */
const EXPERIENCES = [
  {
    challenge: "Challenge 05",
    stage: "1 · Research",
    title: "Guides that lead somewhere",
    body: "Answer-first HR and payroll guides, built for search and AI discovery, with embedded calculators and a free checklist that connect each question to a next step.",
    href: ROUTES.resources,
    outcome: "Checklist download",
  },
  {
    challenge: "Challenge 01",
    stage: "2 · Problem awareness",
    title: "HR admin cost calculator",
    body: "Put a number on the hours and money lost to manual payroll, leave and paperwork, and get an honest verdict on whether fixing it is worth it.",
    href: ROUTES.calculator,
    outcome: "Report or demo request",
  },
  {
    challenge: "Challenge 02",
    stage: "3 · Comparing options",
    title: "HR software finder",
    body: "Seven questions lead to a package recommendation, with the modules you need, the ones you don't, and the reasons behind each.",
    href: ROUTES.finder,
    outcome: "Demo or recommendation email",
  },
];

const PRINCIPLES = [
  {
    title: "Useful before it asks for anything",
    body: "Every tool gives a full answer without sign-up. Email is only asked for in return for something extra: a report, a checklist, a tailored demo.",
  },
  {
    title: "Honest, so it's trusted",
    body: "The calculator says when software isn't worth it, and the finder says what you don't need. Every assumption is shown.",
  },
  {
    title: "The next step fits the visitor",
    body: "Ready to buy: book a demo. Still researching: estimate the cost first. Answers carry across tools, so nobody types them twice.",
  },
  {
    title: "Sales starts with context",
    body: "Each lead arrives scored, summarised and linked to exactly what the visitor saw, so the first call is about their situation.",
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <section className="py-16 sm:py-24">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">PeoplesHR experience prototypes</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight text-ink-950 sm:text-5xl">
          Help visitors understand their HR problem before asking them to talk to sales.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-ink-500">
          Three connected experiences, one for each stage of the buying journey. Each one gives the visitor something
          useful first, then offers a next step that fits where they are.
        </p>
      </section>

      <ol className="grid gap-5 md:grid-cols-3">
        {EXPERIENCES.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="group flex h-full flex-col rounded-2xl border border-ink-200 bg-white p-6 shadow-card transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lift"
            >
              <span className="flex items-center justify-between gap-2 text-xs font-semibold">
                <span className="rounded-full bg-brand-50 px-2.5 py-1 text-brand-700">{item.stage}</span>
                <span className="text-ink-500">{item.challenge}</span>
              </span>
              <h2 className="mt-4 text-xl font-bold text-ink-950 group-hover:text-brand-700">{item.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">{item.body}</p>
              <span className="mt-5 border-t border-ink-100 pt-4 text-xs text-ink-500">
                Converts to: <span className="font-semibold text-ink-900">{item.outcome}</span>
              </span>
              <span className="mt-3 text-sm font-semibold text-brand-700">Open →</span>
            </Link>
          </li>
        ))}
      </ol>

      <section aria-labelledby="principles-heading" className="mt-20">
        <h2 id="principles-heading" className="text-2xl font-bold tracking-tight text-ink-950">
          The thinking behind them
        </h2>
        <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PRINCIPLES.map((p) => (
            <li key={p.title} className="rounded-2xl bg-white p-5 ring-1 ring-ink-200">
              <h3 className="font-bold text-ink-950">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{p.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 flex flex-col gap-4 rounded-3xl bg-brand-900 p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <h2 className="text-xl font-bold">See what sales and marketing would see</h2>
          <p className="mt-1 text-brand-100">
            Request a report or demo in any tool, then open the behind-the-scenes view: scored leads, a funnel and content gaps.
          </p>
        </div>
        <Link href="/demo" className="inline-flex h-11 shrink-0 items-center rounded-full bg-white px-5 text-sm font-semibold text-brand-900 hover:bg-brand-50">
          Behind the scenes →
        </Link>
      </section>
    </div>
  );
}
