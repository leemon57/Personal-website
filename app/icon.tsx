import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = {
  width: 64,
  height: 64,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(135deg, #0c0c15 0%, #1a1230 100%)",
          color: "#f4d39e",
          display: "flex",
          fontFamily: "Georgia",
          fontSize: 36,
          fontWeight: 600,
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        H
      </div>
    ),
    size,
  );
}
