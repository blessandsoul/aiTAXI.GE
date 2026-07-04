import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "aiTAXI, Robotaxi Fleet Management",
    short_name: "aiTAXI",
    description:
      "Robotaxi fleet management platform by aiNOW (Tbilisi, Georgia): dispatch, telemetry, remote assistance, depot operations, compliance.",
    start_url: "/",
    display: "standalone",
    background_color: "#fffbeb",
    theme_color: "#ffc400",
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
    ],
  };
}
