/** Site-wide settings used by metadata, structured data and the sitemap. */
export const SITE = {
  name: "PeoplesHR",
  // An explicit setting wins; on Vercel, fall back to the project's production
  // domain (set automatically at build time); locally, use the dev server.
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
  description:
    "HR and payroll software that helps growing businesses run payroll, leave, attendance and employee data in one place.",
} as const;

export const ROUTES = {
  home: "/",
  calculator: "/tools/hr-admin-cost-calculator",
  finder: "/tools/hr-software-finder",
  resources: "/resources",
} as const;

export function absoluteUrl(path: string) {
  return new URL(path, SITE.url).toString();
}
