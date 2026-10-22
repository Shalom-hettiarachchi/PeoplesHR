"use client";

import { useEffect, useState } from "react";

type Item = { id: string; label: string };

/** Table of contents that highlights the section currently being read. */
export function TableOfContents({ items }: { items: Item[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setActive(visible[0].target.id);
      },
      { rootMargin: "-90px 0px -65% 0px" },
    );
    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [items]);

  const list = (
    <ol className="space-y-1 text-sm">
      {items.map((item) => {
        const isActive = item.id === active;
        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={isActive ? "location" : undefined}
              className={`block border-l-2 py-1.5 pl-3 leading-snug transition-colors ${
                isActive
                  ? "border-brand-600 font-semibold text-brand-700"
                  : "border-ink-200 text-ink-500 hover:border-ink-300 hover:text-ink-900"
              }`}
            >
              {item.label}
            </a>
          </li>
        );
      })}
    </ol>
  );

  return (
    <>
      <nav aria-label="On this page" className="hidden lg:block">
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-500">On this page</p>
        {list}
      </nav>
      <details className="rounded-2xl bg-white ring-1 ring-ink-200 lg:hidden">
        <summary className="cursor-pointer px-5 py-3.5 text-sm font-semibold text-ink-900">On this page</summary>
        <nav aria-label="On this page" className="px-5 pb-4">
          {list}
        </nav>
      </details>
    </>
  );
}
