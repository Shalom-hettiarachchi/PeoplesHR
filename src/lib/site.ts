/** Site-wide settings used by metadata, structured data and the sitemap. */
export const SITE = {
  name: "PeoplesHR",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
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
