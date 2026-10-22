import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ROUTES } from "@/lib/site";
import { calculate, defaultInputs } from "@/lib/calculator/model";
import { PROCESS_COPY, VERDICT_COPY } from "@/lib/calculator/content";
import { recommend } from "@/lib/finder/recommend";
import { MODULES } from "@/lib/finder/data";
import { GUIDES } from "@/lib/content/guides";
import { readingMinutes } from "@/lib/content/utils";
import { formatMoney, formatNumber } from "@/lib/format";
import { ButtonLink } from "@/components/ui/button";
import {
  IconArrowRight,
  IconBook,
  IconBulb,
  IconCalculator,
  IconCheck,
  IconEye,
  IconSignpost,
  IconTarget,
  IconUsers,
} from "@/components/icons";

export const metadata: Metadata = {
  title: { absolute: "PeoplesHR | Free HR tools and guides" },
  description:
    "Work out what manual HR admin costs you, find the HR software package that fits, and get practical guides from PeoplesHR.",
  alternates: { canonical: "/" },
};

// The preview cards show real output from the same models the tools use.
const calc = calculate(defaultInputs("USD"));
const calcBars = [...calc.processes].sort((a, b) => b.currentHours - a.currentHours).slice(0, 4);
const barMax = Math.max(...calcBars.map((p) => p.currentHours));
const finder = recommend({
  size: "51-200",
  countries: "1",
  industry: "retail",
  tools: "spreadsheets",
  challenges: ["payroll", "time"],
  mustHaves: [],
  timeline: "0-3",
});
const guide = GUIDES[0];

/** Ordered the way a typical buyer moves: a question, then the cost, then the choice. */
const JOURNEY = [
  {
    step: "Researching",
    challenge: "Challenge 05",
    title: "Answer-first guides",
    body: "Plain-English answers to everyday payroll and HR questions, built to be found on Google and quoted by AI assistants.",
    gets: "A quick answer, a mini calculator and a free checklist",
    then: "Their numbers carry into the full calculator",
    href: ROUTES.resources,
    cta: "Browse the guides",
    icon: <IconBook />,
    tint: "bg-mint-50 text-mint-700 ring-mint-100",
  },
  {
    step: "Sizing the problem",
    challenge: "Challenge 01",
    title: "HR admin cost calculator",
    body: "Ten quick questions put a number on the hours and money lost to manual payroll, leave tracking and paperwork.",
    gets: "Hours, cost and an honest verdict on whether to act",
    then: "A demo, an emailed report or free guides, depending on the result",
    href: ROUTES.calculator,
    cta: "Estimate your cost",
    icon: <IconCalculator />,
    tint: "bg-brand-50 text-brand-700 ring-brand-100",
  },
  {
    step: "Comparing options",
    challenge: "Challenge 02",
    title: "HR software finder",
    body: "Seven questions lead to the package that fits, with a reason for every module and the ones you can skip.",
    gets: "A recommendation, the reasons and a side-by-side comparison",
    then: "A demo tailored to their answers, or the recommendation by email",
    href: ROUTES.finder,
    cta: "Find your package",
    icon: <IconTarget />,
    tint: "bg-amber-100 text-amber-700 ring-amber-100",
  },
];

const STATS = [
  { value: "2 min", label: "to estimate what HR admin costs you" },
  { value: "7", label: "questions to a package recommendation" },
  { value: "3", label: "free, printable HR checklists" },
  { value: "0", label: "sign-ups needed to get an answer" },
];

