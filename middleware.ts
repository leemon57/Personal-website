import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ACCESS_COOKIE, isSessionUnlocked } from "@/lib/access";

/**
 * Gates the static resume PDF behind the recruiter access cookie. The /courses
 * page gates its own data (it can render an unlock UI), but /resume.pdf is a raw
 * asset in public/ — hiding links to it is not enough, so it is blocked here at
 * the edge and redirected to the unlock page.
 */
export async function middleware(request: NextRequest) {
  const token = request.cookies.get(ACCESS_COOKIE)?.value;
  if (await isSessionUnlocked(token)) {
    return NextResponse.next();
  }
  const url = new URL("/unlock", request.url);
  url.searchParams.set("next", "/resume.pdf");
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/resume.pdf"],
};
