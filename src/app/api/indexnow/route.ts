export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { submitToIndexNow, INDEXNOW_KEY } from "@/lib/indexnow";

/**
 * POST /api/indexnow , secret-gated. Body: { urls: string[] }. Submits to IndexNow.
 *   Gated by INDEXNOW_ADMIN_SECRET (X-IndexNow-Secret header) so third parties
 *   can't burn our submission quota. Unset secret = endpoint disabled (401 always);
 *   scripts/indexnow-ping.mjs talks to the engines directly and does not need this route.
 * GET  /api/indexnow , usage hint + confirms the key is wired (no secrets leaked;
 *   the key is public by design, hosted at /<key>.txt for engine verification).
 */

export async function GET() {
  return NextResponse.json({
    service: "IndexNow",
    keyLocation: `/${INDEXNOW_KEY}.txt`,
    usage: 'POST { "urls": ["/blog/my-slug", ...] } with X-IndexNow-Secret header',
  });
}

export async function POST(request: NextRequest) {
  const secret = process.env.INDEXNOW_ADMIN_SECRET;
  if (!secret || request.headers.get("x-indexnow-secret") !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let urls: unknown;
  try {
    ({ urls } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!Array.isArray(urls) || urls.length === 0) {
    return NextResponse.json(
      { error: "Body must be { urls: string[] } with at least one URL" },
      { status: 400 },
    );
  }

  const result = await submitToIndexNow(urls.map(String));
  return NextResponse.json(result, { status: result.success ? 200 : 502 });
}
