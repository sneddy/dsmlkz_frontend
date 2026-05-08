"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import LanguageSelector from "@/features/i18n/language_selector"
import { useSafeTranslation } from "@/hooks/use-safe-translation"
import { useProfile } from "@/features/profile/client/ProfileProvider"
import { getSupabaseClient } from "@/lib/supabase-client"
import { trackGaEvent } from "@/shared/providers/analytics"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const { profile, loadingProfile } = useProfile()
  const [displayName, setDisplayName] = useState("anon")
  const { t } = useSafeTranslation()
  const supabase = useMemo(() => getSupabaseClient(), [])

  // Close mobile menu when path changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  // Enforce dark mode
  useEffect(() => {
    document.documentElement.classList.add("dark")
  }, [])

  useEffect(() => {
    if (!user) {
      setDisplayName("anon")
      return
    }

    const metaNickname = (user.user_metadata as any)?.nickname
    const resolved = profile?.nickname || metaNickname || "anon"
    if (!loadingProfile) {
      setDisplayName(resolved)
    }
  }, [user, profile, loadingProfile, supabase])

  const handleNavClick = (label: string, destination: string) => () => {
    trackGaEvent("navigation_click", {
      label,
      destination,
      page_path: pathname,
      page_title: typeof document !== "undefined" ? document.title : undefined,
    })
  }

  const handleCtaClick = (ctaLabel: string, destination: string) => () => {
    trackGaEvent("cta_click", { cta_label: ctaLabel, destination, page_path: pathname, page_title: document.title })
  }

  const navLinks = [
    { href: "/", label: t("nav.home"), analyticsLabel: "home", active: pathname === "/" },
    { href: "/news", label: t("nav.newsFeed"), analyticsLabel: "news", active: pathname === "/news" },
    { href: "/jobs", label: t("nav.jobsFeed"), analyticsLabel: "jobs", active: pathname === "/jobs" },
    { href: "/research", label: t("nav.research"), analyticsLabel: "research", active: pathname === "/research" },
    { href: "/articles", label: t("nav.articles"), analyticsLabel: "articles", active: pathname === "/articles" },
    { href: "/events", label: t("nav.events"), analyticsLabel: "events", active: pathname === "/events" },
    { href: "/faces", label: t("nav.faces"), analyticsLabel: "faces", active: pathname === "/faces" },
    { href: "/rules", label: t("nav.rules"), analyticsLabel: "rules", active: pathname === "/rules" },
  ]

  const navLinkClass =
    "flex min-h-11 items-center rounded-md text-sm font-medium font-pixel transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00AEC7] focus-visible:ring-offset-2 focus-visible:ring-offset-background"

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 py-4">
          {/* ------------- Logo & desktop nav ------------- */}
          <div className="flex min-w-0 items-center gap-6">
            <Link
              href="/"
              className="flex min-h-11 shrink-0 items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00AEC7] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
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
            <nav className="hidden xl:flex items-center gap-6">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  prefetch
                  href={item.href}
                  aria-current={item.active ? "page" : undefined}
                  className={`${navLinkClass} px-1 ${
                    item.active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={handleNavClick(item.analyticsLabel, item.href)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* --------- Right section (language, auth, burger) --------- */}
          <div className="flex items-center gap-4">
            <LanguageSelector />

            {user ? (
              <div className="hidden xl:flex items-center gap-4">
                <Link
                  href="/dashboard"
                  className="flex min-h-11 items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00AEC7] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  onClick={handleNavClick("dashboard", "/dashboard")}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{displayName}</span>
                </Link>
                <Button
                  size="sm"
                  onClick={() => {
                    const btn = document.activeElement as HTMLButtonElement
                    if (btn) btn.disabled = true
                    signOut()
                  }}
                >
                  {t("nav.signout")}
                </Button>
              </div>
            ) : (
              <div className="hidden xl:flex items-center gap-4">
                <Button asChild variant="outline" size="sm" className="min-h-11">
                  <Link href="/auth/signin" onClick={handleCtaClick("signin", "/auth/signin")}>
                    {t("nav.signin")}
                  </Link>
                </Button>
                <Button asChild size="sm" className="min-h-11">
                  <Link href="/auth/signup" onClick={handleCtaClick("signup", "/auth/signup")}>
                    {t("nav.signup")}
                  </Link>
                </Button>
              </div>
            )}

            {/* Mobile burger */}
            <Button
              variant="outline"
              size="icon"
              aria-label={isMenuOpen ? t("nav.closeNavigation") : t("nav.openNavigation")}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              className="xl:hidden min-h-11 min-w-11 border-white/30 text-white bg-black/30 backdrop-blur-sm hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-[#00AEC7] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* ---------- Mobile menu ---------- */}
        {isMenuOpen && (
          <div className="fixed inset-x-0 top-16 z-50 w-full max-w-full overflow-x-hidden border-b border-white/10 bg-background/95 shadow-2xl backdrop-blur-xl xl:hidden">
            <nav id="mobile-navigation" className="mx-auto flex w-full max-w-screen-sm flex-col gap-2 px-4 py-4 pb-6">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={item.active ? "page" : undefined}
                  className={`${navLinkClass} px-2 ${
                    item.active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={handleNavClick(item.analyticsLabel, item.href)}
                >
                  {item.label}
                </Link>
              ))}

              {/* Auth buttons mobile */}
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="flex min-h-11 items-center gap-2 rounded-md text-sm font-medium text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00AEC7] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    onClick={handleNavClick("dashboard", "/dashboard")}
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-3 w-3 text-primary" />
                    </div>
                    <span>{displayName}</span>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="min-h-11 w-full bg-[#FFF32A] text-black hover:bg-[#FFF32A]/90 border-[#FFF32A]"
                    onClick={() => {
                      const btn = document.activeElement as HTMLButtonElement
                      if (btn) btn.disabled = true
                      signOut()
                    }}
                  >
                    {t("nav.signout")}
                  </Button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="min-h-11 w-full bg-transparent"
                  >
                    <Link href="/auth/signin" onClick={handleCtaClick("signin", "/auth/signin")}>
                      {t("nav.signin")}
                    </Link>
                  </Button>
                  <Button asChild size="sm" className="min-h-11 w-full">
                    <Link href="/auth/signup" onClick={handleCtaClick("signup", "/auth/signup")}>
                      {t("nav.signup")}
                    </Link>
                  </Button>
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
              href="https://www.linkedin.com/company/53101063/"
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
