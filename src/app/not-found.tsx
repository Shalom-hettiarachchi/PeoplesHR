import type { Metadata } from "next";
import Link from "next/link";
import { ROUTES } from "@/lib/site";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = { title: "Page not found" };

/** A lost visitor is still a visitor: offer the most useful places to go next. */
export default function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Page not found</p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-ink-950">We couldn&apos;t find that page</h1>
      <p className="mx-auto mt-4 max-w-xl text-lg text-ink-500">
        It may have moved, or the link may be wrong. These are the most useful places to start:
      </p>
      <ul className="mt-10 grid gap-4 text-left sm:grid-cols-3">
        {[
          { href: ROUTES.resources, title: "HR and payroll guides", body: "Search answers to everyday questions" },
          { href: ROUTES.calculator, title: "Cost calculator", body: "What manual HR admin costs you" },
          { href: ROUTES.finder, title: "Software finder", body: "Which package fits your team" },
        ].map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="block h-full rounded-2xl bg-white p-5 ring-1 ring-ink-200 transition hover:ring-brand-300">
              <span className="block font-bold text-ink-950">{item.title} →</span>
              <span className="mt-1 block text-sm text-ink-500">{item.body}</span>
            </Link>
          </li>
        ))}
      </ul>
      <ButtonLink href={ROUTES.home} variant="secondary" className="mt-10">
        Back to the home page
      </ButtonLink>
    </section>
  );
}
