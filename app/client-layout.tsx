"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSafeAuth } from "@/hooks/use-safe-auth"
import LanguageSelector from "@/features/i18n/language_selector"
import { useSafeTranslation } from "@/hooks/use-safe-translation"
import { useRouter } from "next/navigation"

const isSSRPath = (path: string): boolean => {
  const ssrPaths = ["/news", "/jobs", "/articles"] // добавлен /articles в список SSR путей
  return ssrPaths.some((ssrPath) => path === ssrPath || path.startsWith(`${ssrPath}/`))
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut, loading } = useSafeAuth()
  const { t } = useSafeTranslation()

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "supabase.auth.token" && e.newValue) {
        console.log("[v0] Auth token detected, refreshing...")
        router.refresh()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [router])

  useEffect(() => {
    console.log("[v0] Navigation auth state:", {
      user: user ? { id: user.id, email: (user as any).email } : null,
      hasUser: !!user,
      loading,
      pathname,
    })
  }, [user, pathname, loading])

  const getCurrentLang = useCallback(() => {
    const segments = pathname.split("/").filter(Boolean)
    const firstSegment = segments[0]
    if (["en", "eng", "ru", "kk"].includes(firstSegment)) {
      return firstSegment === "eng" ? "en" : firstSegment
    }

    if (typeof window !== "undefined") {
      const storedLang = localStorage.getItem("preferred-language")
      if (storedLang && ["en", "ru", "kk"].includes(storedLang)) {
        return storedLang
      }
    }

    return "en"
  }, [pathname])

  const currentLang = getCurrentLang()
  const langPrefix = `/${currentLang}`

  const buildHref = (path: string) => {
    if (path === "/" || path === "") {
      return "/"
    }

    if (isSSRPath(path)) {
      return `${langPrefix}${path}`
    }
    return path
  }

  const displayName = (user as any)?.email ? (user as any).email.split("@")[0] : ""

  // Close mobile menu when path changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  // Enforce dark mode
  useEffect(() => {
    document.documentElement.classList.add("dark")
  }, [])

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/" || pathname === langPrefix
    }
    if (href === `${langPrefix}`) {
      return pathname === "/" || pathname === langPrefix
    }
    return pathname.startsWith(href)
  }

  const NavLink = ({
    href,
    children,
  }: {
    href: string
    children: React.ReactNode
  }) => (
    <Link
      href={href}
      className={`text-sm font-medium font-pixel ${
        isActive(href) ? "text-primary" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </Link>
  )

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          {/* ------------- Logo & desktop nav ------------- */}
          <div className="flex items-center gap-6">
            <Link href={langPrefix} className="flex items-center gap-2 -ml-12">
              <Image
                src="/images/dsml-logo.png"
                alt="DSML Kazakhstan Logo"
                width={32}
                height={32}
                className="rounded-sm"
              />
              <span className="font-medium font-pixel">DSMLKZ</span>
            </Link>

            {/* -------- Desktop navigation -------- */}
            <nav className="hidden md:flex items-center gap-6">
              <NavLink href="/">{t("nav.home")}</NavLink>
              <NavLink href={buildHref("/news")}>{t("nav.newsFeed")}</NavLink>
              <NavLink href={buildHref("/jobs")}>{t("nav.jobsFeed")}</NavLink>
              <NavLink href={buildHref("/research")}>{t("nav.research")}</NavLink>
              <NavLink href={buildHref("/articles")}>{t("nav.articles")}</NavLink>
              <NavLink href={buildHref("/events")}>{t("nav.events")}</NavLink>
              <NavLink href={buildHref("/faces")}>{t("nav.faces")}</NavLink>
              <NavLink href={buildHref("/rules")}>{t("nav.rules")}</NavLink>
            </nav>
          </div>

          {/* --------- Right section (language, auth, burger) --------- */}
          <div className="flex items-center gap-4">
            <LanguageSelector />

            {/* Desktop auth area */}
            <div className="hidden md:flex items-center gap-4">
              {loading ? null : user ? (
                <>
                  <Link href={buildHref("/dashboard")} className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">{displayName}</span>
                  </Link>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      const btn = e.currentTarget
                      btn.disabled = true
                      Promise.resolve(signOut()).finally(() => {
                        btn.disabled = false
                      })
                    }}
                  >
                    {t("nav.signout")}
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/signin" onClick={() => console.log("[v0] Clicking signin link:", "/auth/signin")}>
                    <Button variant="outline" size="sm">
                      {t("nav.signin")}
                    </Button>
                  </Link>
                  <Link href="/auth/signup" onClick={() => console.log("[v0] Clicking signup link:", "/auth/signup")}>
                    <Button size="sm">{t("nav.signup")}</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile burger */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen((prev) => !prev)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* ---------- Mobile menu ---------- */}
        {isMenuOpen && (
          <div className="container md:hidden fixed inset-x-0 top-16 z-50 bg-background border-b shadow-lg py-4 pb-6">
            <nav className="flex flex-col gap-4" onClick={() => setIsMenuOpen(false)}>
              <Link
                href="/"
                className={`text-sm font-medium font-pixel ${isActive("/") ? "text-primary" : "text-muted-foreground"}`}
              >
                {t("nav.home")}
              </Link>
              <Link
                href={buildHref("/news")}
                className={`text-sm font-medium font-pixel ${
                  isActive(buildHref("/news")) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {t("nav.newsFeed")}
              </Link>
              <Link
                href={buildHref("/jobs")}
                className={`text-sm font-medium font-pixel ${
                  isActive(buildHref("/jobs")) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {t("nav.jobsFeed")}
              </Link>
              <Link
                href={buildHref("/research")}
                className={`text-sm font-medium font-pixel ${
                  isActive(buildHref("/research")) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {t("nav.research")}
              </Link>
              <Link
                href={buildHref("/articles")}
                className={`text-sm font-medium font-pixel ${
                  isActive(buildHref("/articles")) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {t("nav.articles")}
              </Link>
              <Link
                href={buildHref("/events")}
                className={`text-sm font-medium font-pixel ${
                  isActive(buildHref("/events")) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {t("nav.events")}
              </Link>
              <Link
                href={buildHref("/faces")}
                className={`text-sm font-medium font-pixel ${
                  isActive(buildHref("/faces")) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {t("nav.faces")}
              </Link>
              <Link
                href={buildHref("/rules")}
                className={`text-sm font-medium font-pixel ${
                  isActive(buildHref("/rules")) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {t("nav.rules")}
              </Link>

              {/* Auth buttons mobile */}
              {loading ? null : user ? (
                <>
                  <Link
                    href={buildHref("/dashboard")}
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-3 w-3 text-primary" />
                    </div>
                    <span>{displayName}</span>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-[#FFF32A] text-black hover:bg-[#FFF32A]/90 border-[#FFF32A]"
                    onClick={(e) => {
                      const btn = e.currentTarget
                      btn.disabled = true
                      Promise.resolve(signOut()).finally(() => {
                        btn.disabled = false
                      })
                    }}
                  >
                    {t("nav.signout")}
                  </Button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/auth/signin"
                    onClick={() => console.log("[v0] Clicking mobile signin link:", "/auth/signin")}
                  >
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      {t("nav.signin")}
                    </Button>
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => console.log("[v0] Clicking mobile signup link:", "/auth/signup")}
                  >
                    <Button size="sm" className="w-full">
                      {t("nav.signup")}
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      {/* ---------- Footer ---------- */}
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
          <div className="flex items-center gap-2">
            <Image
              src="/images/dsml-logo.png"
              alt="DSML Kazakhstan Logo"
              width={24}
              height={24}
              className="rounded-sm"
            />
            <span className="text-sm text-muted-foreground">© {new Date().getFullYear()} DSML Kazakhstan.</span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="https://t.me/dsmlkz_news"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Telegram
            </Link>
            <Link
              href="https://www.youtube.com/c/DataScienceKazakhstan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              YouTube
            </Link>
            <Link
              href="https://www.linkedin.com/company/53101063/admin/dashboard/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              LinkedIn
            </Link>
            <Link
              href="https://www.instagram.com/dsmlkz/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Instagram
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
