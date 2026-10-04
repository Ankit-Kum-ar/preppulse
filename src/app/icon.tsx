import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#090A0C",
          borderRadius: "8px",
        }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "24px", height: "24px" }}
        >
          {/* Left Chevron - PrepPulse Orange */}
          <path
            d="M 38 12 
               L 12 28 
               L 12 66 
               L 44 88 
               L 60 76 
               L 32 56 
               L 32 30 
               Z"
            fill="#FF6B2C"
          />

          {/* Right Chevron - PrepPulse Orange */}
          <path
            d="M 72 12 
               L 52 25 
               L 52 56 
               L 80 76 
               L 94 64 
               L 68 46 
               L 68 28 
               Z"
            fill="#FF6B2C"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
