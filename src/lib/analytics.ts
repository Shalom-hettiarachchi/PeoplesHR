/**
 * Pushes events to a GTM-style dataLayer. Nothing is sent anywhere in this
 * prototype; it shows which moments in each journey would be measured.
 */
export function track(event: string, props: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const w = window as Window & { dataLayer?: unknown[] };
  w.dataLayer ??= [];
  w.dataLayer.push({ event, ...props });
  if (process.env.NODE_ENV !== "production") console.debug("[track]", event, props);
}
