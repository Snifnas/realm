import type { Metadata, Viewport } from "next";
import "./globals.css";
import PWASetup from "./components/pwa-setup";

export const metadata: Metadata = {
  title: "REALM | Your life, your legend",
  description: "Turn real-world learning into an RPG adventure.",
  applicationName: "REALM",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "REALM" },
  formatDetection: { telephone: false },
  icons: {
    icon: [{ url: "/icon", type: "image/png", sizes: "512x512" }],
    apple: [{ url: "/apple-icon", type: "image/png", sizes: "180x180" }]
  }
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#171812"
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}<PWASetup /></body></html>;
}
