"use client";

import { useId, useState, type FormEvent, type ReactNode } from "react";
import { leadSchema, ROLES, type LeadContext, type LeadIntent, type LeadSource } from "@/lib/leads/schema";
import { track } from "@/lib/analytics";
import { Button } from "@/components/ui/button";

type Status = "idle" | "submitting" | "success" | "error";

export interface LeadFormProps {
  source: LeadSource;
  intent: LeadIntent;
  /** Answers and results from the tool, sent with the lead for sales context. */
  context?: LeadContext;
  submitLabel: string;
  /** Show company and role fields (used for demo requests). */
  extended?: boolean;
  success: ReactNode;
  /** Called once the lead is saved, e.g. to unlock a checklist. */
  onSuccess?: () => void;
}

const fieldClass =
  "mt-1.5 block w-full rounded-xl border border-ink-300 bg-white px-3.5 py-2.5 text-base text-ink-950 placeholder:text-ink-500 focus:border-brand-500 focus:outline-none focus:ring-3 focus:ring-brand-100 aria-invalid:border-coral-500";

export function LeadForm({ source, intent, context = {}, submitLabel, extended, success, onSuccess }: LeadFormProps) {
  const id = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const text = (name: string) => {
      const value = String(form.get(name) ?? "").trim();
      return value === "" ? undefined : value;
    };

    const payload = {
      email: text("email") ?? "",
      firstName: text("firstName"),
      company: text("company"),
      role: text("role"),
      marketingConsent: form.get("marketingConsent") === "on",
      website: text("website"),
      source,
      intent,
      context,
    };

    const parsed = leadSchema.safeParse(payload);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        next[key] ??= issue.message;
      }
      setErrors(next);
      // Move focus to the first invalid field so keyboard and screen reader users find it.
      const first = Object.keys(next)[0];
      (event.currentTarget.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }

    setErrors({});
    setStatus("submitting");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data: { tier?: string } = await res.json();
      track("lead_submitted", { source, intent, tier: data.tier });
      setStatus("success");
      onSuccess?.();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="rounded-2xl bg-mint-50 p-5 text-ink-900">
        {success}
      </div>
    );
  }

  const errorId = (name: string) => (errors[name] ? `${id}-${name}-error` : undefined);

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor={`${id}-email`} className="text-sm font-semibold text-ink-900">
          Work email
        </label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          placeholder="name@company.com"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errorId("email")}
          className={fieldClass}
        />
        {errors.email && (
          <p id={errorId("email")} className="mt-1.5 text-sm font-medium text-coral-700">
            {errors.email}
          </p>
        )}
      </div>

      <div className={extended ? "grid gap-4 sm:grid-cols-2" : ""}>
        <div>
          <label htmlFor={`${id}-firstName`} className="text-sm font-semibold text-ink-900">
            First name <span className="font-normal text-ink-500">(optional)</span>
          </label>
          <input
            id={`${id}-firstName`}
            name="firstName"
            autoComplete="given-name"
            className={fieldClass}
          />
        </div>
        {extended && (
          <div>
            <label htmlFor={`${id}-company`} className="text-sm font-semibold text-ink-900">
              Company <span className="font-normal text-ink-500">(optional)</span>
            </label>
            <input
              id={`${id}-company`}
              name="company"
              autoComplete="organization"
              className={fieldClass}
            />
          </div>
        )}
      </div>

      {extended && (
        <div>
          <label htmlFor={`${id}-role`} className="text-sm font-semibold text-ink-900">
            Your role <span className="font-normal text-ink-500">(optional)</span>
          </label>
          <select id={`${id}-role`} name="role" defaultValue="" className={fieldClass}>
            <option value="">Choose one</option>
            {ROLES.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Honeypot: hidden from people and assistive tech. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className="flex items-start gap-3 text-sm text-ink-700">
        <input
          type="checkbox"
          name="marketingConsent"
          className="mt-0.5 size-4.5 shrink-0 rounded accent-brand-600"
        />
        <span>Send me occasional HR and payroll tips. You can unsubscribe at any time.</span>
      </label>

      <Button type="submit" size="lg" className="w-full" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : submitLabel}
      </Button>

      <p aria-live="polite" className="text-sm">
        {status === "error" && (
          <span className="font-medium text-coral-700">
            Something went wrong and we couldn&apos;t send that. Please try again.
          </span>
        )}
      </p>

      <p className="text-xs leading-relaxed text-ink-500">
        We only use your details to send what you asked for and, if you request it, to arrange a
        call. We never sell your data.
      </p>
    </form>
  );
}
