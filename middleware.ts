import { NextRequest, NextResponse } from "next/server";

// Protects every route except /login and the auth API itself.
// The actual password lives in the UPSC_ACCESS_PASSWORD env var (set in
// Vercel dashboard, never in code) — see .env.example.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublic =
    pathname.startsWith("/login") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon");

  if (isPublic) return NextResponse.next();

  const session = req.cookies.get("upsc_session")?.value;
  if (session === "granted") {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
