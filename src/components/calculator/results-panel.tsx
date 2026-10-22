"use client";

import { useState } from "react";
import type { CalculatorInputs, CalculatorResult } from "@/lib/calculator/model";
import { FREQUENCY_OPTIONS, VERDICT_COPY } from "@/lib/calculator/content";
import { formatMoney, formatNumber } from "@/lib/format";
import { ROUTES } from "@/lib/site";
import { track } from "@/lib/analytics";
import { Button, ButtonLink } from "@/components/ui/button";

const VERDICT_STYLE = {
  strong: "bg-mint-100 text-mint-700",
  moderate: "bg-brand-100 text-brand-700",
  low: "bg-amber-100 text-amber-700",
} as const;

export function ResultsPanel({
  inputs,
  result,
  onRequest,
}: {
  inputs: CalculatorInputs;
  result: CalculatorResult;
  onRequest: (intent: "report" | "demo") => void;
}) {
  const [copied, setCopied] = useState(false);
  const money = (n: number) => formatMoney(n, inputs.currency);
  const verdict = VERDICT_COPY[result.verdict];
  const frequency = FREQUENCY_OPTIONS.find((o) => o.value === inputs.payrollFrequency)?.label.split(" (")[0];

  const cta = (name: string) => track("calculator_cta_clicked", { cta: name, verdict: result.verdict });

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

  const reportButton = (variant: "primary" | "secondary") => (
    <Button
      variant={variant}
      size="lg"
      className="w-full"
      onClick={() => {
        cta("email_report");
        onRequest("report");
      }}
    >
      Email me this report
    </Button>
  );

  return (
    <section
      id="results"
      aria-labelledby="results-heading"
      className="print-full scroll-mt-24 overflow-hidden rounded-3xl bg-white shadow-lift ring-1 ring-ink-200"
    >
      <div className="bg-brand-900 px-6 pb-6 pt-5 text-white sm:px-7">
        <h2 id="results-heading" className="text-sm font-semibold uppercase tracking-wider text-brand-200">
          Your estimate
        </h2>

        <p className="mt-4 text-sm text-brand-100">HR admin today</p>
        <p className="mt-1 text-2xl font-bold tabular-nums">
          {formatNumber(result.currentHours)} hours a year
        </p>
        <p className="text-sm text-brand-100">
          {money(result.currentCost)} in staff time, about {formatNumber(result.currentFte, 1)} full-time
          people
        </p>

        <div className="mt-5 border-t border-white/15 pt-5">
          <p className="text-sm text-brand-100">You could get back</p>
          <p className="mt-1 text-4xl font-extrabold tracking-tight text-mint-100 tabular-nums sm:text-5xl">
            {money(result.savedCost)}
            <span className="ml-1 text-base font-semibold text-brand-100">/ year</span>
          </p>
          <p className="mt-1 text-sm text-brand-100">
            {formatNumber(result.savedHours)} hours,{" "}
            {result.savedWorkingWeeks < 1
              ? "less than a working week"
              : `or ${formatNumber(result.savedWorkingWeeks)} working ${Math.round(result.savedWorkingWeeks) === 1 ? "week" : "weeks"}`}
          </p>
        </div>
      </div>

      <div className="space-y-5 px-6 py-6 sm:px-7">
        <div>
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${VERDICT_STYLE[result.verdict]}`}>
            {verdict.badge}
          </span>
          <p className="mt-3 font-bold text-ink-950">{verdict.headline}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{verdict.body}</p>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-ink-50 p-3">
              <dt className="text-ink-500">Return on cost</dt>
              <dd className="mt-0.5 text-lg font-bold text-ink-950 tabular-nums">
                {!Number.isFinite(result.returnMultiple)
                  ? "n/a"
                  : result.returnMultiple < 0.1
                    ? "under 0.1×"
                    : `${formatNumber(result.returnMultiple, 1)}×`}
              </dd>
            </div>
            <div className="rounded-xl bg-ink-50 p-3">
              <dt className="text-ink-500">Net benefit</dt>
              <dd
                className={`mt-0.5 text-lg font-bold tabular-nums ${result.netBenefit >= 0 ? "text-mint-700" : "text-coral-700"}`}
              >
                {money(result.netBenefit)}
              </dd>
            </div>
          </dl>
          <p className="mt-2 text-xs text-ink-500">
            Compared with an illustrative subscription of {money(result.annualSubscription)} a year (
            {formatMoney(inputs.pricePerEmployee, inputs.currency, { compact: inputs.pricePerEmployee >= 1000 })}{" "}
            per employee per month).
          </p>
        </div>

        <div className="no-print space-y-2.5">
          {result.verdict === "strong" && (
            <>
              <Button
                size="lg"
                className="w-full"
                onClick={() => {
                  cta("book_demo");
                  onRequest("demo");
                }}
              >
                Book a 20-minute walkthrough
              </Button>
              {reportButton("secondary")}
            </>
          )}
          {result.verdict === "moderate" && (
            <>
              {reportButton("primary")}
              <ButtonLink
                href={ROUTES.finder}
                variant="secondary"
                size="lg"
                className="w-full"
                onClick={() => cta("software_finder")}
              >
                Find the right package for you
              </ButtonLink>
            </>
          )}
          {result.verdict === "low" && (
            <>
              <ButtonLink
                href={`${ROUTES.resources}/how-to-reduce-payroll-errors#how-to-reduce-payroll-errors-without-new-software`}
                size="lg"
                className="w-full"
                onClick={() => cta("guides")}
              >
                Get quick wins without new software
              </ButtonLink>
              {reportButton("secondary")}
            </>
          )}

          <div className="flex flex-wrap justify-center gap-1 pt-1">
            <Button variant="ghost" className="h-9 px-3" onClick={copyLink}>
              {copied ? "Link copied" : "Copy shareable link"}
            </Button>
            <Button
              variant="ghost"
              className="h-9 px-3"
              onClick={() => {
                cta("print");
                window.print();
              }}
            >
              Print or save as PDF
            </Button>
          </div>
          <p aria-live="polite" className="sr-only">
            {copied ? "Link copied to clipboard" : ""}
          </p>
        </div>

        <p className="border-t border-ink-200 pt-4 text-xs leading-relaxed text-ink-500">
          Based on {formatNumber(inputs.employees)} employees, {inputs.entities}{" "}
          {inputs.entities === 1 ? "country" : "countries or entities"}, {frequency?.toLowerCase()} payroll
          and admin time at {money(inputs.hourlyCost)} an hour. These are estimates. See{" "}
          <a href="#how-we-calculate" className="font-medium text-brand-700 underline underline-offset-2">
            how we calculate
          </a>
          .
        </p>
      </div>
    </section>
  );
}
