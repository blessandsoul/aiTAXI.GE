import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "aiNOW, AI Agency in Georgia",
    short_name: "aiNOW",
    description:
      "AI agency in Georgia (HQ Tbilisi). Chatbots, websites, automation, AI content. AI that works.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbfcfc",
    theme_color: "#18181b",
    icons: [
      { src: "/icon.svg?v=17-20260811", type: "image/svg+xml", sizes: "any" },
    ],
  };
}
