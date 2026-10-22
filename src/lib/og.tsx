import { ImageResponse } from "next/og";

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
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 34, fontWeight: 800 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: "#5b4cf0", display: "flex", alignItems: "center", justifyContent: "center" }}>
            P
          </div>
          PeoplesHR
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
