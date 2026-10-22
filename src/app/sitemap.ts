import type { MetadataRoute } from "next";
import { GUIDES } from "@/lib/content/guides";
import { guidePath } from "@/lib/content/utils";
import { absoluteUrl, ROUTES } from "@/lib/site";

// Dates are set by hand (and from each guide's "updated" field) so the sitemap
// only signals a change when content actually changed, not on every deploy.
export default function sitemap(): MetadataRoute.Sitemap {
  const latestGuide = GUIDES.map((g) => g.updated).sort().at(-1)!;
  return [
    { url: absoluteUrl(ROUTES.home), lastModified: "2026-10-22", priority: 0.6 },
    { url: absoluteUrl(ROUTES.calculator), lastModified: "2026-10-22", priority: 0.9 },
    { url: absoluteUrl(ROUTES.finder), lastModified: "2026-10-22", priority: 0.9 },
    { url: absoluteUrl(ROUTES.resources), lastModified: latestGuide, priority: 0.8 },
    ...GUIDES.map((g) => ({ url: absoluteUrl(guidePath(g.slug)), lastModified: g.updated, priority: 0.7 })),
  ];
}
