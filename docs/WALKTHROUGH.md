# Interview walkthrough

Notes for presenting the prototypes, answering questions and making a change live.

## Demo script (about 8 minutes)

1. **Home page (30s).** "Three experiences, one per stage of the buying journey: research, problem awareness, comparing options.
   Each is useful first and converts second." Point to the four principles.
2. **Guide (2 min).** Open *How to reduce payroll errors*. Show the quick answer (written for search snippets and AI answers),
   the table of contents tracking position, the corrections estimator, and its "See your full HR admin cost" link carrying
   answers into the calculator. Scroll past the checklist to show the reminder prompt, then unlock the checklist.
3. **Calculator (2 min).** Show live results, then set everything to "Automated": the verdict becomes "Probably not yet" and
   the call to action switches to guides. "Being honest when software isn't worth it is what makes the strong verdicts
   believable." Show *How we calculate*: the table is generated from the same file as the maths. Request a demo.
4. **Finder (2 min).** Answer the questions; point out the live "Early match" panel. On the result, show the reasons,
   "Why not the next package up?", the comparison table and how the next step depends on timeline. Change the timeline to
   "Just researching" from the answers list to show the switch.
5. **Behind the scenes (1.5 min).** Open `/demo`. "This is what sales gets: a score with reasons, a one-line summary, a
   response-time target, a suggested opener and a link that replays exactly what the prospect saw." Show the funnel and the
   content-gap list.

## Where to make common changes

| Change | File | Notes |
|---|---|---|
| A calculator assumption (e.g. minutes of leave admin) | `src/lib/calculator/assumptions.ts` | The "How we calculate" table and worked example update automatically. Update expected numbers in `model.test.ts`. |
| Verdict thresholds | `assumptions.ts` → `ASSUMPTIONS.verdict` | `strongAt` and `moderateAt` are return multiples. |
| Add a currency | `assumptions.ts` → `CurrencyCode` and `CURRENCIES` | Default hourly cost and illustrative price per currency. |
| Calculator wording | `src/lib/calculator/content.ts` | Process names, questions, insights, verdict copy. |
| Add a finder challenge | `src/lib/finder/data.ts` | Add to the `Challenge` type, the `challenges` step options and `CHALLENGE_NEEDS`. TypeScript flags anything missed. |
| Add or change a package or module | `data.ts` → `MODULES`, `PACKAGES` | The comparison table and package overview are generated from these. |
| Lead scoring rules | `src/lib/leads/score.ts` | Every rule adds a human-readable reason. Tests in `score.test.ts`. |
| What sales sees | `src/lib/leads/brief.ts` | Headline, facts, next action and response time per source. |
| Add a guide | `src/lib/content/guides.ts` | Hub, search, sitemap, llms.txt, share image and related links pick it up. Tests check its links. |
| Search synonyms | `src/lib/content/search.ts` → `SYNONYMS` | Keys are stemmed words (for example "mistak"). |
| Brand colours | `src/app/globals.css` → `@theme` | All UI colours come from these tokens. |

Run `npm run check` after any change.

## Problems found and fixed (good interview stories)

- **A verdict nobody could reach.** A unit test showed that with the illustrative price, even a 400-person fully manual company
  only reached "moderate". I redefined the bands around what they mean: "moderate" pays for itself (1x), "strong" pays back twice (2x).
- **Bigger packages winning on weak signals.** In the finder, a 15-person team that outsources payroll was shown Payroll Plus as a
  better match than Essentials. Nice-to-have needs now count for half, modules you don't need cost points, and Enterprise has a
  minimum size. A test asserts the recommended package has the best match in typical cases.
- **Search that missed everyday words.** "How do I stop payroll mistakes" didn't find the right section, because the guide says
  "reduce" and "errors". I added a small synonym list, then found the stemmer turned "mistakes" into "mistak", so the synonym
  key had to match the stem. I also stopped single shared words counting as matches, and stopped filter-hidden results
  being logged as content gaps.
- **Speed versus readable content.** Next.js 16 suggested wrapping guide pages in a loading skeleton for instant navigation.
  I tried it, then checked the production HTML: the article arrived hidden and was swapped in by JavaScript, which broke links to
  sections and hid content from anything not running JavaScript. For content pages I chose complete HTML (`instant = false`),
  relying on prefetching for speed.
- **Soft 404s.** Unknown guide URLs showed the not-found page with a 200 status. A small proxy now returns a real 404.
- **A prompt that nagged.** The floating "Get the checklist" prompt appeared while the checklist was already on screen. It now
  shows a tool part-way through, and a checklist reminder only if the reader scrolled past it without unlocking it.
- **Render-blocking CSS.** Lighthouse showed the stylesheet blocking first paint. Inlining the small Tailwind CSS brought first
  contentful paint on throttled mobile to about 1.0 to 1.4 seconds.

## Likely questions

**Why these three challenges?** Together they cover the journey from first question to sales conversation, and they connect:
guides feed the calculator, the calculator feeds the finder, and all three feed sales. Challenges 02 and 03 use similar
mechanics (a question flow), so choosing both would have shown the same skill twice. Challenge 04 is covered inside all three.

**How would you measure success?** Per tool: start rate, completion rate, call-to-action click rate, lead rate, and the share of
leads that become sales opportunities by tier. For content: organic and AI-referred entrances, scroll depth, estimator use,
clicks into tools, checklist conversions and content-gap searches. All the events are already fired; see the `/demo` funnel.

**How would this connect to a real CRM?** The API route already validates and scores leads. Replace the in-memory store with a
call to the CRM's API (for example HubSpot forms or Salesforce), map the context to custom fields, de-duplicate by email and route
by tier. The sales brief becomes the record summary.

**What about privacy?** Tools work without any personal data. Marketing consent is opt-in and unticked. Forms ask only for an
email, with optional fields for demos. Bots are filtered with a hidden honeypot field instead of a CAPTCHA. Answers stay in the
browser unless the visitor submits a form.

**How reliable are the calculator numbers?** They're transparent estimates, not an audit. Every assumption is on the page and in
one file, and visitors can change cost, turnover and price. With real customer data I'd calibrate the effort assumptions per
market and company size.

**Why Next.js and static pages?** Fast first load, good SEO and AI discoverability, and no server needed to read content. Only the
interactive parts ship JavaScript. Business logic is plain TypeScript functions, so it's easy to test and easy to change.

**What would you do with more time?** CRM and GA4 integration, real PDF reports, Playwright journey tests, localisation per market,
and A/B tests on the calls to action.
