import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import shortUrls from "../content/blog/short-urls.json";

const intlMiddleware = createMiddleware(routing);

// Short URL pattern: 1 letter + 5 alphanumeric chars (e.g., "lxn417")
const SHORT_URL_PATTERN = /^\/([a-z][a-z0-9]{5})$/;

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Short URL redirect (e.g., aitaxi.ge/lxn417 -> /blog/<slug>)
  const shortMatch = pathname.match(SHORT_URL_PATTERN);
  if (shortMatch) {
    const code = shortMatch[1] as keyof typeof shortUrls;
    const entry = shortUrls[code] as { slug: string } | undefined;
    if (entry) {
      const destination = new URL(`/blog/${entry.slug}`, request.url);
      return NextResponse.redirect(destination, 301);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
