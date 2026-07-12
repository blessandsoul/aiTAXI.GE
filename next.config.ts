import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone",
  skipProxyUrlNormalize: true,
  skipTrailingSlashRedirect: false,
  poweredByHeader: false,

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "avatar.vercel.sh",
      },
    ],
    localPatterns: [
      {
        pathname: "/api/og",
        search: "*",
      },
      {
        pathname: "/images/**",
        search: "",
      },
      {
        pathname: "/team/**",
        search: "",
      },
    ],
  },

  async redirects() {
    return [
      // Canonical host: www to apex (duplicate host is an SEO liability).
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.aitaxi.ge' }],
        destination: 'https://aitaxi.ge/:path*',
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // max-age 1y, no preload: preload is near-irreversible, enable only after a clean month
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // Report-only first: watch DevTools console for violations ~2 weeks, then enforce.
          {
            key: "Content-Security-Policy-Report-Only",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https:; connect-src 'self'; media-src 'self' https:; object-src 'none'; base-uri 'self'",
          },
        ],
      },
      {
        // Edge-cacheable HTML for anonymous traffic. Note: dynamically rendered routes
        // may still override this with their own Cache-Control at runtime.
        source: "/((?!api|_next).*)",
        headers: [
          { key: "Cache-Control", value: "public, s-maxage=300, stale-while-revalidate=86400" },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
