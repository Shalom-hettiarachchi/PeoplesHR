# PeoplesHR web experience prototypes

Three connected, working web experiences for the PeoplesHR Web Experience Engineer assessment. Each one gives a
visitor something genuinely useful first, then offers a next step that fits where they are in the buying journey.

## Challenges selected

| # | Challenge | Prototype | What the visitor gets | How it converts |
|---|---|---|---|---|
| **01** | Visitors cannot quantify the cost of inefficient work | [HR admin cost calculator](http://localhost:3000/tools/hr-admin-cost-calculator) | Hours and money lost to manual HR admin, what's recoverable, and an honest verdict on whether fixing it is worth it | Demo, emailed report or guides, depending on the verdict |
| **02** | Buyers struggle to identify the right software option | [HR software finder](http://localhost:3000/tools/hr-software-finder) | A package recommendation with the reason for every module, what they don't need, and a comparison | Demo or emailed recommendation, depending on buying timeline |
| **05** | Useful content does not lead visitors toward solutions | [Guides hub](http://localhost:3000/resources) | Answer-first guides, search that understands everyday wording, embedded calculators, free checklists | Checklist download (content upgrade), then the tools |

Challenge **04** (turning interest into leads) is addressed across all three: every lead form is a value exchange,
and every lead arrives scored and summarised for sales (see [Behind the scenes](http://localhost:3000/demo)).

## Run it locally

Requires Node.js 20.9 or later.

```bash
npm install
npm run dev
```

Open http://localhost:3000. The home page links to all three prototypes.

| Command | What it does |
|---|---|
| `npm run dev` | Development server on port 3000 |
| `npm run build` then `npm start` | Production build and server |
| `npm test` | Unit tests (Vitest) |
| `npm run check` | Lint, type-check and tests together |

To deploy (for example on Vercel), set `NEXT_PUBLIC_SITE_URL` to the live address (see `.env.example`). It is used
for canonical URLs, the sitemap, structured data, share images and `llms.txt`.

## A five-minute tour

1. **Start where a real visitor would:** [How to reduce payroll errors](http://localhost:3000/resources/how-to-reduce-payroll-errors).
   Read the quick answer, try the corrections estimator, then follow its link into the full calculator with your answers carried over.
2. **In the calculator,** set every process to "Automated". The verdict changes to "Probably not yet" and the call to action
   switches from a demo to free guides. Set them back to manual and request a demo.
3. **In the [finder](http://localhost:3000/tools/hr-software-finder),** answer the seven questions. Note the reasons, the
   "Why not the next package up?" box and how the next step changes with your timeline.
4. **On the [guides hub](http://localhost:3000/resources),** search for "how do I stop payroll mistakes", then for "pension".
5. **Open [Behind the scenes](http://localhost:3000/demo):** your leads appear scored and summarised for sales, with a link that
   replays exactly what the visitor saw, alongside a funnel and the search that found nothing (a content gap).

## How it meets the brief

**Problem-solving and usefulness.** Each tool answers the visitor's actual question without asking for anything first. The
calculator says when software *isn't* worth it; the finder recommends the *smallest* package that fits and explains what it
leaves out. Every assumption is shown on the page and comes from the same file as the maths, so copy and numbers can't drift.

**Functionality and technical execution.** Next.js 16 (App Router, Cache Components) with TypeScript and Tailwind. All
pages are prerendered static HTML; interactivity is limited to small client components. Business logic is pure, typed and
covered by 49 unit tests, including checks that every internal link in the guides points to a real page and section. Shareable
URLs, saved progress, keyboard and screen reader support throughout.

**UI/UX and creativity.** One design system across all three. Results update live; mobile gets a sticky summary bar on the
calculator and compact answer cards. Guides have a reading-position table of contents, a progress bar and a prompt that
changes as you read (a tool part-way through, a checklist reminder only if you scrolled past it).

**Conversion and business thinking.** Calls to action depend on the visitor's situation: verdict in the calculator, buying
timeline in the finder, reading depth in guides. Email is only requested in return for something extra. Answers travel between
tools and into the lead, so sales never asks a question twice. Leads are scored with explainable reasons and routed to a
response time (sales-ready, warm or nurture). Searches with no results are logged as content gaps.

**SEO / GEO.** Question-shaped headings and a two-to-three-sentence "Quick answer" at the top of every guide, written to be quoted
by search snippets and AI assistants. Article, FAQPage, WebApplication, CollectionPage and BreadcrumbList structured data;
canonical URLs; a sitemap with real update dates; per-guide share images; [`/llms.txt`](http://localhost:3000/llms.txt) listing
every guide with its answer; and real 404 status codes for unknown guide URLs (no soft 404s).

## Quality checks

Lighthouse 12, production build:

| Page | Mobile (slow 4G) performance | Desktop performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|---|
| Home | 92 | 100 | 100 | 100 | 100 |
| Cost calculator | 87 | 100 | 100 | 100 | 100 |
| Software finder | 88 | 100 | 100 | 100 | 100 |
| Guides hub | 87 | 100 | 100 | 100 | 100 |
| Guide | 87 | 100 | 100 | 100 | 100 |

Zero layout shift on every page. Accessibility, best practices and SEO were 100 on both mobile and desktop. The remaining
mobile performance cost is React's framework JavaScript on a throttled CPU.

GitHub Actions (`.github/workflows/ci.yml`) runs lint, type-check, tests and a production build on every push.

## Project structure

```
src/
  app/                 Routes: pages, API route, sitemap, robots, llms.txt, share images
  components/          UI by feature: calculator, finder, content, lead, demo, ui
  lib/
    calculator/        Cost model, assumptions, copy, shareable URL state (+ tests)
    finder/            Packages, modules, questions, recommendation logic (+ tests)
    content/           Guides, checklists, search, link checks (+ tests)
    leads/             Validation, scoring, sales brief, mock store (+ tests)
  proxy.ts             Returns a real 404 for unknown guide URLs
```

Content and business rules live in data files, not components. See [docs/WALKTHROUGH.md](docs/WALKTHROUGH.md) for where to
make common changes.

## Assumptions and illustrative data

- Packages (Essentials, Payroll Plus, Talent Suite, Enterprise), modules and prices are invented for the prototype, as the brief
  allows, and are labelled as illustrative wherever they appear.
- Calculator effort assumptions (for example 6 minutes per employee per pay run) are reasonable estimates, listed in full on the
  calculator page and editable in one file.
- Guides are general information, not legal or tax advice.
- There is no CRM or analytics account. Leads are validated and scored by a real API route and kept in memory; analytics events go
  to a GTM-style `dataLayer`. Both are also kept in the browser so the behind-the-scenes page works on any deployment.

## What I'd do next

- Connect leads to the CRM (HubSpot or Salesforce) and events to GA4, then A/B test calls to action per verdict and timeline.
- Send the emailed report and checklist as real PDFs.
- Add Playwright end-to-end tests for each journey.
- Localise currencies, statutory examples and content for each PeoplesHR market.
- Write the next guides from the content-gap log.

## How this was built

AI tools were used for ideation, content drafting, coding and testing, as the brief encourages. Every recommendation rule, assumption
and trade-off is documented in the code and in [docs/WALKTHROUGH.md](docs/WALKTHROUGH.md).
