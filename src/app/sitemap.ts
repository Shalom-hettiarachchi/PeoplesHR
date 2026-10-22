import type { MetadataRoute } from "next";
import { absoluteUrl, ROUTES } from "@/lib/site";

// Fixed dates: update when a page's content changes. (Avoids the build time
// pretending every page changed on every deploy.)
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl(ROUTES.home), lastModified: "2026-10-22", priority: 0.6 },
    { url: absoluteUrl(ROUTES.calculator), lastModified: "2026-10-22", priority: 0.9 },
    { url: absoluteUrl(ROUTES.finder), lastModified: "2026-10-22", priority: 0.9 },
  ];
}
