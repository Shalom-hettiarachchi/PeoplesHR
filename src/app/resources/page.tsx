import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES } from "@/lib/content/guides";
import { JOURNEYS } from "@/lib/content/journeys";
import { TOPICS, type Topic } from "@/lib/content/types";
import { buildSearchIndex, guidePath, readingMinutes } from "@/lib/content/utils";
import { absoluteUrl, ROUTES, SITE } from "@/lib/site";
import { JsonLd } from "@/components/json-ld";
import { HubExplorer, type GuideCard } from "@/components/content/hub-explorer";

const TITLE = "HR and payroll guides: practical answers for growing teams";
const DESCRIPTION =
  "Plain-English guides to payroll errors, leave tracking and paying people in other countries, with free checklists and tools to work out your next step.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: ROUTES.resources },
  openGraph: { title: TITLE, description: DESCRIPTION, url: ROUTES.resources },
};

const index = buildSearchIndex();
const cards: GuideCard[] = GUIDES.map((g) => ({
  slug: g.slug,
  href: guidePath(g.slug),
  title: g.title,
  description: g.description,
  topic: g.topic,
  stage: g.stage,
  roles: g.roles,
  minutes: readingMinutes(g),
}));
const questionsByTopic = (Object.keys(TOPICS) as Topic[])
  .map((topic) => ({ topic, questions: index.filter((e) => e.kind === "question" && e.topic === topic && !e.href.includes("#faq-")) }))
  .filter((group) => group.questions.length > 0);

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      name: TITLE,
      description: DESCRIPTION,
      url: absoluteUrl(ROUTES.resources),
      publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
      mainEntity: {
        "@type": "ItemList",
        itemListElement: GUIDES.map((g, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: absoluteUrl(guidePath(g.slug)),
          name: g.title,
        })),
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl(ROUTES.home) },
        { "@type": "ListItem", position: 2, name: "Guides", item: absoluteUrl(ROUTES.resources) },
      ],
    },
  ],
};

export default function ResourcesPage() {
  return (
    <>
      <JsonLd data={jsonLd} />

      <div className="border-b border-ink-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 pb-12 pt-6 sm:px-6">
          <nav aria-label="Breadcrumb" className="text-sm text-ink-500">
            <ol className="flex items-center gap-1.5">
              <li>
                <Link href={ROUTES.home} className="hover:text-brand-700">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-medium text-ink-700">
                Guides
              </li>
            </ol>
          </nav>
          <p className="mt-8 text-sm font-semibold uppercase tracking-wider text-brand-600">Guides and checklists</p>
          <h1 className="mt-2 max-w-3xl text-4xl font-extrabold tracking-tight text-ink-950 sm:text-5xl">
            Practical answers to everyday HR and payroll questions
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-500">
            Start with your question. Each guide gives you the short answer first, then the detail, a free checklist and a
            clear next step.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <HubExplorer guides={cards} index={index} />

        <section aria-labelledby="journeys-heading" className="mt-16">
          <h2 id="journeys-heading" className="text-2xl font-bold tracking-tight text-ink-950">
            Not sure where to start?
          </h2>
          <p className="mt-2 text-ink-500">Pick the description that sounds most like you.</p>
          <ul className="mt-6 grid gap-4 md:grid-cols-3">
            {JOURNEYS.map((j) => (
              <li key={j.role} className="rounded-3xl bg-white p-6 ring-1 ring-ink-200">
                <h3 className="text-lg font-bold text-ink-950">{j.title}</h3>
                <p className="mt-1 text-sm text-ink-500">{j.intro}</p>
                <ol className="mt-5 space-y-3">
                  {j.steps.map((step, i) => (
                    <li key={step.href + i} className="flex items-start gap-3">
                      <span aria-hidden="true" className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                        {i + 1}
                      </span>
                      <Link href={step.href} className="text-sm font-semibold leading-snug text-ink-900 hover:text-brand-700 hover:underline">
                        <span className="block text-xs font-medium text-ink-500">{step.kind}</span>
                        {step.label}
                      </Link>
                    </li>
                  ))}
                </ol>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="questions-heading" className="mt-16">
          <h2 id="questions-heading" className="text-2xl font-bold tracking-tight text-ink-950">
            Questions we answer
          </h2>
          <div className="mt-6 grid gap-8 md:grid-cols-3">
            {questionsByTopic.map((group) => (
              <div key={group.topic}>
                <h3 className="text-sm font-bold uppercase tracking-wider text-ink-500">{TOPICS[group.topic]}</h3>
                <ul className="mt-3 space-y-2.5">
                  {group.questions.map((q) => (
                    <li key={q.href}>
                      <Link href={q.href} className="text-sm font-medium leading-snug text-ink-900 hover:text-brand-700 hover:underline">
                        {q.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="tools-heading" className="mt-16 grid gap-4 rounded-3xl bg-brand-900 p-6 text-white sm:p-10 md:grid-cols-[1.2fr_1fr_1fr] md:items-center">
          <div>
            <h2 id="tools-heading" className="text-2xl font-bold tracking-tight">
              Ready to put numbers on it?
            </h2>
            <p className="mt-2 text-brand-100">Two free tools that take a couple of minutes each.</p>
          </div>
          <Link href={ROUTES.calculator} className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/20 transition hover:bg-white/15">
            <span className="block font-bold">HR admin cost calculator →</span>
            <span className="mt-1 block text-sm text-brand-100">What manual HR admin costs you each year</span>
          </Link>
          <Link href={ROUTES.finder} className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/20 transition hover:bg-white/15">
            <span className="block font-bold">HR software finder →</span>
            <span className="mt-1 block text-sm text-brand-100">Which package fits your team, and why</span>
          </Link>
        </section>
      </div>
    </>
  );
}
