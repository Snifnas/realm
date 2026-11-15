import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "REALM | Your life, your legend", description: "Turn real-world learning into an RPG adventure." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
