import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Next.js 16+ request boundary hook (formerly `middleware`).
 * Add matchers and auth/rewrite logic here when the demo hub needs it.
 */
export function proxy(_request: NextRequest): NextResponse {
  return NextResponse.next();
}
