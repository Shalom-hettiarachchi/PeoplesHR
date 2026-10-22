"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { EMPTY_ANSWERS, STEPS, type FinderAnswers, type Step } from "@/lib/finder/data";
import { recommend } from "@/lib/finder/recommend";
import { summarise } from "@/lib/finder/summary";
import { answersFromSearchParams, answersToSearchParams, isComplete, isStepAnswered } from "@/lib/finder/url-state";
import { track } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { FinderResults } from "./finder-results";

const STORAGE_KEY = "peopleshr-finder-v1";

type Saved = { answers: FinderAnswers; step: number };

function loadSaved(): Saved | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Saved) : null;
  } catch {
    return null;
  }
}

function save(value: Saved | null) {
  try {
    if (value) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage can be blocked (private mode); progress just won't be remembered.
  }
}

export function SoftwareFinder() {
  const [answers, setAnswers] = useState<FinderAnswers>(EMPTY_ANSWERS);
  const [step, setStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [restored, setRestored] = useState(false);
  const interacted = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  // Restore from a shared link first, then from saved progress.
  useEffect(() => {
    const fromUrl = answersFromSearchParams(new URLSearchParams(window.location.search));
    const saved = loadSaved();
    /* eslint-disable react-hooks/set-state-in-effect -- one-off restore after hydration */
    if (isComplete(fromUrl)) {
      setAnswers(fromUrl);
      setStep(STEPS.length - 1);
      setShowResults(true);
    } else if (saved && saved.step > 0) {
      setAnswers({ ...EMPTY_ANSWERS, ...saved.answers });
      setStep(Math.min(saved.step, STEPS.length - 1));
      setRestored(true);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
    track("finder_viewed", { shared: isComplete(fromUrl) });
  }, []);

  // Move focus to the new question so keyboard and screen reader users follow along.
  useEffect(() => {
    if (!interacted.current) return;
    if (showResults) {
      topRef.current?.scrollIntoView({ block: "start" });
      document.getElementById("finder-results-heading")?.focus({ preventScroll: true });
    } else {
      headingRef.current?.focus({ preventScroll: true });
    }
  }, [step, showResults]);

  const current = STEPS[step];
  const preview = useMemo(() => recommend(answers), [answers]);
  const answeredCount = STEPS.filter((s) => isStepAnswered(s, answers)).length;

  function commit(next: FinderAnswers, nextStep: number) {
    if (!interacted.current) track("finder_started");
    interacted.current = true;
    setAnswers(next);
    setStep(nextStep);
    save({ answers: next, step: nextStep });
  }

  function advance(next: FinderAnswers) {
    track("finder_step_completed", { step: current.id });
    if (step < STEPS.length - 1) {
      commit(next, step + 1);
      return;
    }
    commit(next, step);
    finish(next);
  }

  function finish(final: FinderAnswers) {
    const result = recommend(final);
    track("finder_completed", { package: result.recommended.pkg.id, match: result.recommended.match });
    window.history.replaceState(window.history.state, "", `${window.location.pathname}?${answersToSearchParams(final)}`);
    setShowResults(true);
  }

  function editStep(index: number) {
    interacted.current = true;
    setShowResults(false);
    setStep(index);
  }

  function restart() {
    interacted.current = true;
    save(null);
    setAnswers(EMPTY_ANSWERS);
    setStep(0);
    setShowResults(false);
    setRestored(false);
    window.history.replaceState(window.history.state, "", window.location.pathname);
  }

  if (showResults && isComplete(answers)) {
    return (
      <div ref={topRef} className="scroll-mt-24">
        <FinderResults answers={answers} result={preview} onEdit={editStep} onRestart={restart} />
      </div>
    );
  }

  return (
    <div ref={topRef} className="grid scroll-mt-24 items-start gap-6 lg:grid-cols-[1fr_340px]">
      <section aria-labelledby="finder-question" className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-ink-200 sm:p-9">
        <div className="flex items-center justify-between gap-4 text-sm">
          <p className="font-semibold text-brand-700">
            Question {step + 1} of {STEPS.length}
          </p>
          {(restored || answeredCount > 0) && (
            <button type="button" onClick={restart} className="font-medium text-ink-500 underline-offset-2 hover:text-ink-900 hover:underline">
              Start over
            </button>
          )}
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-ink-100" aria-hidden="true">
          <div
            className="h-full rounded-full bg-brand-600 transition-[width] duration-300"
            style={{ width: `${((step + (isStepAnswered(current, answers) ? 1 : 0)) / STEPS.length) * 100}%` }}
          />
        </div>

        {restored && step > 0 && (
          <p className="mt-4 rounded-xl bg-brand-50 px-4 py-2.5 text-sm text-brand-900">
            Welcome back. We saved your answers so you can pick up where you left off.
          </p>
        )}

        <h2
          id="finder-question"
          ref={headingRef}
          tabIndex={-1}
          className="mt-7 text-2xl font-bold tracking-tight text-ink-950 focus:outline-none sm:text-3xl"
        >
          {current.title}
        </h2>
        {current.help && <p className="mt-2 text-ink-500">{current.help}</p>}

        <div className="mt-7">
          <StepInput key={current.id} step={current} answers={answers} onAnswer={advance} />
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-ink-200 pt-5">
          <Button variant="ghost" onClick={() => editStep(step - 1)} disabled={step === 0} className="h-10 px-3">
            ← Back
          </Button>
          {isComplete(answers) && step < STEPS.length - 1 && (
            <Button variant="secondary" className="h-10 px-4" onClick={() => finish(answers)}>
              See my recommendation
            </Button>
          )}
        </div>
      </section>

      <aside aria-label="Your answers so far" className="hidden space-y-4 lg:block">
        <div className="rounded-3xl bg-white p-6 ring-1 ring-ink-200">
          <h2 className="text-sm font-bold text-ink-950">Your answers</h2>
          {answeredCount === 0 ? (
            <p className="mt-2 text-sm text-ink-500">Your answers will appear here. It takes about a minute.</p>
          ) : (
            <ul className="mt-3 space-y-2.5 text-sm">
              {STEPS.map((s, i) =>
                isStepAnswered(s, answers) ? (
                  <li key={s.id} className="flex items-start justify-between gap-3">
                    <span className="text-ink-700">{summarise(s, answers)}</span>
                    <button
                      type="button"
                      onClick={() => editStep(i)}
                      className="shrink-0 font-medium text-brand-700 hover:underline"
                      aria-label={`Change answer: ${s.title}`}
                    >
                      Change
                    </button>
                  </li>
                ) : null,
              )}
            </ul>
          )}
        </div>

        {answeredCount >= 2 && (
          <div className="rounded-3xl bg-white p-6 ring-1 ring-ink-200">
            <h2 className="text-sm font-bold text-ink-950">Early match</h2>
            <p className="mt-0.5 text-xs text-ink-500">Updates as you answer</p>
            <ul className="mt-4 space-y-3">
              {preview.matches.map((m) => {
                const leading = m.pkg.id === preview.recommended.pkg.id;
                return (
                  <li key={m.pkg.id}>
                    <div className="flex justify-between text-sm">
                      <span className={leading ? "font-bold text-ink-950" : "text-ink-700"}>{m.pkg.name}</span>
                      <span className="tabular-nums text-ink-500">{m.match}%</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-ink-100" aria-hidden="true">
                      <div
                        className={`h-full rounded-full transition-[width] duration-500 ${leading ? "bg-brand-600" : "bg-ink-300"}`}
                        style={{ width: `${m.match}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </aside>
    </div>
  );
}

const optionClass =
  "flex w-full flex-col rounded-2xl border border-ink-200 bg-white px-4 py-3.5 text-left transition-colors hover:border-brand-300 hover:bg-brand-50/40";
const selectedClass = "border-brand-600 bg-brand-50 ring-1 ring-brand-600";

function StepInput({ step, answers, onAnswer }: { step: Step; answers: FinderAnswers; onAnswer: (next: FinderAnswers) => void }) {
  if (step.kind === "single") {
    const value = answers[step.id];
    return (
      <div role="group" aria-labelledby="finder-question" className="grid gap-2.5 sm:grid-cols-2">
        {step.options.map((o) => {
          const selected = value === o.value;
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onAnswer({ ...answers, [step.id]: o.value })}
              className={`${optionClass} ${selected ? selectedClass : ""}`}
            >
              <span className="font-semibold text-ink-950">{o.label}</span>
              {"description" in o && o.description && <span className="mt-0.5 text-sm text-ink-500">{o.description}</span>}
            </button>
          );
        })}
      </div>
    );
  }

  return <MultiStep step={step} answers={answers} onAnswer={onAnswer} />;
}

function MultiStep({
  step,
  answers,
  onAnswer,
}: {
  step: Extract<Step, { kind: "multi" }>;
  answers: FinderAnswers;
  onAnswer: (next: FinderAnswers) => void;
}) {
  const initial = (step.id === "challenges" ? answers.challenges : answers.mustHaves ?? []) as string[];
  const [picked, setPicked] = useState<string[]>(initial);
  const full = picked.length >= step.max;
  const optional = step.id === "mustHaves";

  const toggle = (value: string) =>
    setPicked((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : full ? prev : [...prev, value]));

  return (
    <fieldset>
      <legend className="sr-only">{step.title}</legend>
      <div className="grid gap-2.5 sm:grid-cols-2">
        {step.options.map((o) => {
          const checked = picked.includes(o.value);
          const disabled = !checked && full;
          return (
            <label
              key={o.value}
              className={`${optionClass} cursor-pointer flex-row items-center gap-3 has-focus-visible:ring-3 has-focus-visible:ring-brand-300 ${
                checked ? selectedClass : ""
              } ${disabled ? "cursor-not-allowed opacity-50 hover:border-ink-200 hover:bg-white" : ""}`}
            >
              <input
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={() => toggle(o.value)}
                className="size-4.5 shrink-0 accent-brand-600"
              />
              <span className="font-semibold text-ink-950">{o.label}</span>
            </label>
          );
        })}
      </div>
      <p className="mt-3 text-sm text-ink-500" aria-live="polite">
        {full ? `That's ${step.max}, the most you can pick. Untick one to change it.` : `${picked.length} of up to ${step.max} picked`}
      </p>
      <Button
        size="lg"
        className="mt-5 w-full sm:w-auto"
        disabled={!optional && picked.length === 0}
        onClick={() => onAnswer({ ...answers, [step.id]: picked })}
      >
        {optional && picked.length === 0 ? "None of these, continue" : "Continue"}
      </Button>
    </fieldset>
  );
}
