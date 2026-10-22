"use client";

import { useEffect, useState } from "react";
import type { Checklist } from "@/lib/content/types";
import { LeadForm } from "@/components/lead/lead-form";
import { Button } from "@/components/ui/button";

const PREVIEW = 4;
const storageKey = (id: string) => `peopleshr-checklist-${id}`;

/**
 * Content upgrade: the first few items are free to read, the rest unlock in
 * exchange for an email. Once unlocked it becomes an interactive, printable
 * checklist and stays unlocked on this device.
 */
export function ChecklistOffer({ checklist, guideSlug, topic }: { checklist: Checklist; guideSlug: string; topic: string }) {
  const [unlocked, setUnlocked] = useState(false);
  const [done, setDone] = useState<number[]>([]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey(checklist.id));
      if (saved) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- restore after hydration
        setUnlocked(true);
        setDone(JSON.parse(saved) as number[]);
      }
    } catch {
      // Storage blocked: the visitor just sees the locked version.
    }
  }, [checklist.id]);

  function persist(next: number[]) {
    setDone(next);
    try {
      window.localStorage.setItem(storageKey(checklist.id), JSON.stringify(next));
    } catch {
      // ignore
    }
  }

  function print() {
    document.body.classList.add("print-checklist");
    const cleanup = () => {
      document.body.classList.remove("print-checklist");
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);
    window.print();
  }

  const visible = unlocked ? checklist.items : checklist.items.slice(0, PREVIEW);
  const locked = checklist.items.length - PREVIEW;

  return (
    <div data-print-target={unlocked ? "" : undefined} className="my-6 overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-ink-200">
      <div className="bg-mint-50 px-6 py-5">
        <p className="text-xs font-bold uppercase tracking-wider text-mint-700">Free checklist</p>
        <p className="mt-1 text-lg font-bold text-ink-950">{checklist.title}</p>
        <p className="mt-1 text-sm text-ink-700">{checklist.pitch}</p>
      </div>

      <ol className="divide-y divide-ink-100 px-6">
        {visible.map((item, i) => (
          <li key={item.text} className="flex gap-3 py-3.5">
            {unlocked ? (
              <input
                type="checkbox"
                id={`${checklist.id}-${i}`}
                checked={done.includes(i)}
                onChange={() => persist(done.includes(i) ? done.filter((d) => d !== i) : [...done, i])}
                className="mt-1 size-4.5 shrink-0 accent-mint-500"
              />
            ) : (
              <span aria-hidden="true" className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-ink-100 text-xs font-bold text-ink-500">
                {i + 1}
              </span>
            )}
            <label htmlFor={unlocked ? `${checklist.id}-${i}` : undefined} className="text-sm">
              <span className={`block font-semibold ${done.includes(i) ? "text-ink-500 line-through" : "text-ink-950"}`}>{item.text}</span>
              <span className="text-ink-500">{item.detail}</span>
            </label>
          </li>
        ))}
      </ol>

      {unlocked ? (
        <div className="no-print flex flex-wrap items-center justify-between gap-3 border-t border-ink-200 px-6 py-4">
          <p className="text-sm text-ink-700" aria-live="polite">
            {done.length} of {checklist.items.length} done
          </p>
          <div className="flex gap-2">
            {done.length > 0 && (
              <Button variant="ghost" className="h-9 px-3" onClick={() => persist([])}>
                Reset
              </Button>
            )}
            <Button variant="secondary" className="h-9 px-4" onClick={print}>
              Print checklist
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative border-t border-ink-200 px-6 pb-6 pt-5">
          <div aria-hidden="true" className="pointer-events-none select-none space-y-3 blur-[3px]">
            <div className="h-4 w-3/4 rounded bg-ink-200" />
            <div className="h-4 w-2/3 rounded bg-ink-200" />
          </div>
          <p className="mt-4 font-semibold text-ink-950">Unlock the other {locked} checks</p>
          <p className="mt-1 text-sm text-ink-500">
            Get the full interactive checklist here, plus a printable copy by email.
          </p>
          <div className="mt-4 max-w-md">
            <LeadForm
              source="content-hub"
              intent="checklist"
              context={{ guide: guideSlug, checklist: checklist.id, topic }}
              submitLabel="Unlock the full checklist"
              onSuccess={() => {
                setUnlocked(true);
                persist([]);
              }}
              success={<p className="font-bold">Unlocked. The printable copy is on its way.</p>}
            />
          </div>
        </div>
      )}
    </div>
  );
}
