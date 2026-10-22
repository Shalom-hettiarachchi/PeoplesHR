/**
 * PeoplesHR mark: a rounded "P" with a mint dot, on a gradient tile.
 * The glyph is drawn on a 40x40 grid; the same paths are used for the
 * favicon (app/icon.svg) and share images (lib/og.tsx).
 */
export const LOGO_GLYPH = {
  p: "M14 29.5V12h7a6.25 6.25 0 0 1 0 12.5h-7",
  dot: { cx: 28.5, cy: 28.5, r: 3 },
};

export function LogoMark({ className = "size-9" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-[28%] bg-linear-to-br from-brand-500 to-brand-700 shadow-[inset_0_1px_0_rgb(255_255_255/0.25),0_3px_8px_-2px_rgb(74_59_214/0.55)] ${className}`}
    >
      <svg viewBox="0 0 40 40" className="size-full">
        <path d={LOGO_GLYPH.p} fill="none" stroke="white" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle {...LOGO_GLYPH.dot} className="fill-mint-300" />
      </svg>
    </span>
  );
}

export function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className={`text-[1.15rem] font-extrabold tracking-tight ${inverse ? "text-white" : "text-ink-950"}`}>
        Peoples<span className={inverse ? "text-brand-200" : "text-brand-600"}>HR</span>
      </span>
    </span>
  );
}
