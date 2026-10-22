"use client";

import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { CURRENCIES, LIMITS, type CurrencyCode, type Method } from "@/lib/calculator/assumptions";
import {
  calculate,
  defaultInputs,
  employeesToSlider,
  RATED_PROCESSES,
  sliderToEmployees,
  type CalculatorInputs,
  type RatedProcessId,
} from "@/lib/calculator/model";
import { CORRECTION_OPTIONS, FREQUENCY_OPTIONS, METHOD_OPTIONS, PROCESS_COPY, VERDICT_COPY } from "@/lib/calculator/content";
import { fromSearchParams, toSearchParams } from "@/lib/calculator/url-state";
import { formatMoney, formatNumber } from "@/lib/format";
import { track } from "@/lib/analytics";
import { LeadDialog } from "@/components/lead/lead-dialog";
import { LeadForm } from "@/components/lead/lead-form";
import { NumberField, RadioCards, SelectField } from "./fields";
import { ResultsPanel } from "./results-panel";
import { Breakdown } from "./breakdown";

type Dialog = null | "report" | "demo";

const CURRENCY_OPTIONS = Object.values(CURRENCIES).map((c) => ({ value: c.code, label: `${c.code} · ${c.label}` }));

export function CostCalculator() {
  const id = useId();
  const [inputs, setInputs] = useState<CalculatorInputs>(() => defaultInputs());
  const [dialog, setDialog] = useState<Dialog>(null);
  const [announcement, setAnnouncement] = useState("");
  const [resultsVisible, setResultsVisible] = useState(false);
  const dirty = useRef(false);
  const result = useMemo(() => calculate(inputs), [inputs]);

  // Load a shared scenario from the link. Reading the URL in the browser
  // (not on the server) keeps the page fully prerendered and fast.
  useEffect(() => {
    const shared = fromSearchParams(new URLSearchParams(window.location.search));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-off sync from the URL after hydration
    if (shared) setInputs(shared);
    track("calculator_viewed", { shared: Boolean(shared) });
  }, []);

  // After the visitor changes something: keep the link shareable and tell
  // screen reader users the new result once they pause.
  useEffect(() => {
    if (!dirty.current) return;
    const timer = setTimeout(() => {
      const url = `${window.location.pathname}?${toSearchParams(inputs)}${window.location.hash}`;
      window.history.replaceState(window.history.state, "", url);
      setAnnouncement(
        `You could get back ${formatMoney(result.savedCost, inputs.currency)} a year, ${formatNumber(result.savedHours)} hours. ${VERDICT_COPY[result.verdict].badge}.`,
      );
    }, 700);
    return () => clearTimeout(timer);
  }, [inputs, result]);

  // Show the mobile summary bar only while the results card is still below the viewport.
  useEffect(() => {
    const el = document.getElementById("results");
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setResultsVisible(entry.isIntersecting || entry.boundingClientRect.top < 0),
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function update(change: (prev: CalculatorInputs) => CalculatorInputs) {
    if (!dirty.current) track("calculator_started");
    dirty.current = true;
    setInputs(change);
  }

  const setField = <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) =>
    update((prev) => ({ ...prev, [key]: value }));

  const setMethod = (process: RatedProcessId, method: Method) =>
    update((prev) => ({ ...prev, methods: { ...prev.methods, [process]: method } }));

  const setCurrency = (code: CurrencyCode) =>
    update((prev) => ({
      ...prev,
      currency: code,
      hourlyCost: CURRENCIES[code].defaultHourlyCost,
      pricePerEmployee: CURRENCIES[code].defaultPricePerEmployee,
    }));

  const currency = CURRENCIES[inputs.currency];
  const sliderFill = `${employeesToSlider(inputs.employees)}%`;

  const leadContext = {
    employees: inputs.employees,
    entities: inputs.entities,
    currency: inputs.currency,
    verdict: result.verdict,
    savedHoursPerYear: Math.round(result.savedHours),
    savedCostPerYear: Math.round(result.savedCost),
    biggestOpportunity: result.biggestOpportunity ?? "none",
    scenario: toSearchParams(inputs).toString(),
  };

  return (
    <>
      <div className="grid items-start gap-6 lg:grid-cols-[1fr_420px]">
        <div className="no-print space-y-6">
          <Card step={1} title="About your organisation">
            <div>
              <div className="flex items-end justify-between gap-4">
                <label id={`${id}-emp-label`} htmlFor={`${id}-emp`} className="text-sm font-semibold text-ink-900">
                  Number of employees
                  <span className="mt-0.5 block font-normal text-ink-500">Everyone you pay, full and part time</span>
                </label>
                <div className="w-28 shrink-0">
                  <NumberField
                    id={`${id}-emp`}
                    label="Number of employees"
                    value={inputs.employees}
                    min={LIMITS.employees.min}
                    max={LIMITS.employees.max}
                    onChange={(v) => setField("employees", v)}
                  />
                </div>
              </div>
              <input
                type="range"
                className="range mt-2"
                min={0}
                max={100}
                step={0.5}
                value={employeesToSlider(inputs.employees)}
                onChange={(e) => setField("employees", sliderToEmployees(Number(e.target.value)))}
                aria-labelledby={`${id}-emp-label`}
                aria-valuetext={`${inputs.employees} employees`}
                style={{ ["--fill" as string]: sliderFill }}
              />
              {/* Tick labels sit at their real positions on the log-scale slider. */}
              <div className="relative h-4 text-xs text-ink-500" aria-hidden="true">
                {[LIMITS.employees.min, 25, 100, 500, LIMITS.employees.max].map((n, i, all) => (
                  <span
                    key={n}
                    className="absolute top-0"
                    style={{
                      left: `${employeesToSlider(n)}%`,
                      transform: i === 0 ? "none" : i === all.length - 1 ? "translateX(-100%)" : "translateX(-50%)",
                    }}
                  >
                    {formatNumber(n)}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor={`${id}-ent`} className="text-sm font-semibold text-ink-900">
                  Countries you run payroll in
                </label>
                <p id={`${id}-ent-hint`} className="mt-0.5 text-sm text-ink-500">
                  Count each legal entity separately
                </p>
                <div className="mt-1.5">
                  <NumberField
                    id={`${id}-ent`}
                    label="Countries"
                    describedBy={`${id}-ent-hint`}
                    value={inputs.entities}
                    min={LIMITS.entities.min}
                    max={LIMITS.entities.max}
                    stepper
                    onChange={(v) => setField("entities", v)}
                  />
                </div>
              </div>
              <SelectField
                label="How often you pay people"
                hint="Your most common pay cycle"
                value={inputs.payrollFrequency}
                options={FREQUENCY_OPTIONS}
                onChange={(v) => setField("payrollFrequency", v)}
              />
            </div>

            <SelectField
              label="Currency"
              value={inputs.currency}
              options={CURRENCY_OPTIONS}
              onChange={setCurrency}
            />
          </Card>

          <Card
            step={2}
            title="How you work today"
            intro="Be honest: “partly automated” often means software plus a lot of spreadsheets."
          >
            {RATED_PROCESSES.map((process) => (
              <RadioCards
                key={process}
                name={`${id}-${process}`}
                legend={PROCESS_COPY[process].question}
                value={inputs.methods[process]}
                options={METHOD_OPTIONS}
                onChange={(m) => setMethod(process, m)}
              />
            ))}
          </Card>

          <Card step={3} title="Payroll accuracy">
            <RadioCards
              name={`${id}-corrections`}
              legend="How often does a payslip need correcting or a pay run need redoing?"
              value={inputs.corrections}
              options={CORRECTION_OPTIONS}
              onChange={(v) => setField("corrections", v)}
            />
          </Card>

          <details className="group rounded-3xl bg-white shadow-card ring-1 ring-ink-200">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-3xl p-6 sm:px-8">
              <span>
                <span className="block font-bold text-ink-950">Fine-tune the assumptions</span>
                <span className="text-sm text-ink-500">Staff cost, staff turnover and software price</span>
              </span>
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                className="size-5 shrink-0 text-ink-500 transition-transform group-open:rotate-180"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </summary>
            <div className="grid gap-5 px-6 pb-7 sm:grid-cols-3 sm:px-8">
              <Labelled htmlFor={`${id}-rate`} label="Admin cost per hour" hint="Salary plus overheads">
                <NumberField
                  id={`${id}-rate`}
                  label="Admin cost per hour"
                  value={inputs.hourlyCost}
                  min={0}
                  max={1_000_000}
                  step={currency.hourlyStep}
                  prefix={currency.code}
                  onChange={(v) => setField("hourlyCost", v)}
                />
              </Labelled>
              <Labelled htmlFor={`${id}-turn`} label="Staff turnover" hint="Leavers per year">
                <NumberField
                  id={`${id}-turn`}
                  label="Staff turnover"
                  value={inputs.annualTurnoverPct}
                  min={LIMITS.turnoverPct.min}
                  max={LIMITS.turnoverPct.max}
                  suffix="%"
                  onChange={(v) => setField("annualTurnoverPct", v)}
                />
              </Labelled>
              <Labelled htmlFor={`${id}-price`} label="Software price" hint="Per employee per month">
                <NumberField
                  id={`${id}-price`}
                  label="Software price per employee per month"
                  value={inputs.pricePerEmployee}
                  min={0}
                  max={1_000_000}
                  step={currency.priceStep}
                  prefix={currency.code}
                  onChange={(v) => setField("pricePerEmployee", v)}
                />
              </Labelled>
              <p className="text-xs text-ink-500 sm:col-span-3">
                The software price is illustrative for this prototype, not a PeoplesHR quote. Change it to
                match a quote you have.
              </p>
            </div>
          </details>
        </div>

        <div className="lg:sticky lg:top-24">
          <ResultsPanel inputs={inputs} result={result} onRequest={setDialog} />
        </div>
      </div>

      <Breakdown inputs={inputs} result={result} />

      <p aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </p>

      {/* Mobile: keep the headline number in view while answering questions. */}
      <a
        href="#results"
        aria-hidden={resultsVisible}
        tabIndex={resultsVisible ? -1 : undefined}
        className={`no-print fixed inset-x-3 bottom-3 z-30 flex items-center justify-between gap-3 rounded-2xl bg-brand-900 px-5 py-3.5 text-white shadow-lift transition-all duration-300 lg:hidden ${
          resultsVisible ? "pointer-events-none translate-y-24 opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        <span>
          <span className="block text-xs text-brand-200">You could get back</span>
          <span className="text-lg font-bold tabular-nums text-mint-100">
            {formatMoney(result.savedCost, inputs.currency)} / year
          </span>
        </span>
        <span className="text-sm font-semibold">See results ↓</span>
      </a>

      <LeadDialog
        open={dialog === "report"}
        onClose={() => setDialog(null)}
        title="Get your report by email"
        description="We'll send a summary of these results and the assumptions behind them, ready to forward to finance or leadership."
      >
        <LeadForm
          source="cost-calculator"
          intent="report"
          context={leadContext}
          submitLabel="Send my report"
          success={
            <>
              <p className="font-bold">Your report is on its way.</p>
              <p className="mt-1 text-sm text-ink-700">
                Check your inbox in the next few minutes. (In this prototype no email is actually sent.)
              </p>
              <button
                type="button"
                onClick={() => {
                  setDialog(null);
                  setTimeout(() => window.print(), 100);
                }}
                className="mt-3 text-sm font-semibold text-brand-700 underline underline-offset-2"
              >
                Print or save it as a PDF now
              </button>
            </>
          }
        />
      </LeadDialog>

      <LeadDialog
        open={dialog === "demo"}
        onClose={() => setDialog(null)}
        title="Book a 20-minute walkthrough"
        description="A PeoplesHR specialist will go through your numbers and show how the modules behind your biggest savings work. No long sales pitch."
      >
        <LeadForm
          source="cost-calculator"
          intent="demo"
          extended
          context={leadContext}
          submitLabel="Request my walkthrough"
          success={
            <>
              <p className="font-bold">Thanks, we&apos;ll be in touch within one working day.</p>
              <p className="mt-1 text-sm text-ink-700">
                Your specialist will already have these results, so the call starts with your situation, not
                a script.
              </p>
            </>
          }
        />
      </LeadDialog>
    </>
  );
}

function Card({ step, title, intro, children }: { step: number; title: string; intro?: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-ink-200 sm:p-8">
      <h2 className="flex items-center gap-3 text-lg font-bold text-ink-950">
        <span
          aria-hidden="true"
          className="grid size-7 place-items-center rounded-full bg-brand-100 text-sm font-bold text-brand-700"
        >
          {step}
        </span>
        {title}
      </h2>
      {intro && <p className="mt-2 text-sm text-ink-500">{intro}</p>}
      <div className="mt-6 space-y-6">{children}</div>
    </section>
  );
}

function Labelled({ htmlFor, label, hint, children }: { htmlFor: string; label: string; hint: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="text-sm font-semibold text-ink-900">
        {label}
      </label>
      <p className="mt-0.5 text-sm text-ink-500">{hint}</p>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
