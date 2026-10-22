"use client";

import { useState } from "react";
import Link from "next/link";
import { MODULES, PACKAGES, SIZE_MIDPOINT, STEPS, type FinderAnswers, type ModuleId } from "@/lib/finder/data";
import { MUST_WEIGHT, type Recommendation } from "@/lib/finder/recommend";
import { answersToSearchParams, calculatorLink } from "@/lib/finder/url-state";
import { track } from "@/lib/analytics";
import { Button, ButtonLink } from "@/components/ui/button";
import { LeadDialog } from "@/components/lead/lead-dialog";
import { LeadForm } from "@/components/lead/lead-form";
import { summarise } from "@/lib/finder/summary";

type Dialog = null | "report" | "demo";

const price = (value: number | null) => (value === null ? "Custom pricing" : `From $${value} per employee / month`);

export function FinderResults({
  answers,
  result,
  onEdit,
  onRestart,
}: {
  answers: FinderAnswers;
  result: Recommendation;
  onEdit: (step: number) => void;
  onRestart: () => void;
}) {
  const [dialog, setDialog] = useState<Dialog>(null);
  const [copied, setCopied] = useState(false);
  const { recommended, whyNotBigger, needs } = result;
  const pkg = recommended.pkg;

  const musts = needs.filter((n) => n.weight >= MUST_WEIGHT);
  const extras = needs.filter((n) => n.weight < MUST_WEIGHT && pkg.includes.includes(n.module));
  const mustSet = new Set<ModuleId>(musts.map((n) => n.module));

  const cta = (name: string) => track("finder_cta_clicked", { cta: name, package: pkg.id, timeline: answers.timeline });
  const open = (intent: "report" | "demo") => {
    cta(intent === "demo" ? "book_demo" : "email_recommendation");
    setDialog(intent);
  };

  async function copyLink() {
    cta("copy_link");
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt("Copy this link:", window.location.href);
    }
  }

  const leadContext = {
    employees: SIZE_MIDPOINT[answers.size!],
    sizeBand: answers.size!,
    countries: answers.countries!,
    industry: answers.industry!,
    currentTools: answers.tools!,
    challenges: answers.challenges.join(","),
    mustHaves: (answers.mustHaves ?? []).join(","),
    timeline: answers.timeline!,
    recommendedPackage: pkg.id,
    addOns: recommended.addOns.join(","),
    match: recommended.match,
    answers: answersToSearchParams(answers).toString(),
  };

  const demoButton = (variant: "primary" | "secondary") => (
    <Button variant={variant} size="lg" className="w-full sm:w-auto" onClick={() => open("demo")}>
      Book a demo of {pkg.name}
    </Button>
  );
  const reportButton = (variant: "primary" | "secondary") => (
    <Button variant={variant} size="lg" className="w-full sm:w-auto" onClick={() => open("report")}>
      Email me this recommendation
    </Button>
  );

  const nextStep = {
    "0-3": {
      title: "Ready to see it working?",
      body: `You're choosing in the next three months. A 30-minute demo focused on ${musts
        .slice(0, 2)
        .map((n) => MODULES[n.module].name.toLowerCase())
        .join(" and ")} is the fastest way to check the fit.`,
      actions: (
        <>
          {demoButton("primary")}
          {reportButton("secondary")}
        </>
      ),
    },
    "3-6": {
      title: "Keep this for your shortlist",
      body: "We'll email the recommendation, the module list and indicative pricing, so you can compare options and share them with your team.",
      actions: (
        <>
          {reportButton("primary")}
          {demoButton("secondary")}
        </>
      ),
    },
    research: {
      title: "Still researching? Start with the numbers",
      body: "Before talking to anyone, see how much time manual HR admin is costing a team your size. Then decide if it's worth acting on.",
      actions: (
        <>
          <ButtonLink href={calculatorLink(answers)} size="lg" className="w-full sm:w-auto" onClick={() => cta("calculator")}>
            Estimate my savings
          </ButtonLink>
          {reportButton("secondary")}
        </>
      ),
    },
  }[answers.timeline!];

  return (
    <div className="space-y-6">
      {/* Recommendation */}
      <section aria-labelledby="finder-results-heading" className="overflow-hidden rounded-3xl bg-brand-900 text-white shadow-lift">
        <div className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-200">Our recommendation</p>
            <h2 id="finder-results-heading" tabIndex={-1} className="mt-3 text-4xl font-extrabold tracking-tight focus:outline-none sm:text-5xl">
              PeoplesHR {pkg.name}
            </h2>
            <p className="mt-3 text-lg text-brand-100">{pkg.tagline}.</p>
            {recommended.addOns.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-2" aria-label="Recommended add-ons">
                {recommended.addOns.map((m) => (
                  <li key={m} className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium ring-1 ring-white/20">
                    + {MODULES[m].name} add-on
                  </li>
                ))}
              </ul>
            )}
          </div>
          <dl className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/10 p-4">
              <dt className="text-sm text-brand-100">Match</dt>
              <dd className="mt-1 text-3xl font-extrabold tabular-nums text-mint-100">{recommended.match}%</dd>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <dt className="text-sm text-brand-100">Price</dt>
              <dd className="mt-1 text-sm font-semibold leading-snug">
                {price(pkg.priceFrom)}
                <span className="mt-1 block text-xs font-normal text-brand-200">Illustrative</span>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Why it fits */}
        <section aria-labelledby="why-heading" className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-ink-200 sm:p-8">
          <h2 id="why-heading" className="text-xl font-bold text-ink-950">
            Why it fits
          </h2>
          <ul className="mt-5 space-y-4">
            {musts.map((need) => {
              const addOn = recommended.addOns.includes(need.module);
              return (
                <li key={need.module} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold ${
                      addOn ? "bg-brand-100 text-brand-700" : "bg-mint-100 text-mint-700"
                    }`}
                  >
                    {addOn ? "+" : "✓"}
                  </span>
                  <div>
                    <p className="font-semibold text-ink-950">
                      {MODULES[need.module].name}
                      <span className="ml-2 text-xs font-medium text-ink-500">{addOn ? "Add-on" : "Included"}</span>
                    </p>
                    <p className="text-sm text-ink-500">{need.reasons[0]}</p>
                  </div>
                </li>
              );
            })}
          </ul>
          {extras.length > 0 && (
            <p className="mt-5 border-t border-ink-200 pt-4 text-sm text-ink-700">
              <span className="font-semibold">Also included: </span>
              {extras.map((n) => MODULES[n.module].name).join(", ")}, plus core HR records, leave and the employee app.
            </p>
          )}
          {whyNotBigger && (
            <div className="mt-5 rounded-2xl bg-ink-50 p-4 text-sm">
              <p className="font-semibold text-ink-950">Why not {whyNotBigger.pkg.name}?</p>
              <p className="mt-1 text-ink-700">
                It adds {whyNotBigger.unneeded.map((m) => MODULES[m].name.toLowerCase()).join(", ")}. Nothing in your
                answers calls for {whyNotBigger.unneeded.length === 1 ? "it" : "them"} yet, so you&apos;d be paying for
                features you won&apos;t use. You can upgrade any time.
              </p>
            </div>
          )}
        </section>

        {/* Next step */}
        <section aria-labelledby="next-heading" className="flex flex-col rounded-3xl bg-white p-6 shadow-card ring-1 ring-ink-200 sm:p-8">
          <h2 id="next-heading" className="text-xl font-bold text-ink-950">
            {nextStep.title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-500">{nextStep.body}</p>
          <div className="mt-6 flex flex-col gap-2.5">{nextStep.actions}</div>
          {answers.timeline !== "research" && (
            <Link
              href={calculatorLink(answers)}
              onClick={() => cta("calculator")}
              className="mt-6 rounded-2xl bg-mint-50 p-4 text-sm ring-1 ring-mint-100 hover:ring-mint-500"
            >
              <span className="font-semibold text-ink-950">Need to make the business case?</span>
              <span className="mt-0.5 block text-ink-700">
                Estimate the hours and money {pkg.name} could save a team your size →
              </span>
            </Link>
          )}
          <div className="mt-auto flex flex-wrap gap-1 pt-6">
            <Button variant="ghost" className="h-9 px-3" onClick={copyLink}>
              {copied ? "Link copied" : "Copy shareable link"}
            </Button>
            <Button variant="ghost" className="h-9 px-3" onClick={onRestart}>
              Start over
            </Button>
          </div>
          <p aria-live="polite" className="sr-only">
            {copied ? "Link copied to clipboard" : ""}
          </p>
        </section>
      </div>

      {/* Comparison */}
      <section aria-labelledby="compare-heading" className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-ink-200 sm:p-8">
        <h2 id="compare-heading" className="text-xl font-bold text-ink-950">
          Compare all packages
        </h2>
        <p className="mt-1 text-sm text-ink-500">
          Rows marked <span className="font-semibold text-brand-700">You need this</span> come from your answers.
        </p>
        <div className="-mx-6 mt-6 overflow-x-auto px-6 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[40rem] border-separate border-spacing-0 text-sm">
            <caption className="sr-only">Modules included in each PeoplesHR package</caption>
            <thead>
              <tr>
                <th scope="col" className="sticky left-0 z-10 bg-white py-3 pr-4 text-left font-semibold text-ink-700">
                  Module
                </th>
                {result.matches.map((m) => {
                  const isRec = m.pkg.id === pkg.id;
                  return (
                    <th
                      key={m.pkg.id}
                      scope="col"
                      className={`px-3 py-3 text-center align-bottom ${isRec ? "rounded-t-2xl bg-brand-50" : ""}`}
                    >
                      {isRec && <span className="mb-1 block text-xs font-bold text-brand-700">Recommended</span>}
                      <span className="block font-bold text-ink-950">{m.pkg.name}</span>
                      <span className="block text-xs font-medium text-ink-500">{m.match}% match</span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {(Object.keys(MODULES) as ModuleId[]).map((module) => (
                <tr key={module}>
                  <th scope="row" className="sticky left-0 z-10 border-t border-ink-200 bg-white py-2.5 pr-4 text-left font-medium text-ink-900">
                    {MODULES[module].name}
                    {mustSet.has(module) && (
                      <span className="mt-0.5 block text-xs font-semibold text-brand-700">You need this</span>
                    )}
                  </th>
                  {PACKAGES.map((p) => {
                    const isRec = p.id === pkg.id;
                    const included = p.includes.includes(module);
                    const addOn = p.addOns.includes(module);
                    return (
                      <td key={p.id} className={`border-t border-ink-200 px-3 py-2.5 text-center ${isRec ? "bg-brand-50" : ""}`}>
                        {included ? (
                          <span className="font-bold text-mint-700">
                            ✓<span className="sr-only">Included</span>
                          </span>
                        ) : addOn ? (
                          <span className="text-xs font-medium text-ink-700">Add-on</span>
                        ) : (
                          <span className="text-ink-300">
                            –<span className="sr-only">Not available</span>
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr>
                <th scope="row" className="sticky left-0 z-10 border-t border-ink-200 bg-white py-3 pr-4 text-left font-semibold text-ink-900">
                  Price (illustrative)
                </th>
                {PACKAGES.map((p) => (
                  <td
                    key={p.id}
                    className={`border-t border-ink-200 px-3 py-3 text-center text-xs font-semibold text-ink-900 ${
                      p.id === pkg.id ? "rounded-b-2xl bg-brand-50" : ""
                    }`}
                  >
                    {p.priceFrom === null ? "Custom" : `$${p.priceFrom} / employee / mo`}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Answers */}
      <section aria-labelledby="answers-heading" className="rounded-3xl bg-white p-6 ring-1 ring-ink-200 sm:p-8">
        <h2 id="answers-heading" className="text-lg font-bold text-ink-950">
          Based on your answers
        </h2>
        <dl className="mt-4 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-start justify-between gap-3 border-b border-ink-100 pb-3">
              <div>
                <dt className="text-ink-500">{s.title}</dt>
                <dd className="mt-0.5 font-medium text-ink-900">{summarise(s, answers)}</dd>
              </div>
              <button
                type="button"
                onClick={() => onEdit(i)}
                className="shrink-0 font-medium text-brand-700 hover:underline"
                aria-label={`Change answer: ${s.title}`}
              >
                Change
              </button>
            </div>
          ))}
        </dl>
      </section>

      <LeadDialog
        open={dialog === "report"}
        onClose={() => setDialog(null)}
        title="Email me this recommendation"
        description={`We'll send your ${pkg.name} recommendation, the modules that match your answers and indicative pricing.`}
      >
        <LeadForm
          source="software-finder"
          intent="report"
          context={leadContext}
          submitLabel="Send my recommendation"
          success={
            <>
              <p className="font-bold">On its way to your inbox.</p>
              <p className="mt-1 text-sm text-ink-700">(In this prototype no email is actually sent.)</p>
            </>
          }
        />
      </LeadDialog>

      <LeadDialog
        open={dialog === "demo"}
        onClose={() => setDialog(null)}
        title={`Book a demo of ${pkg.name}`}
        description="A specialist will tailor the demo to your answers, so you'll only see what's relevant to you."
      >
        <LeadForm
          source="software-finder"
          intent="demo"
          extended
          context={leadContext}
          submitLabel="Request my demo"
          success={
            <>
              <p className="font-bold">Thanks, we&apos;ll be in touch within one working day.</p>
              <p className="mt-1 text-sm text-ink-700">
                Your specialist will already know your answers, so you won&apos;t have to repeat them.
              </p>
            </>
          }
        />
      </LeadDialog>
    </div>
  );
}
