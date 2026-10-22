import { CHECKLISTS } from "./checklists";
import { GUIDES } from "./guides";
import { plainText, type SearchEntry } from "./search";
import type { Block, Guide } from "./types";

export { plainText, search, tokenize, type SearchEntry } from "./search";

export const guidePath = (slug: string) => `/resources/${slug}`;

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

export const faqId = (question: string) => `faq-${slugify(question)}`;

function blockText(block: Block): string[] {
  switch (block.type) {
    case "p":
      return [block.text];
    case "list":
      return block.items;
    case "steps":
      return block.items.flatMap((s) => [s.title, s.text]);
    case "callout":
      return [block.title, block.text];
    case "table":
      return [...block.head, ...block.rows.flat()];
    case "checklist":
      return CHECKLISTS[block.checklist].items.map((i) => i.text);
    default:
      return [];
  }
}

export function readingMinutes(guide: Guide) {
  const text = [
    guide.quickAnswer,
    ...guide.takeaways,
    ...guide.sections.flatMap((s) => [s.heading, ...s.blocks.flatMap(blockText)]),
    ...guide.faq.flatMap((f) => [f.q, f.a]),
  ].join(" ");
  const words = plainText(text).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

/** Every internal link written inside guide text, for link checking. */
export function internalLinks(guide: Guide): string[] {
  const text = guide.sections.flatMap((s) => s.blocks.flatMap(blockText)).join(" ");
  return [...text.matchAll(/\]\((\/[^)]*)\)/g)].map((m) => m[1]);
}

/** Guides plus every question they answer (section headings and FAQs), each with a deep link. */
export function buildSearchIndex(guides: Guide[] = GUIDES): SearchEntry[] {
  return guides.flatMap((g) => {
    const base = { guideTitle: g.title, topic: g.topic, stage: g.stage, roles: g.roles };
    const questions = g.sections
      .filter((s) => s.heading.endsWith("?"))
      .map((s) => {
        const first = s.blocks.find((b) => b.type === "p" || b.type === "list");
        return {
          ...base,
          kind: "question" as const,
          title: s.heading,
          snippet: first ? plainText(blockText(first)[0]) : g.description,
          href: `${guidePath(g.slug)}#${s.id}`,
        };
      });
    const faqs = g.faq.map((f) => ({
      ...base,
      kind: "question" as const,
      title: f.q,
      snippet: f.a,
      href: `${guidePath(g.slug)}#${faqId(f.q)}`,
    }));
    return [{ ...base, kind: "guide" as const, title: g.title, snippet: g.description, href: guidePath(g.slug) }, ...questions, ...faqs];
  });
}
