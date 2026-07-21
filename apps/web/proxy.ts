import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { payRateLimit } from "./lib/rateLimit";

export const config = {
  matcher: [
    '/signin',
    '/signup',
    '/dashboard/:path*',
    '/api/invoices/:path*/pay',
  ],
}

export async function proxy(req: NextRequest) {
  const sessionCookie = getSessionCookie(req);
  const path = req.nextUrl.pathname;


  if (path.match(/^\/api\/invoices\/[^/]+\/pay/)) {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
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