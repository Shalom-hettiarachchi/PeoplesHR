import type { Metadata } from "next";
import Link from "next/link";
import { SoftwareFinder } from "@/components/finder/software-finder";
import { JsonLd } from "@/components/json-ld";
import { MODULES, PACKAGES } from "@/lib/finder/data";
import { MAX_ADD_ONS } from "@/lib/finder/recommend";
import { absoluteUrl, ROUTES, SITE } from "@/lib/site";

const TITLE = "HR software finder: which HR and payroll package do you need?";
const DESCRIPTION =
  "Answer 7 quick questions about your team and get a recommended HR and payroll package, the modules you need, the ones you don't, and why.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: ROUTES.finder },
  openGraph: { title: TITLE, description: DESCRIPTION, url: ROUTES.finder },
};

const FAQ = [
  {
    q: "How do I choose HR software for a small business?",
    a: "Start with the problem costing you the most time, usually payroll or leave tracking, and make sure the system handles it well. Then check it suits your size and the number of countries you pay people in. Avoid paying for recruitment or performance tools until you need them.",
  },
  {
    q: "Do I need a separate payroll system and HR system?",
    a: "Not usually. Running HR and payroll in one system means leave, attendance and pay changes flow into payroll automatically, which removes re-keying and most payroll errors. If your payroll is outsourced, an HR system that exports payroll inputs can still save time.",
  },
  {
    q: "What HR software do I need if I employ people in several countries?",
    a: "Look for multi-country payroll that keeps each country's entities, currencies and local rules separate but reports on everyone together. With two or three countries this is often an add-on; with four or more, an enterprise package is usually simpler.",
  },
  {
    q: "How does this finder pick a package?",
    a: `Each answer adds weight to the modules it points to. The finder recommends the smallest package that includes everything you can't do without, allowing up to ${MAX_ADD_ONS} add-ons, and that suits your company size. It also tells you what the next package up would add that you don't need.`,
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "HR software finder",
      url: absoluteUrl(ROUTES.finder),
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
        { "@type": "ListItem", position: 2, name: "HR software finder", item: absoluteUrl(ROUTES.finder) },
      ],
    },
  ],
};

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />

      <div className="border-b border-ink-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 pb-12 pt-6 sm:px-6">
          <nav aria-label="Breadcrumb" className="text-sm text-ink-500">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href={ROUTES.home} className="hover:text-brand-700">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-medium text-ink-700">
                HR software finder
              </li>
            </ol>
          </nav>
          <p className="mt-8 text-sm font-semibold uppercase tracking-wider text-brand-600">Free tool · 7 questions</p>
          <h1 className="mt-2 max-w-3xl text-4xl font-extrabold tracking-tight text-ink-950 sm:text-5xl">
            Find the HR software package that fits your team
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-500">
            Tell us about your team and what&apos;s slowing you down. We&apos;ll recommend a package, show exactly which
            modules you need and which you can skip, and explain why.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <SoftwareFinder />
      </div>

      <section aria-labelledby="packages-heading" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h2 id="packages-heading" className="text-2xl font-bold tracking-tight text-ink-950">
          PeoplesHR packages at a glance
        </h2>
        <p className="mt-2 max-w-2xl text-ink-500">
          Every package includes core HR records, leave and attendance, and the employee self-service app. Packages and
          prices on this page are illustrative.
        </p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PACKAGES.map((pkg, i) => {
            const previous = PACKAGES[i - 1];
            const adds = previous ? pkg.includes.filter((m) => !previous.includes.includes(m)) : pkg.includes;
            return (
              <li key={pkg.id} className="flex flex-col rounded-2xl bg-white p-5 ring-1 ring-ink-200">
                <h3 className="text-lg font-bold text-ink-950">{pkg.name}</h3>
                <p className="mt-1 text-sm text-ink-500">{pkg.bestFor}.</p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-ink-500">
                  {previous ? `Everything in ${previous.name}, plus` : "Includes"}
                </p>
                <ul className="mt-2 flex-1 space-y-1.5 text-sm text-ink-700">
                  {adds.map((m) => (
                    <li key={m} className="flex gap-2">
                      <span aria-hidden="true" className="text-mint-700">
                        ✓
                      </span>
                      {MODULES[m].name}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm font-semibold text-ink-950">
                  {pkg.priceFrom === null ? "Custom pricing" : `From $${pkg.priceFrom} per employee / month`}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="faq-heading" className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h2 id="faq-heading" className="text-2xl font-bold tracking-tight text-ink-950">
          Choosing HR software: common questions
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
