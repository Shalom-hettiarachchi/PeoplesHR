import type { Role, Stage, Topic } from "./types";

/*
  Kept separate from the guide content so the browser only downloads the
  small search index, not every guide.
*/

export interface SearchEntry {
  kind: "guide" | "question";
  title: string;
  snippet: string;
  href: string;
  guideTitle: string;
  topic: Topic;
  stage: Stage;
  roles: Role[];
}

/** Removes the **bold** and [link](url) markers used in guide text. */
export function plainText(text: string) {
  return text.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\[(.+?)\]\((.+?)\)/g, "$1");
}

const STOP_WORDS = new Set(
  "a an and are as at be by can do does for from how i in is it my of on or our should the to we what when where which who why with you your".split(" "),
);

/** Everyday words mapped to the words the guides use (keys are stemmed, e.g. "mistakes" → "mistak"). */
const SYNONYMS: Record<string, string> = {
  mistak: "error",
  mistake: "error",
  wrong: "error",
  stop: "reduce",
  prevent: "reduce",
  avoid: "reduce",
  cut: "reduce",
  holiday: "leave",
  vacation: "leave",
  pto: "leave",
  absence: "leave",
  overseas: "country",
  abroad: "country",
  international: "country",
  global: "country",
  countri: "country",
  staff: "employee",
  worker: "employee",
  salary: "pay",
  wage: "pay",
  eor: "employer",
};

export function tokenize(text: string) {
  return plainText(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t))
    // Light stemming so "errors" matches "error" and "tracking" matches "track".
    .map((t) => t.replace(/(ing|es|s)$/, ""))
    .map((t) => SYNONYMS[t] ?? t);
}

/** Simple keyword search: title matches count most, then snippet and guide title. */
export function search(query: string, entries: SearchEntry[], limit = 6): SearchEntry[] {
  const terms = tokenize(query);
  if (terms.length === 0) return [];
  return entries
    .map((entry) => {
      const title = tokenize(entry.title);
      const body = tokenize(`${entry.snippet} ${entry.guideTitle}`);
      let score = 0;
      let matched = 0;
      for (const term of terms) {
        const inTitle = title.some((w) => w.startsWith(term));
        const inBody = body.some((w) => w.startsWith(term));
        if (inTitle) score += 3;
        else if (inBody) score += 1;
        if (inTitle || inBody) matched++;
      }
      // Prefer entries that match more of the query, and specific questions over whole guides.
      score += (matched / terms.length) * 4 + (entry.kind === "question" ? 0.5 : 0);
      return { entry, score, matched };
    })
    // Must match most of the meaningful words (2 of 2, 2 of 3, 3 of 4), so one stray word isn't a hit.
    .filter((r) => r.matched > 0 && r.matched >= Math.ceil(terms.length * 0.6))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.entry);
}
