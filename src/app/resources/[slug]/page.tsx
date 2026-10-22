import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GUIDES, getGuide } from "@/lib/content/guides";
import { ROLES, STAGES, TOPICS } from "@/lib/content/types";
import { faqId, guidePath, readingMinutes } from "@/lib/content/utils";
import { MODULES } from "@/lib/finder/data";
import { absoluteUrl, ROUTES, SITE } from "@/lib/site";
import { JsonLd } from "@/components/json-ld";
import { BlockView } from "@/components/content/blocks";
import { TableOfContents } from "@/components/content/toc";
import { ReadingProgress, ScrollCta } from "@/components/content/reading-aids";
import { ButtonLink } from "@/components/ui/button";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/resources/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: guidePath(guide.slug) },
    openGraph: {
      type: "article",
      title: guide.title,
      description: guide.description,
      url: guidePath(guide.slug),
      publishedTime: guide.published,
      modifiedTime: guide.updated,
    },
  };
}

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${iso}T00:00:00Z`),
  );

/*
  Guides are fully prerendered (generateStaticParams) and should arrive as
  complete HTML: readable without JavaScript, no layout shift, and #section
  links that work on first load. A Suspense skeleton would make client-side
  navigation feel instant but swaps the content in with JavaScript, which is
  the wrong trade-off for content pages. Prefetching keeps navigation fast.
*/
export const instant = false;

export default async function GuidePage({ params }: PageProps<"/resources/[slug]">) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const minutes = readingMinutes(guide);
  const related = guide.related.map((s) => getGuide(s)).filter((g) => g !== undefined);
  const checklistSection = guide.sections.find((s) => s.blocks.some((b) => b.type === "checklist"));
  const toc = [
    { id: "quick-answer", label: "Quick answer" },
    ...guide.sections.map((s) => ({ id: s.id, label: s.heading })),
    { id: "faq", label: "Common questions" },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: guide.title,
        description: guide.description,
        datePublished: guide.published,
        dateModified: guide.updated,
        author: { "@type": "Organization", name: `${SITE.name} HR and payroll team`, url: SITE.url },
        publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
        mainEntityOfPage: absoluteUrl(guidePath(guide.slug)),
        articleSection: TOPICS[guide.topic],
        abstract: guide.quickAnswer,
        audience: guide.roles.map((r) => ({ "@type": "BusinessAudience", audienceType: ROLES[r] })),
      },
      {
        "@type": "FAQPage",
        mainEntity: guide.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl(ROUTES.home) },
          { "@type": "ListItem", position: 2, name: "Guides", item: absoluteUrl(ROUTES.resources) },
          { "@type": "ListItem", position: 3, name: guide.title, item: absoluteUrl(guidePath(guide.slug)) },
        ],
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <ReadingProgress slug={guide.slug} />

      <header className="border-b border-ink-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-6 sm:px-6">
          <nav aria-label="Breadcrumb" className="text-sm text-ink-500">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href={ROUTES.home} className="hover:text-brand-700">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={ROUTES.resources} className="hover:text-brand-700">
                  Guides
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={`${ROUTES.resources}?topic=${guide.topic}`} className="hover:text-brand-700">
                  {TOPICS[guide.topic]}
                </Link>
              </li>
            </ol>
          </nav>
          <div className="mt-8 flex flex-wrap gap-2 text-xs font-semibold">
            <span className="rounded-full bg-brand-50 px-3 py-1 text-brand-700">{TOPICS[guide.topic]}</span>
            <span className="rounded-full bg-ink-100 px-3 py-1 text-ink-700">{STAGES[guide.stage]}</span>
          </div>
          <h1 className="mt-4 max-w-4xl text-3xl font-extrabold leading-tight tracking-tight text-ink-950 sm:text-5xl">
            {guide.title}
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-ink-500">{guide.description}</p>
          <p className="mt-6 text-sm text-ink-500">
            By the {SITE.name} HR and payroll team · Updated{" "}
            <time dateTime={guide.updated}>{formatDate(guide.updated)}</time> · {minutes} min read
          </p>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <div className="no-print lg:sticky lg:top-24 lg:self-start">
          <TableOfContents items={toc} />
        </div>

        <article id="article" className="min-w-0 max-w-3xl">
          <section id="quick-answer" aria-labelledby="quick-answer-heading" className="scroll-mt-24 rounded-3xl bg-white p-6 ring-1 ring-ink-200 sm:p-7">
            <h2 id="quick-answer-heading" className="text-xs font-bold uppercase tracking-wider text-brand-700">
              Quick answer
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-ink-900">{guide.quickAnswer}</p>
            <h3 className="mt-6 text-sm font-bold text-ink-950">Key takeaways</h3>
            <ul className="mt-2 space-y-2">
              {guide.takeaways.map((t) => (
                <li key={t} className="flex gap-2.5 text-ink-700">
                  <span aria-hidden="true" className="mt-0.5 font-bold text-mint-500">✓</span>
                  {t}
                </li>
              ))}
            </ul>
          </section>

          {guide.sections.map((section) => (
            <section key={section.id} id={section.id} aria-labelledby={`${section.id}-h`} className="mt-12 scroll-mt-24">
              <h2 id={`${section.id}-h`} className="group text-2xl font-bold tracking-tight text-ink-950 sm:text-[1.7rem]">
                {section.heading}
                <a
                  href={`#${section.id}`}
                  className="no-print ml-2 text-ink-300 opacity-0 transition-opacity hover:text-brand-600 group-hover:opacity-100 focus:opacity-100"
                  aria-label={`Link to this section: ${section.heading}`}
                >
                  #
                </a>
              </h2>
              {section.blocks.map((block, i) => (
                <BlockView key={i} block={block} guide={guide} />
              ))}
            </section>
          ))}

          <section aria-labelledby="tie-in-heading" className="no-print mt-12 rounded-3xl bg-brand-900 p-6 text-white sm:p-8">
            <h2 id="tie-in-heading" className="text-xl font-bold">
              {guide.productTieIn.heading}
            </h2>
            <p className="mt-2 leading-relaxed text-brand-100">{guide.productTieIn.text}</p>
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Related PeoplesHR modules">
              {guide.productTieIn.modules.map((m) => (
                <li key={m} className="rounded-full bg-white/10 px-3 py-1 text-sm ring-1 ring-white/20">
                  {MODULES[m].name}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
              <ButtonLink href={ROUTES.finder} variant="inverse">
                Find the right package
              </ButtonLink>
              <ButtonLink href={ROUTES.calculator} variant="ghost" className="text-white ring-1 ring-inset ring-white/30 hover:bg-white/10">
                Estimate your savings
              </ButtonLink>
            </div>
          </section>

          <section id="faq" aria-labelledby="faq-heading" className="mt-12 scroll-mt-24">
            <h2 id="faq-heading" className="text-2xl font-bold tracking-tight text-ink-950">
              Common questions
            </h2>
            <div className="mt-4 divide-y divide-ink-200">
              {guide.faq.map((f) => (
                <div key={f.q} id={faqId(f.q)} className="scroll-mt-24 py-5">
                  <h3 className="font-semibold text-ink-950">{f.q}</h3>
                  <p className="mt-2 leading-relaxed text-ink-700">{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          <p className="mt-8 rounded-2xl bg-ink-100 px-5 py-4 text-sm text-ink-500">
            This guide is general information, not legal or tax advice. Rules vary by country, so check the details
            for yours.
          </p>

          {related.length > 0 && (
            <section aria-labelledby="related-heading" className="no-print mt-12">
              <h2 id="related-heading" className="text-xl font-bold text-ink-950">
                Keep reading
              </h2>
              <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link href={guidePath(r.slug)} className="block h-full rounded-2xl bg-white p-5 ring-1 ring-ink-200 transition hover:ring-brand-300">
                      <span className="text-xs font-semibold text-brand-700">{TOPICS[r.topic]}</span>
                      <span className="mt-1 block font-bold leading-snug text-ink-950">{r.title}</span>
                      <span className="mt-2 block text-sm text-ink-500">{readingMinutes(r)} min read</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>
      </div>

      <ScrollCta slug={guide.slug} items={guide.scrollCta} hideWhenVisible={checklistSection?.id ?? "faq"} />
    </>
  );
}
