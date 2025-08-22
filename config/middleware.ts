import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { match } from "@formatjs/intl-localematcher"
import Negotiator from "negotiator"

const i18n = {
  defaultLocale: "en",
  locales: ["en", "ru", "kk"],
} as const

const localeMapping: Record<string, string> = {
  eng: "en", // Redirect legacy eng to en
  en: "en",
  ru: "ru",
  kk: "kk",
}

function getLocale(request: NextRequest): string {
  // Get locale from Accept-Language header
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages()
  const detectedLocale = match(languages, i18n.locales, i18n.defaultLocale)

  return localeMapping[detectedLocale] || "en"
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const pathname = req.nextUrl.pathname

  if (
    pathname.startsWith("/auth/") ||
    pathname.startsWith("/en/auth/") ||
    pathname.startsWith("/ru/auth/") ||
    pathname.startsWith("/kk/auth/")
  ) {
    return NextResponse.next()
  }

  if (pathname.startsWith("/eng/")) {
    const newPath = pathname.replace("/eng/", "/en/")
    return NextResponse.redirect(new URL(newPath + req.nextUrl.search, req.url))
  }

  if (pathname === "/signup") {
    return NextResponse.redirect(new URL("/auth/signup", req.url))
  }

  if (pathname === "/signin") {
    return NextResponse.redirect(new URL("/auth/signin", req.url))
  }

  if (pathname === "/news") {
    const locale = getLocale(req)
    return NextResponse.redirect(new URL(`/${locale}/news`, req.url))
  }

  if (pathname === "/jobs") {
    const locale = getLocale(req)
    return NextResponse.redirect(new URL(`/${locale}/jobs`, req.url))
  }

  // Add pathname to headers for locale detection in components
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set("x-pathname", pathname)

  // Protected routes that require authentication
  const protectedRoutes = ["/profile", "/post-signup"]
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  const adminRoutes = ["/admin"]
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route))

  // If accessing a protected route without a session, redirect to sign in
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/auth/signin", req.url))
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/post-signup/:path*",
    "/admin/:path*",
    "/news",
    "/jobs",
    "/signup",
    "/signin",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
