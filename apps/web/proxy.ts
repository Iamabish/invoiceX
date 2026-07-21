import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { authRateLimit, payRateLimit } from "./lib/rateLimit";




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
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const path = req.nextUrl.pathname;

  if (path.startsWith('/signin') || path.startsWith('/signup')) {
    const { success, limit, remaining } = await authRateLimit.limit(ip);
    if (!success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }


    console.log('limit', limit);
    console.log('ip', ip);
    console.log('success', success);
    console.log('remaining', remaining);
  
    
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