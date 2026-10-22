import { ROUTES } from "@/lib/site";
import type { Guide } from "./types";

/**
 * Guides are stored as structured data rather than free-form HTML so each page
 * can build its table of contents, FAQ schema, search index and related links
 * automatically. General information only, not legal or tax advice.
 */
export const GUIDES: Guide[] = [
  {
    slug: "how-to-reduce-payroll-errors",
    title: "How to reduce payroll errors: 8 common causes and how to fix them",
    description:
      "Why payroll mistakes happen, what they really cost, and practical steps to cut them, with or without new software. Includes a free payroll accuracy checklist.",
    topic: "payroll",
    stage: "problem",
    roles: ["finance", "hr", "owner"],
    published: "2026-09-15",
    updated: "2026-10-20",
    quickAnswer:
      "Most payroll errors come from late or re-keyed inputs: changes to hours, leave, pay rates and joiners that reach payroll by email or spreadsheet. To reduce them, set a firm cut-off for changes, keep one source of employee data, compare every pay run with the last one before approving it, and have a second person review it. Automating the flow of leave and attendance into payroll removes the most common causes.",
    takeaways: [
      "Most errors start before payroll is run, in how changes are collected.",
      "A cut-off date and a single change form prevent many last-minute mistakes.",
      "Comparing each run with the previous one catches most errors before payday.",
      "If corrections are a regular event, the admin time usually justifies automation.",
    ],
    sections: [
      {
        id: "what-counts-as-a-payroll-error",
        heading: "What counts as a payroll error?",
        blocks: [
          {
            type: "p",
            text: "A payroll error is any payment, deduction or filing that doesn't match what it should have been. Some are obvious to employees straight away. Others only surface months later in an audit or a tax notice.",
          },
          {
            type: "list",
            items: [
              "**Wrong amounts:** overpaying or underpaying salary, overtime or allowances.",
              "**Missed payments:** a new joiner not set up in time, or a one-off bonus forgotten.",
              "**Wrong deductions:** incorrect tax, social security, loans or benefit contributions.",
              "**Late payments:** missing payday because approvals or bank files were late.",
              "**Filing errors:** statutory returns that don't match what was actually paid.",
            ],
          },
          {
            type: "p",
            text: "Every error costs time to investigate and correct, and repeated errors cost trust. Employees who are paid wrongly once tend to check every payslip afterwards, and ask HR about it.",
          },
        ],
      },
      {
        id: "what-causes-payroll-errors",
        heading: "What causes payroll errors?",
        blocks: [
          {
            type: "p",
            text: "Payroll calculations themselves rarely go wrong. The problems come from the information going into them. These eight causes account for most mistakes:",
          },
          {
            type: "table",
            caption: "Common causes of payroll errors and how to fix them",
            head: ["Cause", "Why it happens", "How to fix it"],
            rows: [
              ["Late changes", "Managers send changes after payroll has been prepared", "Set and enforce a monthly cut-off date"],
              ["Re-keying data", "The same details are typed into HR, leave and payroll tools", "Keep one employee record that feeds payroll"],
              ["Unrecorded leave", "Leave is agreed in chat and never logged", "Use one leave request channel that payroll can see"],
              ["Old pay rates", "Raises are agreed but not updated with the right date", "Update rates only from signed letters, with effective dates"],
              ["Joiners and leavers", "Mid-month starts and final pay are calculated by hand", "Use a checklist for every joiner and leaver"],
              ["Manual overtime", "Hours are added up in spreadsheets", "Capture approved hours directly from attendance"],
              ["Out-of-date rates", "Tax and statutory rates change and nobody updates them", "Keep a calendar of rate changes, or use software that does"],
              ["No second check", "One person prepares and approves", "Require a second reviewer before every run"],
            ],
          },
        ],
      },
      {
        id: "how-much-do-payroll-errors-cost",
        heading: "How much do payroll errors cost?",
        blocks: [
          {
            type: "p",
            text: "The direct cost is the time spent finding the problem, recalculating pay, making a correction payment and explaining it to the employee. We assume about 45 minutes per corrected payslip. Use the estimator below to see what that adds up to for your team.",
          },
          { type: "tool", tool: "corrections-estimator" },
          {
            type: "p",
            text: "That's only part of it. Corrections often lead to late filings, penalties, and employees who lose confidence in payroll. For the full picture of HR admin time, try the [HR admin cost calculator](" + ROUTES.calculator + ").",
          },
        ],
      },
      {
        id: "how-to-reduce-payroll-errors-without-new-software",
        heading: "How can you reduce payroll errors without new software?",
        blocks: [
          {
            type: "p",
            text: "You can fix many errors with process changes alone. Start with these six steps:",
          },
          {
            type: "steps",
            items: [
              { title: "Set a cut-off date", text: "Changes received after, say, the 20th go into next month's run. Publish the dates for the year." },
              { title: "Use one change form", text: "Every pay change, joiner and leaver comes through the same form with the same fields and an approver." },
              { title: "Compare with last month", text: "Before approving, compare total cost and each employee's net pay with the previous run. Investigate anything you can't explain." },
              { title: "Add a second reviewer", text: "The person who prepares payroll shouldn't be the only one who approves it." },
              { title: "Track statutory changes", text: "Keep a calendar of tax and social security changes, and check rates at the start of each tax year." },
              { title: "Review every correction", text: "Log each mistake and its cause. Fix the cause, not just the payment." },
            ],
          },
          {
            type: "callout",
            tone: "tip",
            title: "Quick win",
            text: "The month-on-month comparison catches the most errors for the least effort. Even a simple spreadsheet that flags any employee whose net pay moved more than 10% will catch most mistakes before payday.",
          },
        ],
      },
      {
        id: "when-does-payroll-software-make-sense",
        heading: "When does payroll software make sense?",
        blocks: [
          {
            type: "p",
            text: "Process fixes have a ceiling. If people are still copying data between systems, errors will keep coming back. Software tends to pay off when:",
          },
          {
            type: "list",
            items: [
              "More than 1 in 100 payslips needs a correction.",
              "Leave, attendance or overtime are re-typed into payroll every month.",
              "You pay people in more than one country or entity (see [paying employees in another country](/resources/multi-country-payroll-guide)).",
              "Payroll depends on one person who can't take time off around payday.",
            ],
          },
          {
            type: "p",
            text: "If only one or two of these apply, start with the process steps above. If most of them do, [find out which package fits your team](" + ROUTES.finder + ").",
          },
        ],
      },
      {
        id: "payroll-accuracy-checklist",
        heading: "Payroll accuracy checklist",
        blocks: [{ type: "checklist", checklist: "payroll-accuracy" }],
      },
    ],
    faq: [
      {
        q: "What is an acceptable payroll error rate?",
        a: "There's no official standard, but well-run payroll teams aim for fewer than 1 in 100 payslips needing a correction. If you're regularly above 2 in 100, the cause is usually how changes reach payroll, not the calculations.",
      },
      {
        q: "Who is responsible for payroll errors?",
        a: "The employer is responsible for paying employees correctly and filing accurately, even when payroll is outsourced. That's why a second internal review before every run matters.",
      },
      {
        q: "How do you fix a payroll mistake after payday?",
        a: "Confirm the correct amount, tell the employee what happened and when it will be fixed, and either make a correction payment or adjust the next run. Then record the cause so it doesn't happen again. Rules on recovering overpayments vary by country, so check local requirements first.",
      },
      {
        q: "Can payroll software eliminate errors completely?",
        a: "No, but it removes the most common causes: re-keyed data, missed leave and out-of-date rates. Validation checks also flag unusual changes before a run is approved, so the remaining errors are easier to catch.",
      },
    ],
    productTieIn: {
      heading: "How PeoplesHR helps cut payroll errors",
      text: "Leave, attendance and pay changes flow straight into payroll from one employee record, statutory rates are kept up to date, and built-in checks flag unusual changes before you approve a run.",
      modules: ["payroll", "leave", "compliance"],
    },
    related: ["how-to-track-employee-leave", "multi-country-payroll-guide"],
    scrollCta: [
      { label: "How much are payroll errors costing you? Try the calculator", href: ROUTES.calculator },
      { label: "Get the 12-point payroll accuracy checklist", href: "#payroll-accuracy-checklist" },
    ],
  },
  {
    slug: "how-to-track-employee-leave",
    title: "How to track employee leave: spreadsheets vs leave management software",
    description:
      "What a leave tracking system needs to record, when a spreadsheet stops working, and how to set up leave tracking that employees, managers and payroll can all rely on.",
    topic: "leave",
    stage: "solution",
    roles: ["hr", "owner"],
    published: "2026-09-22",
    updated: "2026-10-18",
    quickAnswer:
      "To track employee leave well, you need one place where people request leave, managers approve it, balances update automatically and payroll can see unpaid absence. A spreadsheet works for a small team with simple rules. Once you have more than about 20 people, several leave types or more than one approver, leave software saves time and prevents payroll mistakes.",
    takeaways: [
      "Record requests, approvals, balances and accruals in one place.",
      "Spreadsheets break down on version control, accruals and visibility.",
      "Leave that doesn't reach payroll is a common cause of pay errors.",
      "Letting employees see their own balance removes most leave questions.",
    ],
    sections: [
      {
        id: "what-should-leave-tracking-record",
        heading: "What should a leave tracking system record?",
        blocks: [
          {
            type: "p",
            text: "Whatever tool you use, it needs to answer three questions at any moment: who is off, how much leave each person has left, and what payroll needs to know.",
          },
          {
            type: "list",
            items: [
              "Each request: dates, leave type, who approved it and when.",
              "Entitlements for each leave type, by employee.",
              "Accruals, carry-over and expiry.",
              "Balances that update when leave is approved or cancelled.",
              "Unpaid leave and absence, in a form payroll can use.",
              "A team calendar so managers can plan cover.",
            ],
          },
        ],
      },
      {
        id: "can-you-track-leave-in-a-spreadsheet",
        heading: "Can you track leave in a spreadsheet?",
        blocks: [
          {
            type: "p",
            text: "Yes, for a small team with one leave type and one approver. Most businesses start this way. The trouble starts when several people edit the file, leave rules get more complex, or payroll relies on it.",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Where spreadsheets go wrong",
            text: "Copies get out of sync, formulas get overwritten, and requests arrive by email, chat and in person. Balances end up being recalculated by hand at the end of the year, and unpaid leave is often missed in payroll.",
          },
        ],
      },
      {
        id: "how-much-time-does-leave-tracking-take",
        heading: "How much time does manual leave tracking take?",
        blocks: [
          {
            type: "p",
            text: "Between chasing approvals, updating balances, answering \"how much leave do I have?\" and passing absence to payroll, we assume about 10 minutes per employee per month when it's done by hand. Try it for your team:",
          },
          { type: "tool", tool: "leave-estimator" },
        ],
      },
      {
        id: "spreadsheet-vs-leave-software",
        heading: "Spreadsheet or leave software: which is better?",
        blocks: [
          {
            type: "table",
            caption: "Spreadsheet and leave management software compared",
            head: ["", "Spreadsheet", "Leave software"],
            rows: [
              ["Cost", "Free", "Monthly subscription"],
              ["Requests", "Email, chat or in person", "One form, on any phone"],
              ["Approvals", "Manual, easy to lose", "Routed to the right manager, with reminders"],
              ["Balances and accruals", "Formulas you maintain", "Calculated automatically"],
              ["Employee self-service", "Ask HR", "Check your own balance"],
              ["Payroll", "Re-typed or exported", "Flows straight into payroll"],
              ["Best for", "Under ~20 people, simple rules", "Growing teams, shifts, several leave types"],
            ],
          },
        ],
      },
      {
        id: "how-to-set-up-leave-tracking",
        heading: "How do you set up leave tracking that works?",
        blocks: [
          {
            type: "steps",
            items: [
              { title: "Write the policy down", text: "Leave types, entitlements, accrual, carry-over and notice. Check it meets local law in every country you employ people." },
              { title: "Pick one request channel", text: "Every request goes through the same form or app. Nothing agreed in chat counts until it's logged." },
              { title: "Set approval rules", text: "Who approves each team, who covers when they're away, and how long they have to respond." },
              { title: "Connect leave to payroll", text: "Agree a cut-off so unpaid leave and absence are always in the pay run. Better still, make it automatic. See [how to reduce payroll errors](/resources/how-to-reduce-payroll-errors)." },
              { title: "Let people see their balance", text: "Self-service removes most leave questions and stops disputes at year end." },
              { title: "Review monthly", text: "Check for long unapproved requests, negative balances and teams where nobody takes leave." },
            ],
          },
        ],
      },
      {
        id: "leave-policy-checklist",
        heading: "Leave policy and tracking checklist",
        blocks: [{ type: "checklist", checklist: "leave-policy" }],
      },
    ],
    faq: [
      {
        q: "How do you calculate leave accrual?",
        a: "Divide the annual entitlement by the accrual periods. For example, 21 days a year accrued monthly is 1.75 days per month. Part-time employees usually accrue in proportion to their working pattern. Leave software does this automatically, including for mid-year joiners.",
      },
      {
        q: "Should unused leave carry over to next year?",
        a: "That depends on local law and your policy. Many employers allow a limited carry-over, for example five days, with an expiry date, so people still take time off. Write the rule down and apply it consistently.",
      },
      {
        q: "How can employees check their leave balance?",
        a: "With a self-service app or portal that shows entitlement, leave taken, pending requests and remaining balance. Without one, employees ask HR, which takes time for both sides.",
      },
      {
        q: "Does leave tracking affect payroll?",
        a: "Yes. Unpaid leave, some types of sick leave and leave paid out when someone leaves all change pay. If leave records don't reach payroll on time, pay will be wrong.",
      },
    ],
    productTieIn: {
      heading: "How PeoplesHR handles leave",
      text: "Employees request leave from their phone, managers approve in one tap, balances and accruals update automatically, and unpaid leave flows straight into payroll.",
      modules: ["leave", "self-service", "payroll"],
    },
    related: ["how-to-reduce-payroll-errors", "multi-country-payroll-guide"],
    scrollCta: [
      { label: "Find the right leave and HR package in 7 questions", href: ROUTES.finder },
      { label: "Get the leave policy checklist", href: "#leave-policy-checklist" },
    ],
  },
  {
    slug: "multi-country-payroll-guide",
    title: "Paying employees in another country: what changes for payroll",
    description:
      "What you need to sort out when you hire in a second country, the main ways to pay overseas employees, and how to keep payroll consistent across countries.",
    topic: "compliance",
    stage: "solution",
    roles: ["finance", "owner"],
    published: "2026-10-01",
    updated: "2026-10-21",
    quickAnswer:
      "When you pay employees in a new country, you take on that country's tax, social security, leave and payslip rules, usually through a local entity or an employer of record. You'll need local registrations, a local filing calendar, and a way to pay in local currency. Keeping one employee record and one approval process across countries is what keeps multi-country payroll manageable as you grow.",
    takeaways: [
      "Every country brings its own tax, social security and leave rules.",
      "An employer of record is fastest to start; a local entity gives more control.",
      "Keep one employee record and one approval process across countries.",
      "Consolidated reporting is hard to bolt on later, so plan for it early.",
    ],
    sections: [
      {
        id: "what-changes-in-a-second-country",
        heading: "What changes when you pay people in a second country?",
        blocks: [
          {
            type: "p",
            text: "Hiring abroad means following that country's employment and payroll rules for those employees, not your home country's. Expect to deal with:",
          },
          {
            type: "list",
            items: [
              "**A legal employer:** a local entity of your own, or an employer of record (EOR).",
              "**Registrations:** local tax and social security registrations before the first payday.",
              "**Statutory deductions:** income tax, social security, and sometimes pension or healthcare contributions.",
              "**Leave and benefits:** statutory leave, public holidays and any mandatory benefits.",
              "**Payslips and filings:** local payslip content rules and a separate filing calendar.",
              "**Currency and banking:** paying in local currency, usually from a local account.",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "Not legal advice",
            text: "Rules differ a lot between countries and change often. Use this guide to plan, and confirm the details with a local adviser before you hire.",
          },
        ],
      },
      {
        id: "options-for-paying-overseas-employees",
        heading: "What are your options for paying overseas employees?",
        blocks: [
          {
            type: "table",
            caption: "Ways to employ and pay people in another country",
            head: ["Option", "Best for", "Watch out for"],
            rows: [
              ["Employer of record (EOR)", "Your first few hires in a new country", "Higher cost per employee, less control over contracts"],
              ["Local entity + local payroll provider", "A long-term team in one or two countries", "A different provider and process in every country"],
              ["Local entity + multi-country HR and payroll system", "Teams in several countries that want one way of working", "Needs set-up for each country's rules"],
            ],
          },
          {
            type: "p",
            text: "Many businesses use an EOR to start quickly, then set up an entity once the team in that country grows. Plan the move early so employee records and history move with them.",
          },
        ],
      },
      {
        id: "how-to-set-up-payroll-in-a-new-country",
        heading: "How do you set up payroll in a new country?",
        blocks: [
          {
            type: "steps",
            items: [
              { title: "Choose how you'll employ people", text: "EOR or local entity. This decides who registers, files and carries the legal risk." },
              { title: "Register with the authorities", text: "Tax, social security and any other mandatory schemes, before the first payday." },
              { title: "Set up local pay elements", text: "Statutory deductions, allowances, public holidays and leave entitlements." },
              { title: "Agree a pay calendar", text: "Pay dates, cut-offs and filing deadlines for that country." },
              { title: "Run a parallel payroll", text: "Before the first live run, calculate a test payroll and check it with a local adviser." },
              { title: "Bring it into your reporting", text: "Make sure cost, headcount and leave from the new country show up alongside everyone else." },
            ],
          },
        ],
      },
      {
        id: "how-to-keep-multi-country-payroll-consistent",
        heading: "How do you keep payroll consistent across countries?",
        blocks: [
          {
            type: "list",
            items: [
              "**One employee record** for everyone, with country-specific fields where needed.",
              "**One way to request changes and leave**, whatever the country.",
              "**Local rules per entity**, so each country's calculations stay correct.",
              "**Consolidated reporting** in one currency for leadership, alongside local detail.",
              "**Clear access controls**, so local managers see only their own teams.",
            ],
          },
          {
            type: "p",
            text: "Payroll errors grow with every manual hand-off, and multi-country payroll adds more of them. The [payroll errors guide](/resources/how-to-reduce-payroll-errors) covers the controls that matter most.",
          },
          { type: "tool", tool: "finder" },
        ],
      },
      {
        id: "hr-software-buyers-checklist",
        heading: "HR and payroll software buyer's checklist",
        blocks: [{ type: "checklist", checklist: "hr-software-buyers" }],
      },
    ],
    faq: [
      {
        q: "Do I need a local entity to employ someone abroad?",
        a: "Not always. An employer of record can legally employ people on your behalf in many countries, which avoids setting up an entity. For a larger long-term team, a local entity is usually cheaper and gives you more control.",
      },
      {
        q: "What is an employer of record?",
        a: "An employer of record (EOR) is a company that becomes the legal employer of your staff in a country. It runs payroll, files taxes and handles local compliance, while you manage the person's day-to-day work.",
      },
      {
        q: "Can one payroll system handle several countries?",
        a: "Yes. Multi-country HR and payroll systems keep each country's rules, currencies and filings separate while giving you one employee record and consolidated reporting.",
      },
      {
        q: "Which currency should overseas employees be paid in?",
        a: "Usually the local currency, and in some countries the law requires it. Paying from a local bank account also avoids transfer fees and delays for employees.",
      },
    ],
    productTieIn: {
      heading: "How PeoplesHR supports teams in several countries",
      text: "Run payroll for each entity with its own rules and currency, while keeping one employee record, one approval process and consolidated reports for leadership.",
      modules: ["multi-country", "payroll", "analytics"],
    },
    related: ["how-to-reduce-payroll-errors", "how-to-track-employee-leave"],
    scrollCta: [
      { label: "Which package handles several countries? Find out in 7 questions", href: ROUTES.finder },
      { label: "Get the HR software buyer's checklist", href: "#hr-software-buyers-checklist" },
    ],
  },
];

export function getGuide(slug: string) {
  return GUIDES.find((g) => g.slug === slug);
}
