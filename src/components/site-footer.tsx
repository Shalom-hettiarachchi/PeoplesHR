import Link from "next/link";
import { ROUTES } from "@/lib/site";
import { Logo } from "@/components/site-header";

export function SiteFooter() {
  return (
    <footer className="no-print mt-24 border-t border-ink-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[2fr_1fr_1fr]">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-3 text-sm text-ink-500">
            HR and payroll software for growing teams across multiple markets.
          </p>
        </div>
        <nav aria-label="Tools">
          <h2 className="text-sm font-semibold text-ink-950">Free tools</h2>
          <ul className="mt-3 space-y-2 text-sm text-ink-700">
            <li>
              <Link className="hover:text-brand-700" href={ROUTES.calculator}>
                HR admin cost calculator
              </Link>
            </li>
            <li>
              <Link className="hover:text-brand-700" href={ROUTES.finder}>
                HR software finder
              </Link>
            </li>
          </ul>
        </nav>
        <nav aria-label="Learn">
          <h2 className="text-sm font-semibold text-ink-950">Learn</h2>
          <ul className="mt-3 space-y-2 text-sm text-ink-700">
            <li>
              <Link className="hover:text-brand-700" href={ROUTES.resources}>
                Guides and checklists
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <p className="border-t border-ink-200 px-4 py-5 text-center text-xs text-ink-500">
        Prototype built for the PeoplesHR Web Experience Engineer assessment. Product names,
        packages and figures are illustrative.{" "}
        <Link href="/demo" className="font-medium text-brand-700 underline underline-offset-2">
          See what sales sees
        </Link>
      </p>
    </footer>
  );
}