const PRINCIPLES = [
  {
    icon: <IconBulb />,
    title: "Useful before it asks for anything",
    body: "Every tool gives a complete answer without sign-up. Email is only asked for in return for something extra.",
  },
  {
    icon: <IconEye />,
    title: "Honest, so it's trusted",
    body: "The calculator says when software isn't worth it, the finder says what you don't need, and every assumption is shown.",
  },
  {
    icon: <IconSignpost />,
    title: "The next step fits the visitor",
    body: "Ready to buy: book a demo. Still researching: start with the numbers. Answers carry across, so nobody types them twice.",
  },
  {
    icon: <IconUsers />,
    title: "Sales starts with context",
    body: "Each lead arrives scored, summarised and linked to exactly what the visitor saw, so the first call is about them.",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink-200 bg-white">
        <div aria-hidden="true" className="bg-dots absolute inset-0 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" />
        <div aria-hidden="true" className="absolute -right-32 -top-40 size-[34rem] rounded-full bg-brand-100/70 blur-3xl" />
        <div aria-hidden="true" className="absolute -bottom-48 left-1/4 size-[28rem] rounded-full bg-mint-50 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:py-24">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3.5 py-1.5 text-sm font-semibold text-ink-700 shadow-card ring-1 ring-ink-200">
              <span aria-hidden="true" className="size-2 rounded-full bg-mint-500" />
              Free HR tools from PeoplesHR · no sign-up
            </p>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-ink-950 sm:text-6xl">
              See what HR admin <span className="text-brand-600">really costs</span> you, and how to fix it
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-500">
              Put a number on manual payroll and leave tracking, find the package that fits your team, and get straight
              answers to everyday HR questions. Useful first. Sales call optional.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={ROUTES.calculator} size="lg">
                Estimate my HR admin cost
                <IconArrowRight className="size-5" />
              </ButtonLink>
              <ButtonLink href={ROUTES.finder} size="lg" variant="secondary">
                Find my package
              </ButtonLink>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-ink-700">
              {["About 2 minutes", "Every assumption shown", "For teams of 5 to 2,000"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <IconCheck className="size-4.5 text-mint-500" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <HeroPreview />
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Journey */}
        <section aria-labelledby="journey-heading" className="py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Three tools, one path</p>
            <h2 id="journey-heading" className="mt-2 text-3xl font-extrabold tracking-tight text-ink-950 sm:text-4xl">
              Start wherever you are. We&apos;ll take it from there.
            </h2>
            <p className="mt-3 text-lg text-ink-500">
              Each tool answers one question in the buying journey, then hands over to the next. Answers carry across,
              so nobody types them twice.
            </p>
          </div>

          <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
            {JOURNEY.map((item, i) => (
              <li key={item.href} className="relative">
                {i < JOURNEY.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute -right-7 top-12 z-10 hidden size-10 place-items-center rounded-full bg-white text-brand-600 shadow-card ring-1 ring-ink-200 md:grid"
                  >
                    <IconArrowRight className="size-5" />
                  </span>
                )}
                <Link
                  href={item.href}
                  className="group flex h-full flex-col rounded-3xl bg-white p-7 shadow-card ring-1 ring-ink-200 transition hover:-translate-y-1 hover:shadow-lift hover:ring-brand-300"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className={`grid size-12 place-items-center rounded-2xl ring-1 ${item.tint}`}>{item.icon}</span>
                    <span className="text-xs font-medium text-ink-500">{item.challenge}</span>
                  </div>
                  <p className="mt-6 text-xs font-bold uppercase tracking-wider text-ink-500">
                    Step {i + 1} · {item.step}
                  </p>
                  <h3 className="mt-1.5 text-xl font-bold text-ink-950 group-hover:text-brand-700">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">{item.body}</p>
                  <dl className="mt-6 flex-1 space-y-3 border-t border-ink-100 pt-5 text-sm">
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wider text-ink-500">You get</dt>
                      <dd className="mt-0.5 font-medium text-ink-900">{item.gets}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wider text-ink-500">Then</dt>
                      <dd className="mt-0.5 font-medium text-ink-900">{item.then}</dd>
                    </div>
                  </dl>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                    {item.cta}
                    <IconArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>

        {/* Stats */}
        <section aria-label="At a glance" className="relative overflow-hidden rounded-3xl bg-brand-900 px-6 py-10 text-white sm:px-10">
          <div aria-hidden="true" className="absolute -right-20 -top-24 size-72 rounded-full bg-brand-600/40 blur-3xl" />
          <dl className="relative grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="lg:border-l lg:border-white/15 lg:pl-6 lg:first:border-0 lg:first:pl-0">
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="block text-4xl font-extrabold tracking-tight text-mint-300 sm:text-5xl">{s.value}</span>
                  <span className="mt-1 block text-sm text-brand-100">{s.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Principles */}
        <section aria-labelledby="principles-heading" className="py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">How it&apos;s designed</p>
            <h2 id="principles-heading" className="mt-2 text-3xl font-extrabold tracking-tight text-ink-950 sm:text-4xl">
              Built to earn trust, not just clicks
            </h2>
          </div>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PRINCIPLES.map((p) => (
              <li key={p.title} className="rounded-3xl bg-white p-6 ring-1 ring-ink-200">
                <span className="grid size-11 place-items-center rounded-xl bg-brand-50 text-brand-700">{p.icon}</span>
                <h3 className="mt-5 font-bold text-ink-950">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{p.body}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Behind the scenes */}
        <section
          aria-labelledby="sales-heading"
          className="relative grid items-center gap-10 overflow-hidden rounded-3xl bg-brand-900 p-7 text-white sm:p-10 lg:grid-cols-[1fr_1.05fr]"
        >
          <div aria-hidden="true" className="bg-dots absolute inset-0 opacity-[0.07]" />
          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-200">For the PeoplesHR team</p>
            <h2 id="sales-heading" className="mt-2 text-3xl font-extrabold tracking-tight">
              Every lead arrives ready for a useful first call
            </h2>
            <p className="mt-3 text-brand-100">
              Leads are scored with reasons, summarised in one line, given a response time and linked to exactly what the
              visitor saw. Try a tool, request a report or demo, then open the behind-the-scenes view.
            </p>
            <Link
              href="/demo"
              className="mt-7 inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-brand-900 hover:bg-brand-50"
            >
              See what sales sees
              <IconArrowRight className="size-4" />
            </Link>
          </div>
          <LeadPreview />
        </section>
      </div>
    </>
  );
}

/** Three overlapping cards built from real tool output, so the hero shows the product, not a stock image. */
function HeroPreview() {
  return (
    <>
      <div aria-hidden="true" className="relative mx-auto hidden h-[470px] w-full max-w-[520px] lg:block">
        <div className="animate-float absolute left-0 top-16 z-10 w-[330px]">
          <CalculatorCard />
        </div>
        <div className="animate-float absolute right-0 top-0 z-20 w-[250px] [animation-delay:-2s]">
          <PreviewCard label="Recommended for you">
            <p className="mt-1 text-lg font-extrabold text-ink-950">{finder.recommended.pkg.name}</p>
            <div className="mt-2 flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-100">
                <div className="h-full rounded-full bg-brand-600" style={{ width: `${finder.recommended.match}%` }} />
              </div>
              <span className="text-xs font-bold text-brand-700">{finder.recommended.match}% match</span>
            </div>
            <ul className="mt-3 space-y-1.5 text-xs text-ink-700">
              {finder.needs
                .filter((n) => n.weight >= 3)
                .slice(0, 3)
                .map((n) => (
                  <li key={n.module} className="flex items-center gap-1.5">
                    <IconCheck className="size-3.5 text-mint-500" />
                    {MODULES[n.module].name}
                  </li>
                ))}
            </ul>
          </PreviewCard>
        </div>
        <div className="animate-float absolute bottom-0 right-6 z-20 w-[280px] [animation-delay:-4s]">
          <PreviewCard label="Quick answer">
            <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-ink-700">{guide.quickAnswer}</p>
            <p className="mt-2 flex items-center justify-between text-[11px] font-semibold text-ink-500">
              <span className="text-mint-700">Free checklist inside</span>
              {readingMinutes(guide)} min read
            </p>
          </PreviewCard>
        </div>
      </div>
      <div aria-hidden="true" className="lg:hidden">
        <CalculatorCard />
      </div>
    </>
  );
}

function CalculatorCard() {
  return (
    <div className="rounded-3xl bg-brand-900 p-6 text-white shadow-lift ring-1 ring-white/10">
      <div className="flex items-center gap-2.5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-brand-200">Your estimate</p>
        <span className="rounded-full bg-mint-100 px-2 py-0.5 text-[11px] font-bold text-mint-700">{VERDICT_COPY[calc.verdict].badge}</span>
      </div>
      <p className="mt-4 text-xs text-brand-100">You could get back</p>
      <p className="text-4xl font-extrabold tracking-tight text-mint-100">
        {formatMoney(calc.savedCost, "USD")}
        <span className="ml-1 text-sm font-semibold text-brand-200">/ year</span>
      </p>
      <p className="mt-0.5 text-xs text-brand-200">
        {formatNumber(calc.savedHours)} hours · {formatNumber(calc.savedWorkingWeeks)} working weeks · 120 employees
      </p>
      <ul className="mt-5 space-y-2.5">
        {calcBars.map((p) => (
          <li key={p.id}>
            <div className="flex justify-between text-[11px] text-brand-100">
              <span>{PROCESS_COPY[p.id].label}</span>
              <span className="tabular-nums">−{formatNumber(p.savedHours)} h</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="flex h-full" style={{ width: `${(p.currentHours / barMax) * 100}%` }}>
                <div className="h-full bg-white/30" style={{ width: `${(p.futureHours / p.currentHours) * 100}%` }} />
                <div className="h-full flex-1 bg-mint-300" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PreviewCard({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-lift ring-1 ring-ink-200">
      <p className="text-[11px] font-bold uppercase tracking-wider text-brand-600">{label}</p>
      {children}
    </div>
  );
}

function LeadPreview() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-md rotate-[1.5deg] rounded-3xl bg-white p-6 text-ink-900 shadow-lift">
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
        <span className="rounded-full bg-mint-100 px-2.5 py-1 text-mint-700">Sales-ready · 95</span>
        <span className="rounded-full bg-brand-50 px-2.5 py-1 text-brand-700">Demo request</span>
        <span className="text-ink-500">Cost calculator</span>
      </div>
      <p className="mt-4 text-lg font-bold leading-snug text-ink-950">
        Could recover $37,343 a year, mostly in leave and attendance
      </p>
      <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
        <dt className="text-ink-500">Employees</dt>
        <dd className="font-medium">300, in 2 countries</dd>
        <dt className="text-ink-500">Verdict</dt>
        <dd className="font-medium">Strong case</dd>
      </dl>
      <div className="mt-4 rounded-2xl bg-ink-50 p-4 text-sm">
        <p className="font-semibold text-ink-950">Call within 1 working day</p>
        <p className="mt-1 text-ink-700">Open with their biggest opportunity and walk through their own numbers.</p>
      </div>
      <p className="mt-4 text-sm font-semibold text-brand-700">See what they saw →</p>
    </div>
  );
}
