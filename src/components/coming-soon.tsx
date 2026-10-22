import { ButtonLink } from "@/components/ui/button";
import { ROUTES } from "@/lib/site";

/** Temporary page body for prototypes that are still being built. */
export function ComingSoon({ title, body }: { title: string; body: string }) {
  return (
    <section className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Coming soon</p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-ink-950">{title}</h1>
      <p className="mt-4 text-lg text-ink-500">{body}</p>
      <ButtonLink href={ROUTES.calculator} className="mt-8">
        Try the HR admin cost calculator
      </ButtonLink>
    </section>
  );
}
