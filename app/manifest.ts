import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "REALM | Real-life RPG",
    short_name: "REALM",
    description: "Turn real-world learning into skills, quests and progression.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#12130f",
    theme_color: "#171812",
    categories: ["education", "lifestyle", "productivity"],
    icons: [
      { src: "/realm-icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" }
    ]
  };
}
