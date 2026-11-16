import { NextResponse, type NextRequest } from "next/server";
import { GATE_COOKIE, expectedToken } from "@/lib/gate";

/** Every page needs the password; without the cookie, visitors go to /unlock first. */
export async function proxy(request: NextRequest) {
  if (request.cookies.get(GATE_COOKIE)?.value === (await expectedToken())) {
    return NextResponse.next();
  }
  const { pathname, search } = request.nextUrl;
  const url = request.nextUrl.clone();
  url.pathname = "/unlock";
  url.search = pathname === "/" && !search ? "" : `?next=${encodeURIComponent(pathname + search)}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    // Everything except the unlock page itself, Next's assets, and public files
    // (photos stay reachable so link previews and image loading keep working).
    "/((?!unlock|_next/static|_next/image|images/|favicon\\.ico|.*\\.(?:png|jpe?g|webp|avif|gif|svg|ico|txt|xml|webmanifest|mp4|mov|webm)$).*)",
  ],
};
