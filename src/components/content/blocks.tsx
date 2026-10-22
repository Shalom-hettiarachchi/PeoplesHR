import Link from "next/link";
import type { Block, Guide } from "@/lib/content/types";
import { CHECKLISTS } from "@/lib/content/checklists";
import { ROUTES } from "@/lib/site";
import { buttonClass } from "@/components/ui/button";
import { Inline } from "./inline";
import { CorrectionsEstimator, LeaveEstimator } from "./estimators";
import { ChecklistOffer } from "./checklist-offer";

/** Renders one guide block. Text blocks are server-rendered; tools are client islands. */
export function BlockView({ block, guide }: { block: Block; guide: Guide }) {
  switch (block.type) {
    case "p":
      return (
        <p className="my-4 leading-[1.75] text-ink-700">
          <Inline text={block.text} />
        </p>
      );

    case "list": {
      const Tag = block.ordered ? "ol" : "ul";
      return (
        <Tag className={`my-4 space-y-2 pl-5 leading-relaxed text-ink-700 ${block.ordered ? "list-decimal" : "list-disc"} marker:text-brand-500`}>
          {block.items.map((item) => (
            <li key={item} className="pl-1">
              <Inline text={item} />
            </li>
          ))}
        </Tag>
      );
    }

    case "steps":
      return (
        <ol className="my-6 space-y-4">
          {block.items.map((step, i) => (
            <li key={step.title} className="flex gap-4">
              <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white">
                {i + 1}
              </span>
              <div className="pt-1">
                <p className="font-semibold text-ink-950">{step.title}</p>
                <p className="mt-1 leading-relaxed text-ink-700">
                  <Inline text={step.text} />
                </p>
              </div>
            </li>
          ))}
        </ol>
      );

    case "callout": {
      const tone = block.tone === "tip" ? "bg-mint-50 ring-mint-100 text-mint-700" : "bg-amber-100/60 ring-amber-100 text-amber-700";
      return (
        <aside className={`my-6 rounded-2xl p-5 ring-1 ${tone}`}>
          <p className="text-sm font-bold">{block.title}</p>
          <p className="mt-1 leading-relaxed text-ink-700">
            <Inline text={block.text} />
          </p>
        </aside>
      );
    }

    case "table":
      return (
        <div className="my-6 overflow-x-auto rounded-2xl ring-1 ring-ink-200">
          <table className="w-full min-w-[34rem] bg-white text-left text-sm">
            <caption className="sr-only">{block.caption}</caption>
            <thead className="bg-ink-50 text-ink-700">
              <tr>
                {block.head.map((h, i) => (
                  <th key={i} scope="col" className="px-4 py-3 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-200 text-ink-700">
              {block.rows.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, i) =>
                    i === 0 ? (
                      <th key={i} scope="row" className="px-4 py-3 align-top font-semibold text-ink-950">
                        {cell}
                      </th>
                    ) : (
                      <td key={i} className="px-4 py-3 align-top">
                        {cell}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "tool":
      if (block.tool === "corrections-estimator") return <CorrectionsEstimator />;
      if (block.tool === "leave-estimator") return <LeaveEstimator />;
      return (
        <div className="my-8 flex flex-col gap-4 rounded-3xl bg-brand-900 p-6 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-bold">Which HR and payroll package handles several countries?</p>
            <p className="mt-1 text-sm text-brand-100">Answer 7 quick questions and get a recommendation with reasons.</p>
          </div>
          <Link href={ROUTES.finder} className={buttonClass("inverse", "md", "shrink-0")}>
            Find my package →
          </Link>
        </div>
      );

    case "checklist":
      return <ChecklistOffer checklist={CHECKLISTS[block.checklist]} guideSlug={guide.slug} topic={guide.topic} />;
  }
}
