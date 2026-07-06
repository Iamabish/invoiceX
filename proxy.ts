import { NextProxy, NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export const config = {
  matcher: ['/dashboard/:path*', '/signin', '/signup'],
}

export async function proxy(req : NextRequest) {

    const sessionCookie = getSessionCookie(req)
    

    console.log('session cookie', sessionCookie);

    const path = req.nextUrl.pathname

    console.log('curren path', path);
    

    const isProtectedRoute = path.startsWith('/dashboard')
    const isPublicRoute = path === "/signin" || path === "/signup" || path === "/"
    

    if(sessionCookie && isPublicRoute) {

        console.log('push');
        

        return NextResponse.redirect(
            new URL('/dashboard', req.url)
        )
    }

    if(!sessionCookie && isProtectedRoute) {
        return NextResponse.redirect(
            new URL('/signin', req.url)
        )
    }

    return NextResponse.next()

}