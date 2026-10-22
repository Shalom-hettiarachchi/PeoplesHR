"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { clearDemoData, DEMO_UPDATED, type DemoEvent, type DemoLead } from "@/lib/demo-store";
import { buildBrief } from "@/lib/leads/brief";
import { ROLES } from "@/lib/leads/schema";
import { ROUTES } from "@/lib/site";
import { Button } from "@/components/ui/button";

// Read storage through useSyncExternalStore so the page stays in sync when
// leads arrive from another tab (storage event) or this tab (custom event).
function subscribe(onChange: () => void) {
  window.addEventListener(DEMO_UPDATED, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(DEMO_UPDATED, onChange);
    window.removeEventListener("storage", onChange);
  };
}
const readRaw = (storage: () => Storage, key: string) => () => {
  try {
    return storage().getItem(key) ?? "[]";
  } catch {
    return "[]";
  }
};
const getLeads = readRaw(() => localStorage, "peopleshr-demo-leads");
const getEvents = readRaw(() => sessionStorage, "peopleshr-demo-events");
const empty = () => "[]";

const TIER_STYLE = {
  "sales-ready": "bg-mint-100 text-mint-700",
  warm: "bg-amber-100 text-amber-700",
  nurture: "bg-ink-100 text-ink-700",
} as const;

const SOURCE_LABEL = {
  "cost-calculator": "Cost calculator",
  "software-finder": "Software finder",
  "content-hub": "Guides",
} as const;

const INTENT_LABEL = { demo: "Demo request", report: "Report request", checklist: "Checklist download" } as const;

const FUNNELS: { title: string; href: string; steps: { label: string; match: (e: DemoEvent) => boolean }[] }[] = [
  {
    title: "Cost calculator",
    href: ROUTES.calculator,
    steps: [
      { label: "Viewed", match: (e) => e.event === "calculator_viewed" },
      { label: "Started", match: (e) => e.event === "calculator_started" },
      { label: "Clicked a next step", match: (e) => e.event === "calculator_cta_clicked" },
      { label: "Became a lead", match: (e) => e.event === "lead_submitted" && e.props.source === "cost-calculator" },
    ],
  },
  {
    title: "Software finder",
    href: ROUTES.finder,
    steps: [
      { label: "Viewed", match: (e) => e.event === "finder_viewed" },
      { label: "Started", match: (e) => e.event === "finder_started" },
      { label: "Got a recommendation", match: (e) => e.event === "finder_completed" },
      { label: "Became a lead", match: (e) => e.event === "lead_submitted" && e.props.source === "software-finder" },
    ],
  },
  {
    title: "Guides",
    href: ROUTES.resources,
    steps: [
      { label: "Read 25%", match: (e) => e.event === "guide_scroll_depth" && e.props.depth === 25 },
      { label: "Read 75%", match: (e) => e.event === "guide_scroll_depth" && e.props.depth === 75 },
      { label: "Used a tool or prompt", match: (e) => e.event === "estimator_used" || e.event === "scroll_cta_clicked" },
      { label: "Became a lead", match: (e) => e.event === "lead_submitted" && e.props.source === "content-hub" },
    ],
  },
];

const time = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" }).format(new Date(iso));

