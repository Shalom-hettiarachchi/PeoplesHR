"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { track } from "@/lib/analytics";

function articleProgress() {
  const article = document.getElementById("article");
  if (!article) return 0;
  const rect = article.getBoundingClientRect();
  const total = rect.height - window.innerHeight;
  return total <= 0 ? 1 : Math.min(1, Math.max(0, -rect.top / total));
}

/** Thin progress bar under the header, plus scroll-depth events (25/50/75/100%). */
export function ReadingProgress({ slug }: { slug: string }) {
  const [progress, setProgress] = useState(0);
  const reported = useRef(new Set<number>());

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const p = articleProgress();
        setProgress(p);
        for (const mark of [25, 50, 75, 100]) {
          if (p * 100 >= mark && !reported.current.has(mark)) {
            reported.current.add(mark);
            track("guide_scroll_depth", { guide: slug, depth: mark });
          }
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [slug]);

  return (
    <div aria-hidden="true" className="no-print fixed inset-x-0 top-16 z-30 h-1 bg-transparent">
      <div className="h-full bg-brand-500 transition-[width] duration-150" style={{ width: `${progress * 100}%` }} />
    </div>
  );
}

/**
 * A small prompt that changes as the reader gets further into the guide:
 * a tool part-way through, then a reminder about the checklist if they
 * scrolled past it. Hidden while the checklist or footer is on screen, and
 * dismissible for the rest of the visit.
 */
export function ScrollCta({ slug, items, hideWhenVisible }: { slug: string; items: { label: string; href: string }[]; hideWhenVisible: string }) {
  const [stage, setStage] = useState(-1);
  const [targetVisible, setTargetVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const target = document.getElementById(hideWhenVisible);
    const footer = document.querySelector("footer");
    const onScreen = (el: Element | null) => {
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight && r.bottom > 0;
    };
    const onScroll = () => {
      // First prompt (a tool) after 20% of the guide. Second prompt (the
      // checklist) only once the reader has scrolled past the checklist.
      const passedTarget = target ? target.getBoundingClientRect().bottom < 0 : false;
      // An unlocked checklist has no form left, so there's nothing to remind them about.
      const stillLocked = Boolean(target?.querySelector("form"));
      setStage(passedTarget ? (stillLocked ? 1 : -1) : articleProgress() >= 0.2 ? 0 : -1);
      // Don't advertise the checklist while it's already on screen, or cover the footer.
      setTargetVisible(onScreen(target) || onScreen(footer));
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restore dismissal after hydration
      if (window.sessionStorage.getItem("peopleshr-scroll-cta-dismissed")) setDismissed(true);
    } catch {
      // ignore
    }
    return () => window.removeEventListener("scroll", onScroll);
  }, [hideWhenVisible]);

  const item = items[Math.min(stage, items.length - 1)];
  const show = stage >= 0 && item && !dismissed && !targetVisible;

  useEffect(() => {
    if (show) track("scroll_cta_shown", { guide: slug, stage });
  }, [show, slug, stage]);

  function dismiss() {
    setDismissed(true);
    try {
      window.sessionStorage.setItem("peopleshr-scroll-cta-dismissed", "1");
    } catch {
      // ignore
    }
  }

  return (
    <div
      className={`no-print fixed inset-x-3 bottom-3 z-30 transition-all duration-300 sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-80 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
      aria-hidden={!show}
    >
      {item && (
        <div className="flex items-start gap-3 rounded-2xl bg-brand-900 p-4 text-white shadow-lift">
          <Link
            href={item.href}
            tabIndex={show ? undefined : -1}
            onClick={() => track("scroll_cta_clicked", { guide: slug, stage })}
            className="flex-1 text-sm font-semibold leading-snug hover:underline"
          >
            {item.label} →
          </Link>
          <button
            type="button"
            onClick={dismiss}
            tabIndex={show ? undefined : -1}
            aria-label="Dismiss suggestion"
            className="grid size-7 shrink-0 place-items-center rounded-full text-brand-200 hover:bg-white/10 hover:text-white"
          >
            <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
