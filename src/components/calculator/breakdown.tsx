import type { CalculatorInputs, CalculatorResult } from "@/lib/calculator/model";
import { PROCESS_COPY } from "@/lib/calculator/content";
import { formatMoney, formatNumber } from "@/lib/format";

/** Where the hours go today, and what's left once each process runs in PeoplesHR. */
export function Breakdown({ inputs, result }: { inputs: CalculatorInputs; result: CalculatorResult }) {
  const max = Math.max(...result.processes.map((p) => p.currentHours), 1);
  const ranked = [...result.processes].filter((p) => p.savedHours >= 1).sort((a, b) => b.savedHours - a.savedHours);
  const top = ranked[0];

  return (
    <section aria-labelledby="breakdown-heading" className="mt-10 grid gap-6 lg:grid-cols-[1fr_420px]">
      <div className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-ink-200 sm:p-8">
        <h2 id="breakdown-heading" className="text-xl font-bold text-ink-950">
          Where your time goes
        </h2>
        <p className="mt-1 text-sm text-ink-500">Hours per year, today and with PeoplesHR.</p>

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-ink-700" aria-hidden="true">
          <span className="flex items-center gap-2">
            <span className="size-3 rounded-sm bg-ink-300" /> Still needed with PeoplesHR
          </span>
          <span className="flex items-center gap-2">
            <span className="size-3 rounded-sm bg-mint-500" /> Time you&apos;d get back
          </span>
        </div>

        <ul className="mt-5 space-y-5">
          {result.processes.map((p) => {
            const width = (p.currentHours / max) * 100;
            const futureShare = p.currentHours > 0 ? (p.futureHours / p.currentHours) * 100 : 100;
            return (
              <li key={p.id}>
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="font-semibold text-ink-900">{PROCESS_COPY[p.id].label}</span>
                  <span className="shrink-0 tabular-nums text-ink-500">
                    {formatNumber(p.currentHours)} h →{" "}
                    <span className="font-semibold text-ink-900">{formatNumber(p.futureHours)} h</span>
                  </span>
                </div>
                <div
                  className="mt-2 h-3 overflow-hidden rounded-full bg-ink-100"
                  role="img"
                  aria-label={`${PROCESS_COPY[p.id].label}: ${formatNumber(p.currentHours)} hours a year today, ${formatNumber(p.futureHours)} with PeoplesHR, saving ${formatNumber(p.savedHours)} hours.`}
                >
                  <div className="flex h-full transition-[width] duration-500" style={{ width: `${width}%` }}>
                    <div className="h-full bg-ink-300" style={{ width: `${futureShare}%` }} />
                    <div className="h-full flex-1 bg-mint-500" />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="space-y-4">
        {top ? (
          <div className="rounded-3xl bg-mint-50 p-6 ring-1 ring-mint-100 sm:p-7">
            <p className="text-xs font-bold uppercase tracking-wider text-mint-700">Your biggest opportunity</p>
            <h3 className="mt-2 text-lg font-bold text-ink-950">{PROCESS_COPY[top.id].label}</h3>
            <p className="mt-1 text-sm font-semibold text-mint-700">
              {formatNumber(top.savedHours)} hours and {formatMoney(top.savedCost, inputs.currency)} a year
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink-700">{PROCESS_COPY[top.id].insight}</p>
          </div>
        ) : (
          <div className="rounded-3xl bg-white p-6 ring-1 ring-ink-200">
            <h3 className="font-bold text-ink-950">Your processes are already well automated</h3>
            <p className="mt-2 text-sm text-ink-500">
              There&apos;s little admin time left to recover. Accuracy, reporting and employee experience may
              still be worth reviewing.
            </p>
          </div>
        )}

        {ranked.length > 1 && (
          <div className="rounded-3xl bg-white p-6 ring-1 ring-ink-200 sm:p-7">
            <h3 className="font-bold text-ink-950">What would make the difference</h3>
            <ul className="mt-3 space-y-3">
              {ranked.slice(0, 4).map((p) => (
                <li key={p.id} className="flex items-start justify-between gap-3 text-sm">
                  <span>
                    <span className="block font-semibold text-ink-900">{PROCESS_COPY[p.id].module}</span>
                    <span className="text-ink-500">{PROCESS_COPY[p.id].label}</span>
                  </span>
                  <span className="shrink-0 font-semibold tabular-nums text-mint-700">
                    {formatNumber(p.savedHours)} h
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
