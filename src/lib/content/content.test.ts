import { describe, expect, it } from "vitest";
import { ROUTES } from "@/lib/site";
import { MODULES } from "@/lib/finder/data";
import { CHECKLISTS } from "./checklists";
import { GUIDES } from "./guides";
import { buildSearchIndex, faqId, internalLinks, plainText, readingMinutes, search } from "./utils";

const slugs = new Set(GUIDES.map((g) => g.slug));
const knownPages = new Set<string>([...Object.values(ROUTES), ...GUIDES.map((g) => `/resources/${g.slug}`)]);

describe("guide content integrity", () => {
  it("has unique slugs and unique section ids per guide", () => {
    expect(slugs.size).toBe(GUIDES.length);
    for (const g of GUIDES) {
      const ids = [...g.sections.map((s) => s.id), ...g.faq.map((f) => faqId(f.q))];
      expect(new Set(ids).size, g.slug).toBe(ids.length);
    }
  });

  it("only links to pages and sections that exist", () => {
    for (const g of GUIDES) {
      for (const link of internalLinks(g)) {
        const [path, hash] = link.split("#");
        expect(knownPages.has(path), `${g.slug} links to ${link}`).toBe(true);
        if (hash) {
          const target = GUIDES.find((x) => `/resources/${x.slug}` === path)!;
          expect(target.sections.some((s) => s.id === hash), `${g.slug} links to missing #${hash}`).toBe(true);
        }
      }
      for (const cta of g.scrollCta) {
        if (cta.href.startsWith("#")) expect(g.sections.some((s) => `#${s.id}` === cta.href), cta.href).toBe(true);
        else expect(knownPages.has(cta.href), cta.href).toBe(true);
      }
    }
  });

  it("only references guides, checklists and modules that exist", () => {
    for (const g of GUIDES) {
      for (const r of g.related) expect(slugs.has(r), `${g.slug} related ${r}`).toBe(true);
      for (const m of g.productTieIn.modules) expect(MODULES[m], m).toBeDefined();
      for (const block of g.sections.flatMap((s) => s.blocks)) {
        if (block.type === "checklist") expect(CHECKLISTS[block.checklist]).toBeDefined();
      }
    }
  });

  it("keeps meta descriptions within search snippet length", () => {
    for (const g of GUIDES) expect(g.description.length, g.slug).toBeLessThanOrEqual(170);
  });

  it("estimates a sensible reading time", () => {
    for (const g of GUIDES) expect(readingMinutes(g)).toBeGreaterThanOrEqual(3);
  });
});

describe("plainText", () => {
  it("strips bold and link markup", () => {
    expect(plainText("**Wrong** see [the guide](/resources/x).")).toBe("Wrong see the guide.");
  });
});

describe("search", () => {
  const index = buildSearchIndex();

  it("indexes each guide, its question headings and its FAQs", () => {
    const questions = index.filter((e) => e.kind === "question");
    expect(index.filter((e) => e.kind === "guide")).toHaveLength(GUIDES.length);
    expect(questions.every((q) => q.href.includes("#"))).toBe(true);
  });

  it("finds the payroll errors guide for a natural question", () => {
    const results = search("how do I stop payroll mistakes and errors", index);
    expect(results[0].href).toContain("how-to-reduce-payroll-errors");
  });

  it("understands everyday wording", () => {
    expect(search("how do I stop payroll mistakes", index)[0].href).toContain("#how-to-reduce-payroll-errors-without-new-software");
    expect(search("staff holiday", index)[0].href).toContain("how-to-track-employee-leave");
    expect(search("hiring overseas", index)[0].href).toContain("multi-country-payroll-guide");
  });

  it("matches word variations", () => {
    expect(search("tracking leave", index)[0].href).toContain("how-to-track-employee-leave");
    expect(search("employer of record", index)[0].title).toMatch(/employer of record/i);
  });

  it("does not match a phrase on one shared word", () => {
    const leaveOnly = index.filter((e) => e.topic === "leave");
    expect(search("employer of record", leaveOnly)).toEqual([]);
  });

  it("returns nothing for stop words or unknown topics", () => {
    expect(search("how do I", index)).toEqual([]);
    expect(search("pension auto enrolment", index)).toEqual([]);
  });
});
