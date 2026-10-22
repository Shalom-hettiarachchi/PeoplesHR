import { saveDemoEvent } from "@/lib/demo-store";

/**
 * Pushes events to a GTM-style dataLayer. Nothing is sent anywhere in this
 * prototype; it shows which moments in each journey would be measured. Events
 * are also kept for this browser session so the /demo page can show the funnel.
 */
export function track(event: string, props: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const w = window as Window & { dataLayer?: unknown[] };
  w.dataLayer ??= [];
  w.dataLayer.push({ event, ...props });
  saveDemoEvent({ event, props: { ...props, page: window.location.pathname }, at: new Date().toISOString() });
  if (process.env.NODE_ENV !== "production") console.debug("[track]", event, props);
}