export function DemoDashboard() {
  const leadsRaw = useSyncExternalStore(subscribe, getLeads, empty);
  const eventsRaw = useSyncExternalStore(subscribe, getEvents, empty);
  const leads = useMemo(() => JSON.parse(leadsRaw) as DemoLead[], [leadsRaw]);
  const events = useMemo(() => JSON.parse(eventsRaw) as DemoEvent[], [eventsRaw]);

  const gaps = [...new Set(events.filter((e) => e.event === "hub_search_no_results").map((e) => String(e.props.query)))];

  return (
    <div className="space-y-12">
      <section aria-labelledby="leads-heading">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="leads-heading" className="text-2xl font-bold tracking-tight text-ink-950">
              Leads, as sales would see them
            </h2>
            <p className="mt-1 text-ink-500">Each lead arrives scored, summarised and with a suggested next step.</p>
          </div>
          {(leads.length > 0 || events.length > 0) && (
            <Button variant="ghost" className="h-9 px-3" onClick={clearDemoData}>
              Clear demo data
            </Button>
          )}
        </div>

        {leads.length === 0 ? (
          <div className="mt-6 rounded-3xl bg-white p-8 text-center ring-1 ring-ink-200">
            <p className="font-bold text-ink-950">No leads yet</p>
            <p className="mx-auto mt-1 max-w-md text-sm text-ink-500">
              Use one of the tools and request a report, a demo or a checklist. The lead will appear here with everything
              the visitor told us.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <Link href={ROUTES.calculator} className="rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-100">
                Cost calculator
              </Link>
              <Link href={ROUTES.finder} className="rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-100">
                Software finder
              </Link>
              <Link href={`${ROUTES.resources}/how-to-reduce-payroll-errors#payroll-accuracy-checklist`} className="rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-100">
                A guide checklist
              </Link>
            </div>
          </div>
        ) : (
          <ul className="mt-6 grid gap-5 lg:grid-cols-2">
            {leads.map((lead) => {
              const brief = buildBrief(lead);
              const role = ROLES.find((r) => r.value === lead.role)?.label;
              return (
                <li key={lead.id} className="flex flex-col rounded-3xl bg-white p-6 shadow-card ring-1 ring-ink-200">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                    <span className={`rounded-full px-2.5 py-1 ${TIER_STYLE[lead.tier]}`}>
                      {lead.tier === "sales-ready" ? "Sales-ready" : lead.tier === "warm" ? "Warm" : "Nurture"} · {lead.score}
                    </span>
                    <span className="rounded-full bg-brand-50 px-2.5 py-1 text-brand-700">{INTENT_LABEL[lead.intent]}</span>
                    <span className="text-ink-500">
                      {SOURCE_LABEL[lead.source]} · {time(lead.at)}
                    </span>
                  </div>
                  <p className="mt-4 text-lg font-bold leading-snug text-ink-950">{brief.headline}</p>
                  <p className="mt-1 text-sm text-ink-700">
                    {[lead.firstName, lead.email].filter(Boolean).join(" · ")}
                    {(lead.company || role) && <span className="text-ink-500"> · {[lead.company, role].filter(Boolean).join(", ")}</span>}
                  </p>

                  {brief.facts.length > 0 && (
                    <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
                      {brief.facts.map((f) => (
                        <div key={f.label} className="contents">
                          <dt className="text-ink-500">{f.label}</dt>
                          <dd className="font-medium text-ink-900">{f.value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}

                  <div className="mt-5 rounded-2xl bg-ink-50 p-4 text-sm">
                    <p className="font-semibold text-ink-950">{brief.sla}</p>
                    <p className="mt-1 text-ink-700">{brief.nextAction}</p>
                  </div>

                  <div className="mt-4 flex flex-1 flex-wrap items-end justify-between gap-3">
                    <ul className="flex flex-wrap gap-1.5" aria-label="Why this score">
                      {lead.reasons.map((r) => (
                        <li key={r} className="rounded-full bg-white px-2.5 py-1 text-xs text-ink-700 ring-1 ring-ink-200">
                          {r}
                        </li>
                      ))}
                    </ul>
                    {brief.replayHref && (
                      <Link href={brief.replayHref} className="text-sm font-semibold text-brand-700 hover:underline">
                        See what they saw →
                      </Link>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section aria-labelledby="funnel-heading">
        <h2 id="funnel-heading" className="text-2xl font-bold tracking-tight text-ink-950">
          Funnel, this browser session
        </h2>
        <p className="mt-1 text-ink-500">Counted from the analytics events each experience sends. In production these go to GA4 or a similar tool.</p>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {FUNNELS.map((funnel) => {
            const counts = funnel.steps.map((s) => events.filter(s.match).length);
            const max = Math.max(...counts, 1);
            return (
              <div key={funnel.title} className="rounded-3xl bg-white p-6 ring-1 ring-ink-200">
                <Link href={funnel.href} className="font-bold text-ink-950 hover:text-brand-700">
                  {funnel.title} →
                </Link>
                <ol className="mt-4 space-y-3">
                  {funnel.steps.map((step, i) => (
                    <li key={step.label}>
                      <div className="flex justify-between text-sm">
                        <span className="text-ink-700">{step.label}</span>
                        <span className="font-semibold tabular-nums text-ink-950">{counts[i]}</span>
                      </div>
                      <div className="mt-1 h-2 overflow-hidden rounded-full bg-ink-100" aria-hidden="true">
                        <div className="h-full rounded-full bg-brand-500" style={{ width: `${(counts[i] / max) * 100}%` }} />
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
        <section aria-labelledby="gaps-heading" className="rounded-3xl bg-white p-6 ring-1 ring-ink-200">
          <h2 id="gaps-heading" className="text-lg font-bold text-ink-950">
            Content gaps
          </h2>
          <p className="mt-1 text-sm text-ink-500">Searches on the guides hub that found nothing. These are the next guides to write.</p>
          {gaps.length ? (
            <ul className="mt-4 flex flex-wrap gap-2">
              {gaps.map((q) => (
                <li key={q} className="rounded-full bg-coral-50 px-3 py-1 text-sm font-medium text-coral-700">
                  “{q}”
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-ink-500">
              None yet. Try searching the <Link href={ROUTES.resources} className="font-medium text-brand-700 underline">guides hub</Link> for something we haven&apos;t covered, like &quot;pension&quot;.
            </p>
          )}
        </section>

        <section aria-labelledby="events-heading" className="rounded-3xl bg-white p-6 ring-1 ring-ink-200">
          <h2 id="events-heading" className="text-lg font-bold text-ink-950">
            Latest events
          </h2>
          {events.length ? (
            <div className="mt-4 max-h-80 overflow-auto">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">Most recent analytics events</caption>
                <thead className="sticky top-0 bg-white text-xs text-ink-500">
                  <tr>
                    <th scope="col" className="py-2 pr-3 font-semibold">Event</th>
                    <th scope="col" className="py-2 pr-3 font-semibold">Details</th>
                    <th scope="col" className="py-2 font-semibold">Page</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {events.slice(0, 40).map((e, i) => {
                    const { page, ...rest } = e.props;
                    return (
                      <tr key={`${e.at}-${i}`}>
                        <td className="py-2 pr-3 font-mono text-xs text-ink-950">{e.event}</td>
                        <td className="py-2 pr-3 text-xs text-ink-500">
                          {Object.entries(rest)
                            .map(([k, v]) => `${k}: ${String(v)}`)
                            .join(", ")}
                        </td>
                        <td className="py-2 text-xs text-ink-500">{String(page ?? "")}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-4 text-sm text-ink-500">No events yet in this session.</p>
          )}
        </section>
      </div>
    </div>
  );
}
