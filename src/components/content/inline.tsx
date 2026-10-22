import Link from "next/link";
import { Fragment } from "react";

const TOKEN = /(\*\*.+?\*\*|\[.+?\]\(.+?\))/g;

/** Renders guide text with **bold** and [links](/path). Internal links use client-side navigation. */
export function Inline({ text }: { text: string }) {
  return (
    <>
      {text.split(TOKEN).map((part, i) => {
        const bold = part.match(/^\*\*(.+)\*\*$/);
        if (bold) return <strong key={i} className="font-semibold text-ink-950">{bold[1]}</strong>;

        const link = part.match(/^\[(.+?)\]\((.+?)\)$/);
        if (link) {
          const [, label, href] = link;
          const className = "font-medium text-brand-700 underline decoration-brand-300 underline-offset-2 hover:decoration-brand-700";
          return href.startsWith("/") ? (
            <Link key={i} href={href} className={className}>
              {label}
            </Link>
          ) : (
            <a key={i} href={href} className={className}>
              {label}
            </a>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
