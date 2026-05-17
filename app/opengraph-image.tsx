import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Hany Jiang - Data + ML + Systems";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "flex-start",
          background: "#FAFAF7",
          color: "#1A1A1A",
          display: "flex",
          flexDirection: "column",
          fontFamily: "Georgia",
          height: "100%",
          justifyContent: "center",
          padding: "80px",
          width: "100%",
        }}
      >
        <div style={{ color: "#8B2635", fontFamily: "monospace", fontSize: 28 }}>
          hanyjiang.com
        </div>
        <div style={{ fontSize: 86, fontWeight: 500, letterSpacing: 0, lineHeight: 1.05, marginTop: 28 }}>
          Hany Jiang
        </div>
        <div style={{ color: "#6B6B6B", fontSize: 42, lineHeight: 1.25, marginTop: 24, maxWidth: 780 }}>
          Full-stack systems and data tools. Data Science @ Waterloo.
        </div>
      </div>
    ),
    size,
  );
}
