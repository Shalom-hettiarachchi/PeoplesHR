"use client";

import { useId, useRef, useState } from "react";
import Link from "next/link";
import {
  ASSUMPTIONS as A,
  CURRENCIES,
  METHOD_FACTOR,
  PEOPLESHR_FACTOR,
  RUNS_PER_YEAR,
  type CorrectionLevel,
  type Method,
  type PayrollFrequency,
} from "@/lib/calculator/assumptions";
import { CORRECTION_OPTIONS, FREQUENCY_OPTIONS, METHOD_OPTIONS } from "@/lib/calculator/content";
import { defaultInputs } from "@/lib/calculator/model";
import { toSearchParams } from "@/lib/calculator/url-state";
import { formatMoney, formatNumber } from "@/lib/format";
import { ROUTES } from "@/lib/site";
import { track } from "@/lib/analytics";
import { NumberField, RadioCards, SelectField } from "@/components/calculator/fields";
import { buttonClass } from "@/components/ui/button";

/*
  Small calculators embedded in guides. They use the same assumptions as the
  full cost calculator and hand their answers over to it, so a reader can go
  from "how much does this one problem cost?" to the full picture in one click.
*/

const HOURLY = CURRENCIES.USD.defaultHourlyCost;

function useTrackOnce(name: string) {
  const done = useRef(false);
  return () => {
    if (done.current) return;
    done.current = true;
    track("estimator_used", { estimator: name });
  };
}

function Shell({ title, children, result, cta }: { title: string; children: React.ReactNode; result: React.ReactNode; cta: React.ReactNode }) {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-ink-200">
      <div className="border-b border-ink-200 bg-brand-50 px-6 py-4">
        <p className="text-xs font-bold uppercase tracking-wider text-brand-700">Quick estimate</p>
        <p className="mt-1 font-bold text-ink-950">{title}</p>
      </div>
      <div className="grid gap-6 p-6 md:grid-cols-[1.2fr_1fr]">
        <div className="space-y-5">{children}</div>
        <div className="flex flex-col justify-between gap-5 rounded-2xl bg-brand-900 p-5 text-white">
          <div aria-live="polite">{result}</div>
          {cta}
        </div>
      </div>
    </div>
  );
}

export function CorrectionsEstimator() {
  const id = useId();
  const [employees, setEmployees] = useState(80);
  const [frequency, setFrequency] = useState<PayrollFrequency>("monthly");
  const [level, setLevel] = useState<CorrectionLevel>("sometimes");
  const used = useTrackOnce("corrections");

  const payslips = employees * RUNS_PER_YEAR[frequency];
  const corrections = payslips * A.corrections.rate[level];
  const hours = corrections * A.corrections.hoursEach;
  const cost = hours * HOURLY;

  const href = `${ROUTES.calculator}?${toSearchParams({ ...defaultInputs(), employees, payrollFrequency: frequency, corrections: level })}`;

  return (
    <Shell
      title="What are payroll corrections costing you?"
      result={
        <>
          <p className="text-sm text-brand-100">Each year, about</p>
          <p className="mt-1 text-3xl font-extrabold tabular-nums text-mint-100">{formatNumber(corrections)} corrections</p>
          <p className="mt-2 text-sm text-brand-100">
            {formatNumber(hours)} hours of rework, worth {formatMoney(cost, "USD")} at {formatMoney(HOURLY, "USD")} an hour
          </p>
        </>
      }
      cta={
        <Link href={href} className={buttonClass("inverse", "md", "w-full")} onClick={() => track("estimator_cta_clicked", { estimator: "corrections" })}>
          See your full HR admin cost →
        </Link>
      }
    >
      <div>
        <label htmlFor={`${id}-emp`} className="text-sm font-semibold text-ink-900">
          Employees on payroll
        </label>
        <div className="mt-1.5 max-w-40">
          <NumberField id={`${id}-emp`} label="Employees" value={employees} min={1} max={5000} onChange={(v) => { used(); setEmployees(v); }} />
        </div>
      </div>
      <SelectField label="Pay frequency" value={frequency} options={FREQUENCY_OPTIONS} onChange={(v) => { used(); setFrequency(v); }} />
      <RadioCards
        name={`${id}-level`}
        legend="How often does a payslip need fixing?"
        value={level}
        options={CORRECTION_OPTIONS}
        onChange={(v) => { used(); setLevel(v); }}
      />
    </Shell>
  );
}

export function LeaveEstimator() {
  const id = useId();
  const [employees, setEmployees] = useState(60);
  const [method, setMethod] = useState<Method>("manual");
  const used = useTrackOnce("leave");

  const manual = (employees * A.leave.minutesPerEmployeePerMonth * 12) / 60;
  const current = manual * METHOD_FACTOR[method];
  const saved = Math.max(0, current - manual * PEOPLESHR_FACTOR);

  const defaults = defaultInputs();
  const href = `${ROUTES.calculator}?${toSearchParams({ ...defaults, employees, methods: { ...defaults.methods, leave: method } })}`;

  return (
    <Shell
      title="How much time goes on leave admin?"
      result={
        <>
          <p className="text-sm text-brand-100">Your team spends about</p>
          <p className="mt-1 text-3xl font-extrabold tabular-nums text-mint-100">{formatNumber(current)} hours a year</p>
          <p className="mt-2 text-sm text-brand-100">
            {saved > 0
              ? `on leave admin. Automating it could give back around ${formatNumber(saved)} hours (${formatMoney(saved * HOURLY, "USD")}).`
              : "on leave admin. It's already well automated."}
          </p>
        </>
      }
      cta={
        <Link href={href} className={buttonClass("inverse", "md", "w-full")} onClick={() => track("estimator_cta_clicked", { estimator: "leave" })}>
          See your full HR admin cost →
        </Link>
      }
    >
      <div>
        <label htmlFor={`${id}-emp`} className="text-sm font-semibold text-ink-900">
          Number of employees
        </label>
        <div className="mt-1.5 max-w-40">
          <NumberField id={`${id}-emp`} label="Employees" value={employees} min={1} max={5000} onChange={(v) => { used(); setEmployees(v); }} />
        </div>
      </div>
      <RadioCards
        name={`${id}-method`}
        legend="How do you track leave today?"
        value={method}
        options={METHOD_OPTIONS}
        onChange={(v) => { used(); setMethod(v); }}
      />
    </Shell>
  );
}
