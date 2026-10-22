import { ImageResponse } from "next/og";
import { LOGO_GLYPH } from "@/components/logo";

export const OG_SIZE = { width: 1200, height: 630 };

/** Shared social-share card: brand mark, a small label and the page title. */
export function ogImage(title: string, eyebrow: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #1d1859 0%, #3a2eae 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 36, fontWeight: 800 }}>
          <svg width="60" height="60" viewBox="0 0 40 40">
            <rect width="40" height="40" rx="11" fill="#5b4cf0" />
            <path d={LOGO_GLYPH.p} fill="none" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={LOGO_GLYPH.dot.cx} cy={LOGO_GLYPH.dot.cy} r={LOGO_GLYPH.dot.r} fill="#6fdcb3" />
          </svg>
          <div style={{ display: "flex" }}>
            Peoples<span style={{ color: "#a99fff" }}>HR</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 28, color: "#cdc7ff", textTransform: "uppercase", letterSpacing: 2 }}>{eyebrow}</div>
          <div style={{ fontSize: title.length > 60 ? 56 : 68, fontWeight: 800, lineHeight: 1.1 }}>{title}</div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
