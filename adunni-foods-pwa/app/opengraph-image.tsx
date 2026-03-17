import { ImageResponse } from "next/og"

export const runtime = "nodejs"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background: "linear-gradient(135deg, #0b0b0b 0%, #1a0f05 45%, #0b0b0b 100%)",
          color: "white",
          fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ fontSize: 22, letterSpacing: 2, opacity: 0.85 }}>ADUNNI FOODS</div>
          <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.05 }}>Premium Nigerian Plantain Chips</div>
          <div style={{ fontSize: 28, opacity: 0.9 }}>Fresh • Crispy • Fast delivery</div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ fontSize: 22, opacity: 0.9 }}>adunnifoods.com</div>
          <div style={{ fontSize: 20, opacity: 0.75 }}>Order online • Track delivery • Reviews</div>
        </div>
      </div>
    ),
    size
  )
}

