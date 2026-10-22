import type { Metadata } from "next";
import Link from "next/link";
import { CostCalculator } from "@/components/calculator/cost-calculator";
import { JsonLd } from "@/components/json-ld";
import { ASSUMPTIONS as A, CURRENCIES, METHOD_FACTOR, PEOPLESHR_FACTOR } from "@/lib/calculator/assumptions";
import { calculate, defaultInputs } from "@/lib/calculator/model";
import { formatMoney, formatNumber } from "@/lib/format";
import { absoluteUrl, ROUTES, SITE } from "@/lib/site";

const TITLE = "HR admin cost calculator: what manual payroll and HR really cost";
const DESCRIPTION =
  "Free calculator: estimate the hours and money your team spends on manual payroll, leave tracking, paperwork and reports, and whether automating them is worth it.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: ROUTES.calculator },
  openGraph: { title: TITLE, description: DESCRIPTION, url: ROUTES.calculator },
};

// A worked example computed from the same model, so the copy never drifts from the maths.
const example = calculate(defaultInputs("USD"));
const exampleInputs = defaultInputs("USD");
const pct = (n: number) => `${Math.round(n * 100)}%`;

const FAQ = [
  {
    q: "How much time does manual HR admin take?",
    a: `For a ${exampleInputs.employees}-person business paying monthly, with most HR admin done in spreadsheets, our model estimates about ${formatNumber(example.currentHours)} hours a year. That's roughly ${formatNumber(example.currentFte, 1)} full-time people. The biggest share usually goes on leave and attendance tracking, followed by payroll and employee requests.`,
  },
  {
    q: "What counts as HR admin cost in this calculator?",
    a: "Staff time spent on payroll processing, fixing payroll mistakes, leave and attendance tracking, routine employee requests such as payslip copies and letters, onboarding and offboarding paperwork, and statutory and management reporting. Time is valued at the hourly cost you enter.",
  },
  {
    q: "How accurate is the estimate?",
    a: "It's a starting point, not an audit. The assumptions come from typical effort per task and are all listed on this page so you can check them. You can change staff cost, turnover and software price to match your business.",
  },
  {
    q: "When is HR software not worth it?",
    a: "When your processes are already automated, or your team is small and stable, the admin time you'd save may not cover the cost of a new system. The calculator tells you when that's the case instead of always recommending software.",
  },
  {
    q: "Do you store what I enter?",
    a: "No. Your answers stay in your browser and in the page link. Nothing is sent to PeoplesHR unless you ask us to email your report or book a walkthrough.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "HR admin cost calculator",
      url: absoluteUrl(ROUTES.calculator),
      description: DESCRIPTION,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Any (web browser)",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl(ROUTES.home) },
        { "@type": "ListItem", position: 2, name: "HR admin cost calculator", item: absoluteUrl(ROUTES.calculator) },
      ],
    },
  ],
};

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />

      <div className="no-print border-b border-ink-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 pb-12 pt-6 sm:px-6 sm:pb-14">
          <nav aria-label="Breadcrumb" className="text-sm text-ink-500">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href={ROUTES.home} className="hover:text-brand-700">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-medium text-ink-700">
                HR admin cost calculator
              </li>
            </ol>
          </nav>
          <p className="mt-8 text-sm font-semibold uppercase tracking-wider text-brand-600">Free calculator</p>
          <h1 className="mt-2 max-w-3xl text-4xl font-extrabold tracking-tight text-ink-950 sm:text-5xl">
            What is manual HR admin really costing you?
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-500">
            Estimate the hours and money your team spends on payroll, leave, paperwork and reports, and find
            out whether automating them is actually worth it.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2 text-sm font-medium text-ink-700">
            {["About 2 minutes", "No sign-up needed", "Every assumption shown"].map((item) => (
              <li key={item} className="flex items-center gap-2 rounded-full bg-ink-100 px-3 py-1.5">
                <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4 text-mint-500" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 111.4-1.4l3.8 3.8 6.8-6.8a1 1 0 011.4 0z"
                    clipRule="evenodd"
                  />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <CostCalculator />
      </div>

      <section
        id="how-we-calculate"
        aria-labelledby="method-heading"
        className="no-print mx-auto max-w-6xl scroll-mt-24 px-4 py-12 sm:px-6"
      >
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 id="method-heading" className="text-2xl font-bold tracking-tight text-ink-950">
              How we calculate
            </h2>
            <p className="mt-3 leading-relaxed text-ink-500">
              We estimate how long each process would take if it were done entirely by hand, then reduce it
              based on how automated it already is. With PeoplesHR, each process keeps{" "}
              {pct(PEOPLESHR_FACTOR)} of its manual effort for review and exceptions.
            </p>
            <div className="mt-6 rounded-2xl bg-white p-5 ring-1 ring-ink-200">
              <p className="text-sm font-semibold text-ink-950">Worked example</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">
                A {exampleInputs.employees}-person business paying monthly in one country, with leave, requests
                and onboarding done by hand, spends about {formatNumber(example.currentHours)} hours a year on HR
                admin. PeoplesHR could give back about {formatNumber(example.savedHours)} of those hours, worth{" "}
                {formatMoney(example.savedCost, "USD")} at {formatMoney(CURRENCIES.USD.defaultHourlyCost, "USD")}{" "}
                an hour.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl bg-white ring-1 ring-ink-200">
            <table className="w-full min-w-[32rem] text-left text-sm">
              <caption className="sr-only">Assumptions used by the calculator</caption>
              <thead className="bg-ink-50 text-ink-700">
                <tr>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Process
                  </th>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Manual effort we assume
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-200 text-ink-700">
                <tr>
                  <th scope="row" className="px-5 py-3 font-medium text-ink-950">Payroll processing</th>
                  <td className="px-5 py-3">
                    {A.payroll.fixedHoursPerRunPerEntity} hours per pay run per country, plus{" "}
                    {A.payroll.minutesPerEmployeePerRun} minutes per employee
                  </td>
                </tr>
                <tr>
                  <th scope="row" className="px-5 py-3 font-medium text-ink-950">Payroll corrections</th>
                  <td className="px-5 py-3">
                    {A.corrections.hoursEach * 60} minutes per corrected payslip. PeoplesHR checks prevent{" "}
                    {pct(A.corrections.reductionWithPeoplesHr)} of corrections
                  </td>
                </tr>
                <tr>
                  <th scope="row" className="px-5 py-3 font-medium text-ink-950">Leave and attendance</th>
                  <td className="px-5 py-3">{A.leave.minutesPerEmployeePerMonth} minutes per employee per month</td>
                </tr>
                <tr>
                  <th scope="row" className="px-5 py-3 font-medium text-ink-950">Employee requests</th>
                  <td className="px-5 py-3">
                    {A.requests.perEmployeePerMonth} requests per employee per month, {A.requests.minutesEach}{" "}
                    minutes each
                  </td>
                </tr>
                <tr>
                  <th scope="row" className="px-5 py-3 font-medium text-ink-950">Onboarding and offboarding</th>
                  <td className="px-5 py-3">
                    {A.lifecycle.hoursPerMovement} hours per joiner and per leaver
                  </td>
                </tr>
                <tr>
                  <th scope="row" className="px-5 py-3 font-medium text-ink-950">Reporting and compliance</th>
                  <td className="px-5 py-3">{A.reporting.hoursPerEntityPerMonth} hours per country per month</td>
                </tr>
                <tr className="bg-ink-50">
                  <th scope="row" className="px-5 py-3 font-medium text-ink-950">Already automated?</th>
                  <td className="px-5 py-3">
                    Partly automated keeps {pct(METHOD_FACTOR.partial)} of manual effort, automated keeps{" "}
                    {pct(METHOD_FACTOR.automated)}. One full-time person = {formatNumber(A.productiveHoursPerFte)}{" "}
                    productive hours a year
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section aria-labelledby="faq-heading" className="no-print mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h2 id="faq-heading" className="text-2xl font-bold tracking-tight text-ink-950">
          Common questions
        </h2>
        <div className="mt-6 divide-y divide-ink-200 rounded-2xl bg-white ring-1 ring-ink-200">
          {FAQ.map((item) => (
            <details key={item.q} className="group px-5 py-4 sm:px-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink-950">
                <h3>{item.q}</h3>
                <span aria-hidden="true" className="text-xl text-ink-500 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 leading-relaxed text-ink-700">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
