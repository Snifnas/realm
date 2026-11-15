import { ImageResponse } from "next/og";
export const size = { width: 512, height: 512 };
export const contentType = "image/png";
export default function Icon() {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#171812", color: "#d7b36d", borderRadius: 112 }}>
    <svg width="340" height="340" viewBox="0 0 40 40"><path d="M20 2.8 35.5 11.7v16.6L20 37.2 4.5 28.3V11.7L20 2.8Z" fill="none" stroke="#d7b36d" strokeWidth="1.5"/><path d="M20 8 29.8 13.7v11.1L20 30.5l-9.8-5.7V13.7L20 8Z" fill="#d7b36d" opacity=".13"/><path d="M13 27V14h7.8c3.4 0 5.2 1.7 5.2 4.3 0 2-1.1 3.4-3 4l3.8 4.7h-4.6l-3.2-4.2h-2.1V27H13Zm3.9-7.4h3.5c1.2 0 1.8-.4 1.8-1.3s-.6-1.3-1.8-1.3h-3.5v2.6Z" fill="#d7b36d"/></svg>
  </div>, size);
}
