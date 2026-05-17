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
          background: "#FAFAF7",
          color: "#8B2635",
          display: "flex",
          fontFamily: "Georgia",
          fontSize: 34,
          fontWeight: 500,
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
