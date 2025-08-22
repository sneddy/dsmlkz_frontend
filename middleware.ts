import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { match } from "@formatjs/intl-localematcher"
import Negotiator from "negotiator"
import { isSSRPath } from "@/lib/i18n-ssr-routes"

const i18n = {
  defaultLocale: "ru", // Изменено на ru как основной язык
  locales: ["ru", "en", "kk"],
} as const

const localeMapping: Record<string, string> = {
  eng: "en", // Redirect legacy eng to en
  en: "en",
  ru: "ru",
  kk: "kk",
}

function getLocale(request: NextRequest): string {
  // Сначала проверяем куки
  const preferredLanguage = request.cookies.get("preferred-language")?.value
  if (preferredLanguage && i18n.locales.includes(preferredLanguage as any)) {
    return preferredLanguage
  }

  // Fallback на Accept-Language header
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  try {
    const languages = new Negotiator({ headers: negotiatorHeaders }).languages()
    // Фильтруем только валидные локали
    const validLanguages = languages.filter(lang => {
      try {
        return Intl.getCanonicalLocales(lang).length > 0
      } catch {
        return false
      }
    })
    
    if (validLanguages.length > 0) {
      const detectedLocale = match(validLanguages, i18n.locales, i18n.defaultLocale)
      return localeMapping[detectedLocale] || i18n.defaultLocale
    }
  } catch (error) {
    console.warn("[Middleware] Error detecting locale:", error)
  }

  return i18n.defaultLocale
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const pathname = req.nextUrl.pathname

  // Пропускаем API маршруты и статические файлы
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/images/") ||
    pathname.startsWith("/news.xml")
  ) {
    return NextResponse.next()
  }

  // Пропускаем auth маршруты (они остаются без языкового префикса)
  if (pathname.startsWith("/auth/")) {
    return NextResponse.next()
  }

  // Пропускаем защищенные маршруты (dashboard, profile и т.д.)
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/profile") || pathname.startsWith("/settings")) {
    return NextResponse.next()
  }

  // Пропускаем уже языковые маршруты
  if (pathname.startsWith("/ru/") || pathname.startsWith("/en/") || pathname.startsWith("/kk/")) {
    return NextResponse.next()
  }

  // Пропускаем точные языковые маршруты (например, /ru, /en, /kk)
  if (pathname === "/ru" || pathname === "/en" || pathname === "/kk") {
    return NextResponse.next()
  }

  // Пропускаем корневой маршрут (он обрабатывается в app/page.tsx)
  if (pathname === "/") {
    return NextResponse.next()
  }

  // Legacy redirects
  if (pathname.startsWith("/eng/")) {
    const newPath = pathname.replace("/eng/", "/en/")
    return NextResponse.redirect(new URL(newPath + req.nextUrl.search, req.url))
  }

  // Legacy auth redirects
  if (pathname === "/signup") {
    return NextResponse.redirect(new URL("/auth/signup", req.url))
  }

  if (pathname === "/signin") {
    return NextResponse.redirect(new URL("/auth/signin", req.url))
  }

  // Проверяем, является ли страница SSR (требует языкового префикса)
  if (isSSRPath(pathname)) {
    // Перенаправляем SSR страницы на языковые версии
    const locale = getLocale(req)
    const newUrl = new URL(`/${locale}${pathname}${req.nextUrl.search}`, req.url)
    
    console.log(`[Middleware] Redirecting SSR page ${pathname} to ${newUrl.pathname}`)
    return NextResponse.redirect(newUrl)
  }

  // CSR страницы оставляем без языкового префикса
  console.log(`[Middleware] Keeping CSR page ${pathname} without language prefix`)
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     * - news.xml (RSS feed)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images|news.xml).*)",
  ],
}
