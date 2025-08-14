import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protected routes that require authentication
  const protectedRoutes = ["/profile", "/post-signup"]
  const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

  // Admin routes that require admin access
  const adminRoutes = ["/admin"]
  const isAdminRoute = adminRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

  // If accessing a protected route without a session, redirect to sign in
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/auth/signin", req.url))
  }

  // For admin routes, we'll let the client-side handle the access control
  // since we need to check if the user is an admin

  return res
}

export const config = {
  matcher: ["/profile/:path*", "/post-signup/:path*", "/admin/:path*"],
}
