import { GUIDES } from "@/lib/content/guides";
import { guidePath } from "@/lib/content/utils";
import { absoluteUrl, ROUTES, SITE } from "@/lib/site";

/**
 * llms.txt: a plain-text map of the site for AI assistants and answer engines
 * (see llmstxt.org). It lists each guide with its short answer, so an
 * assistant can cite the right page. Built from the same data as the pages.
 */
export function GET() {
  const body = [
    `# ${SITE.name}`,
    "",
    `> ${SITE.description}`,
    "",
    "Free tools and plain-English guides for HR, payroll and finance teams at growing businesses.",
    "",
    "## Tools",
    "",
    `- [HR admin cost calculator](${absoluteUrl(ROUTES.calculator)}): estimates the hours and cost of manual payroll, leave, employee requests, onboarding and reporting, and whether automating them pays off. Every assumption is listed on the page.`,
    `- [HR software finder](${absoluteUrl(ROUTES.finder)}): seven questions that recommend an HR and payroll package, the modules needed and the reasons.`,
    "",
    "## Guides",
    "",
    ...GUIDES.map((g) => `- [${g.title}](${absoluteUrl(guidePath(g.slug))}): ${g.quickAnswer}`),
    "",
    "## Optional",
    "",
    `- [All guides](${absoluteUrl(ROUTES.resources)})`,
    `- [Sitemap](${absoluteUrl("/sitemap.xml")})`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
