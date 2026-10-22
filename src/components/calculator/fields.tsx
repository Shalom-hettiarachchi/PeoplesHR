"use client";

import { useId, useState, type ReactNode } from "react";

const inputClass =
  "block w-full rounded-xl border border-ink-300 bg-white px-3.5 py-2.5 text-base font-semibold text-ink-950 tabular-nums focus:border-brand-500 focus:outline-none focus:ring-3 focus:ring-brand-100";

/**
 * Number input that lets people type freely (e.g. clear the field, type "1"
 * on the way to "120") and only clamps the value when they leave the field.
 */
export function NumberField({
  id,
  value,
  onChange,
  min,
  max,
  step = 1,
  prefix,
  suffix,
  stepper,
  label,
  describedBy,
}: {
  id: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  stepper?: boolean;
  /** Used to name the − and + buttons. The input itself is named by its visible <label>. */
  label: string;
  describedBy?: string;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const clamp = (n: number) => Math.min(max, Math.max(min, n));

  const commit = (raw: string) => {
    const n = Number(raw);
    if (raw.trim() !== "" && Number.isFinite(n)) onChange(clamp(n));
    setDraft(null);
  };

  const field = (
    <div className="relative flex-1">
      {prefix && (
        <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-sm font-medium text-ink-500">
          {prefix}
        </span>
      )}
      <input
        id={id}
        type="number"
        inputMode="decimal"
        min={min}
        max={max}
        step={step}
        value={draft ?? String(value)}
        aria-describedby={describedBy}
        onChange={(e) => {
          setDraft(e.target.value);
          const n = Number(e.target.value);
          if (e.target.value !== "" && Number.isFinite(n) && n >= min && n <= max) onChange(n);
        }}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit(e.currentTarget.value);
        }}
        className={`${inputClass} ${prefix ? "pl-12" : ""} ${suffix ? "pr-16" : ""}`}
      />
      {suffix && (
        <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-sm font-medium text-ink-500">
          {suffix}
        </span>
      )}
    </div>
  );

  if (!stepper) return field;

  const stepButton = (delta: number, text: string, aria: string) => (
    <button
      type="button"
      aria-label={aria}
      disabled={delta < 0 ? value <= min : value >= max}
      onClick={() => onChange(clamp(value + delta))}
      className="grid size-11 shrink-0 place-items-center rounded-xl border border-ink-300 bg-white text-lg font-bold text-ink-700 hover:bg-ink-100 disabled:opacity-40"
    >
      <span aria-hidden="true">{text}</span>
    </button>
  );

  return (
    <div className="flex items-center gap-2">
      {stepButton(-step, "−", `Decrease ${label.toLowerCase()}`)}
      {field}
      {stepButton(step, "+", `Increase ${label.toLowerCase()}`)}
    </div>
  );
}

export function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
  hint,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  hint?: string;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-ink-900">
        {label}
      </label>
      {hint && <p className="mt-0.5 text-sm text-ink-500">{hint}</p>}
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className={`${inputClass} mt-1.5 font-medium`}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/** A radio group drawn as cards. Real radio inputs keep it keyboard and screen reader friendly. */
export function RadioCards<T extends string>({
  legend,
  name,
  value,
  options,
  onChange,
  extra,
}: {
  legend: ReactNode;
  name: string;
  value: T;
  options: { value: T; label: string; description: string }[];
  onChange: (value: T) => void;
  extra?: ReactNode;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-ink-900">{legend}</legend>
      {extra}
      <div className="mt-2 grid grid-cols-3 gap-2">
        {options.map((o) => (
          <label
            key={o.value}
            className="relative flex cursor-pointer flex-col justify-center rounded-xl border border-ink-200 bg-white px-2.5 py-2.5 text-center transition-colors hover:border-brand-300 has-checked:border-brand-600 has-checked:bg-brand-50 has-checked:ring-1 has-checked:ring-brand-600 has-focus-visible:ring-3 has-focus-visible:ring-brand-300 sm:justify-start sm:px-3.5 sm:py-3 sm:text-left"
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
              className="sr-only"
            />
            <span className="text-sm font-semibold leading-tight text-ink-950">{o.label}</span>
            {/* Hidden visually on phones to keep the list short; still read by screen readers. */}
            <span className="sr-only mt-0.5 text-xs leading-snug text-ink-500 sm:not-sr-only">{o.description}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
