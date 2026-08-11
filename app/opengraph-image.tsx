import { ImageResponse } from "next/og";
import { profile } from "@/lib/profile";

/**
 * Dynamically generated Open Graph / social-share image (1200x630).
 * Next.js auto-wires the resulting <meta og:image> + <meta twitter:image>.
 * Styled to match the site: near-black canvas, white type, single blue accent.
 */
export const alt = `${profile.name} — ${profile.focus}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const accent = "#60a5fa";
const ink = "#fafafa";
const muted = "#a1a1aa";
const bg = "#0a0a0c";

export default function OpengraphImage() {
  const host = profile.siteUrl.replace(/^https?:\/\//u, "").replace(/\/$/u, "");

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: bg,
          padding: "76px 84px",
          color: ink,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
            fontSize: 26,
            letterSpacing: "0.2em",
            color: muted,
          }}
        >
          <div style={{ width: 48, height: 2, background: accent }} />
          PORTFOLIO
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "26px" }}>
          <div
            style={{
              fontSize: 104,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1,
            }}
          >
            {profile.name}
          </div>
          <div
            style={{
              fontSize: 42,
              color: "#d4d4d8",
              letterSpacing: "-0.01em",
              lineHeight: 1.25,
              maxWidth: 920,
            }}
          >
            {profile.focus}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginTop: "8px",
              padding: "10px 20px",
              border: `1px solid ${accent}`,
              borderRadius: 999,
              alignSelf: "flex-start",
              fontSize: 24,
              letterSpacing: "0.06em",
              color: accent,
            }}
          >
            <div
              style={{ width: 12, height: 12, borderRadius: 999, background: accent }}
            />
            OPEN TO {profile.seeking.toUpperCase()}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 26,
            color: muted,
          }}
        >
          <div>{`${profile.program} · ${profile.school}`}</div>
          <div>{host}</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
