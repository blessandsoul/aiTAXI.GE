import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

import shortUrls from "../content/blog/short-urls.json";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);
const SHORT_URL_PATTERN = /^\/([a-z][a-z0-9]{5})$/;

export default function proxy(request: NextRequest) {
  const shortMatch = request.nextUrl.pathname.match(SHORT_URL_PATTERN);

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
