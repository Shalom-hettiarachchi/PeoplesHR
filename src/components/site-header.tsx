import Link from "next/link";
import { ROUTES } from "@/lib/site";
import { ButtonLink } from "@/components/ui/button";

const NAV = [
  { href: ROUTES.calculator, label: "Cost calculator" },
  { href: ROUTES.finder, label: "Software finder" },
  { href: ROUTES.resources, label: "Resources" },
];

export function Logo() {
  return (
    <span className="flex items-center gap-2 font-extrabold tracking-tight text-ink-950">
      <span
        aria-hidden="true"
        className="grid size-8 place-items-center rounded-lg bg-brand-600 text-sm text-white"
      >
        P
      </span>
      PeoplesHR
    </span>
  );
}

export function SiteHeader() {
  return (
    <header className="no-print sticky top-0 z-40 border-b border-ink-200/80 bg-white/90 backdrop-blur">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href={ROUTES.home} aria-label="PeoplesHR home">
          <Logo />
        </Link>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1 text-sm font-medium text-ink-700">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-full px-3 py-2 hover:bg-ink-100 hover:text-ink-950"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <ButtonLink href={`${ROUTES.calculator}#results`} variant="primary" className="h-10 px-4">
          Try the calculator
        </ButtonLink>
      </div>
    </header>
  );
}
