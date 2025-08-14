import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  // Simple middleware without complex auth checks to prevent redirect loops
  const { pathname } = req.nextUrl

  // Only handle specific protected routes
  if (pathname.startsWith("/profile") || pathname.startsWith("/post-signup")) {
    // Let the client-side AuthGuard handle the auth check
    // This prevents server-side redirect loops
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/profile/:path*", "/post-signup/:path*"],
}
