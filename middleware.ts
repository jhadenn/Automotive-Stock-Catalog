import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * Next.js middleware function that handles authentication checking and route protection.
 * 
 * This middleware:
 * 1. Runs on every request matching the configured routes
 * 2. Creates a Supabase client to check the user's session
 * 3. Redirects unauthenticated users to the login page when they try to access protected routes
 * 
 * @param req - The incoming Next.js request
 * @returns NextResponse with either the original response or a redirect
 */
export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protect routes that require authentication
  if (!session && (
    req.nextUrl.pathname.startsWith('/admin') ||
    req.nextUrl.pathname.startsWith('/dashboard')
  )) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return res
}

/**
 * Configuration for which routes the middleware should run on.
 * Currently protects all admin and dashboard routes.
 */
export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*']
} 