import { NextResponse, type NextRequest } from "next/server";
import { GUIDES } from "@/lib/content/guides";

const SLUGS = new Set(GUIDES.map((g) => g.slug));

/**
 * Unknown guide URLs get a real 404 status. Without this they would show the
 * not-found page with a 200 status (a "soft 404"), which search engines dislike.
 * Rewriting to a path no route matches makes Next.js serve its 404 page.
 */
export function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname.split("/")[2];
  if (slug && !SLUGS.has(slug)) {
    return NextResponse.rewrite(new URL("/__not-found", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/resources/:slug",
};
