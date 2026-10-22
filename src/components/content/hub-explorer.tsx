"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { search, type SearchEntry } from "@/lib/content/search";
import { ROLES, STAGES, TOPICS, type Role, type Stage, type Topic } from "@/lib/content/types";
import { ROUTES } from "@/lib/site";
import { track } from "@/lib/analytics";

export interface GuideCard {
  slug: string;
  href: string;
  title: string;
  description: string;
  topic: Topic;
  stage: Stage;
  roles: Role[];
  minutes: number;
}

const SUGGESTIONS = ["payroll mistakes", "leave balance", "employer of record", "multiple countries"];

/**
 * Search plus topic and role filters. Search covers every question the guides
 * answer and links straight to the right section. Searches with no results
 * are tracked, which shows what content to write next.
 */
export function HubExplorer({ guides, index }: { guides: GuideCard[]; index: SearchEntry[] }) {
  const id = useId();
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<Topic | "all">("all");
  const [role, setRole] = useState<Role | "all">("all");
  const lastTracked = useRef("");

  // Read ?topic= and ?q= in the browser so the page itself stays static.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("topic");
    const q = params.get("q");
    /* eslint-disable react-hooks/set-state-in-effect -- one-off sync from the URL after hydration */
    if (t && t in TOPICS) setTopic(t as Topic);
    if (q) setQuery(q);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const filtered = useMemo(
    () => index.filter((e) => (topic === "all" || e.topic === topic) && (role === "all" || e.roles.includes(role))),
    [index, topic, role],
  );
  const results = useMemo(() => search(query, filtered, 8), [query, filtered]);
  const filtersOn = topic !== "all" || role !== "all";
  // When filters hide every match, check whether other topics answer it.
  const hiddenByFilters = useMemo(
    () => (filtersOn && results.length === 0 ? search(query, index, 8).length : 0),
    [filtersOn, results.length, query, index],
  );
  const cards = guides.filter((g) => (topic === "all" || g.topic === topic) && (role === "all" || g.roles.includes(role)));
  const searching = query.trim().length > 1;

  // Keep the URL shareable and log searches once the visitor pauses typing.
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (topic !== "all") params.set("topic", topic);
      if (searching) params.set("q", query.trim());
      const qs = params.toString();
      window.history.replaceState(window.history.state, "", qs ? `?${qs}` : window.location.pathname);

      const key = `${query.trim()}|${topic}|${role}`;
      if (searching && key !== lastTracked.current) {
        lastTracked.current = key;
        // Only a true content gap counts as "no results", not one caused by filters.
        const gap = results.length === 0 && hiddenByFilters === 0;
        track(gap ? "hub_search_no_results" : "hub_search", { query: query.trim(), topic, role, results: results.length });
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [query, topic, role, searching, results.length, hiddenByFilters]);

  const chip = (active: boolean) =>
    `rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${
      active ? "bg-ink-950 text-white" : "bg-white text-ink-700 ring-1 ring-inset ring-ink-200 hover:bg-ink-100"
    }`;

  return (
    <div>
      <div role="search" className="rounded-3xl bg-white p-5 shadow-card ring-1 ring-ink-200 sm:p-6">
        <label htmlFor={`${id}-q`} className="text-sm font-semibold text-ink-900">
          What do you want to sort out?
        </label>
        <div className="relative mt-2">
          <svg aria-hidden="true" viewBox="0 0 20 20" className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-ink-500" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="9" r="6" />
            <path d="M14 14l4 4" strokeLinecap="round" />
          </svg>
          <input
            id={`${id}-q`}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. how do I stop payroll mistakes?"
            autoComplete="off"
            aria-describedby={`${id}-status`}
            className="block w-full rounded-2xl border border-ink-300 bg-ink-50 py-3.5 pl-12 pr-4 text-base text-ink-950 placeholder:text-ink-500 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-3 focus:ring-brand-100"
          />
        </div>
        {!searching && (
          <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-ink-500">
            Try:
            {SUGGESTIONS.map((s) => (
              <button key={s} type="button" onClick={() => setQuery(s)} className="rounded-full bg-ink-100 px-3 py-1 font-medium text-ink-700 hover:bg-brand-50 hover:text-brand-700">
                {s}
              </button>
            ))}
          </p>
        )}

        <div className="mt-5 flex flex-col gap-3 border-t border-ink-200 pt-5 md:flex-row md:items-center md:justify-between">
          <div role="group" aria-label="Filter by topic" className="flex flex-wrap gap-2">
            <button type="button" aria-pressed={topic === "all"} className={chip(topic === "all")} onClick={() => setTopic("all")}>
              All topics
            </button>
            {(Object.keys(TOPICS) as Topic[]).map((t) => (
              <button key={t} type="button" aria-pressed={topic === t} className={chip(topic === t)} onClick={() => setTopic(t)}>
                {TOPICS[t]}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor={`${id}-role`} className="text-sm font-medium text-ink-700">
              I work in
            </label>
            <select
              id={`${id}-role`}
              value={role}
              onChange={(e) => setRole(e.target.value as Role | "all")}
              className="rounded-xl border border-ink-300 bg-white px-3 py-2 text-sm font-medium text-ink-900 focus:border-brand-500 focus:outline-none focus:ring-3 focus:ring-brand-100"
            >
              <option value="all">Any role</option>
              {(Object.keys(ROLES) as Role[]).map((r) => (
                <option key={r} value={r}>
                  {ROLES[r]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <p id={`${id}-status`} aria-live="polite" className="sr-only">
        {searching ? `${results.length} results` : `${cards.length} guides`}
      </p>

      <div className="mt-6">
        {searching ? (
          results.length > 0 ? (
            <ul className="space-y-3">
              {results.map((r) => (
                <li key={r.href}>
                  <Link
                    href={r.href}
                    onClick={() => track("hub_search_result_clicked", { query: query.trim(), href: r.href })}
                    className="block rounded-2xl bg-white p-5 ring-1 ring-ink-200 transition hover:ring-brand-300"
                  >
                    <span className="text-xs font-semibold text-brand-700">
                      {r.kind === "guide" ? "Guide" : "Answered in"} · {r.kind === "guide" ? TOPICS[r.topic] : r.guideTitle}
                    </span>
                    <span className="mt-1 block font-bold text-ink-950">{r.title}</span>
                    <span className="mt-1 line-clamp-2 block text-sm text-ink-500">{r.snippet}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : hiddenByFilters > 0 ? (
            <div className="rounded-2xl bg-white p-6 ring-1 ring-ink-200">
              <p className="font-bold text-ink-950">No matches with these filters.</p>
              <p className="mt-1 text-sm text-ink-500">
                We found {hiddenByFilters} {hiddenByFilters === 1 ? "answer" : "answers"} in other topics.
              </p>
              <button
                type="button"
                onClick={() => {
                  setTopic("all");
                  setRole("all");
                }}
                className="mt-4 rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-100"
              >
                Search all topics
              </button>
            </div>
          ) : (
            <div className="rounded-2xl bg-white p-6 ring-1 ring-ink-200">
              <p className="font-bold text-ink-950">We haven&apos;t written about that yet.</p>
              <p className="mt-1 text-sm text-ink-500">
                We note every search we can&apos;t answer and use them to plan new guides. In the meantime, these might help:
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href={ROUTES.finder} className="rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-100">
                  Find the right HR package
                </Link>
                <Link href={ROUTES.calculator} className="rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-100">
                  Estimate HR admin costs
                </Link>
                <button type="button" onClick={() => setQuery("")} className="rounded-full px-4 py-2 text-sm font-semibold text-ink-700 hover:bg-ink-100">
                  Clear search
                </button>
              </div>
            </div>
          )
        ) : cards.length > 0 ? (
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {cards.map((g) => (
              <li key={g.slug}>
                <Link href={g.href} className="group flex h-full flex-col rounded-2xl bg-white p-6 ring-1 ring-ink-200 transition hover:-translate-y-0.5 hover:shadow-lift hover:ring-brand-300">
                  <span className="flex flex-wrap gap-2 text-xs font-semibold">
                    <span className="rounded-full bg-brand-50 px-2.5 py-1 text-brand-700">{TOPICS[g.topic]}</span>
                    <span className="rounded-full bg-ink-100 px-2.5 py-1 text-ink-700">{STAGES[g.stage]}</span>
                  </span>
                  <span className="mt-4 text-lg font-bold leading-snug text-ink-950 group-hover:text-brand-700">{g.title}</span>
                  <span className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">{g.description}</span>
                  <span className="mt-4 text-sm font-medium text-ink-500">{g.minutes} min read</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-2xl bg-white p-6 text-ink-500 ring-1 ring-ink-200">No guides match those filters yet.</p>
        )}
      </div>
    </div>
  );
}
