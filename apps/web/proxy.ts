import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { authRateLimit, payRateLimit } from "./lib/rateLimit";




export const config = {
  matcher: ['/dashboard/:path*', '/signin', '/signup', '/api/invoices/:path*'],
}

export async function proxy(req: NextRequest) {
  const sessionCookie = getSessionCookie(req);
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const path = req.nextUrl.pathname;

  if (path.startsWith('/signin') || path.startsWith('/signup')) {
    const { success } = await authRateLimit.limit(ip);
    if (!success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }
  }

  if (path.match(/^\/api\/invoices\/[^/]+\/pay/)) {
    const { success } = await payRateLimit.limit(ip);
    if (!success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }
  }

  const isProtectedRoute = path.startsWith('/dashboard');
  const isPublicRoute = path === "/signin" || path === "/signup" || path === "/";

  if (sessionCookie && isPublicRoute) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  if (!sessionCookie && isProtectedRoute) {
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  return NextResponse.next();
}