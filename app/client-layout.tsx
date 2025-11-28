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
    let isCancelled = false

    if (!user) {
      setDisplayName("anon")
      return
    }

    const metaNickname = (user.user_metadata as any)?.nickname
    const resolved = profile?.nickname || metaNickname || "anon"
    if (!loadingProfile) {
      setDisplayName(resolved)
    }

    return () => {
      isCancelled = true
    }
  }, [user, profile, loadingProfile, supabase])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          {/* ------------- Logo & desktop nav ------------- */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 -ml-12">
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
              <Link
                prefetch
                href="/"
                className={`text-sm font-medium font-pixel ${
                  pathname === "/" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t("nav.home")}
              </Link>
              <Link
                prefetch
                href="/news"
                className={`text-sm font-medium font-pixel ${
                  pathname === "/news" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t("nav.newsFeed")}
              </Link>
              <Link
                prefetch
                href="/jobs"
                className={`text-sm font-medium font-pixel ${
                  pathname === "/jobs" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t("nav.jobsFeed")}
              </Link>
              <Link
                prefetch
                href="/research"
                className={`text-sm font-medium font-pixel ${
                  pathname === "/research" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t("nav.research")}
              </Link>
              <Link
                prefetch
                href="/articles"
                className={`text-sm font-medium font-pixel ${
                  pathname === "/articles" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t("nav.articles")}
              </Link>
              <Link
                prefetch
                href="/events"
                className={`text-sm font-medium font-pixel ${
                  pathname === "/events" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t("nav.events")}
              </Link>
              <Link
                prefetch
                href="/faces"
                className={`text-sm font-medium font-pixel ${
                  pathname === "/faces" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t("nav.faces")}
              </Link>
              <Link
                prefetch
                href="/rules"
                className={`text-sm font-medium font-pixel ${
                  pathname === "/rules" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t("nav.rules")}
              </Link>
            </nav>
          </div>

          {/* --------- Right section (language, auth, burger) --------- */}
          <div className="flex items-center gap-4">
            <LanguageSelector />

            {user ? (
              <div className="hidden md:flex items-center gap-4">
                <Link href="/dashboard" className="flex items-center gap-2">
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
              <div className="hidden md:flex items-center gap-4">
                <Link href="/auth/signin">
                  <Button variant="outline" size="sm">
                    {t("nav.signin")}
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">{t("nav.signup")}</Button>
                </Link>
              </div>
            )}

            {/* Mobile burger */}
            <Button
              variant="outline"
              size="icon"
              aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
              className="md:hidden border-white/30 text-white bg-black/30 backdrop-blur-sm hover:bg-white/10 hover:text-white"
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* ---------- Mobile menu ---------- */}
        {isMenuOpen && (
          <div className="container md:hidden fixed inset-x-0 top-16 z-50 bg-background border-b shadow-lg py-4 pb-6">
            <nav className="flex flex-col gap-4">
              <Link
                prefetch
                href="/"
                className={`text-sm font-medium font-pixel ${
                  pathname === "/" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {t("nav.home")}
              </Link>
              <Link
                href="/news"
                className={`text-sm font-medium font-pixel ${
                  pathname === "/news" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {t("nav.newsFeed")}
              </Link>
              <Link
                href="/jobs"
                className={`text-sm font-medium font-pixel ${
                  pathname === "/jobs" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {t("nav.jobsFeed")}
              </Link>
              <Link
                href="/research"
                className={`text-sm font-medium font-pixel ${
                  pathname === "/research" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {t("nav.research")}
              </Link>
              <Link
                href="/articles"
                className={`text-sm font-medium font-pixel ${
                  pathname === "/articles" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {t("nav.articles")}
              </Link>
              <Link
                href="/events"
                className={`text-sm font-medium font-pixel ${
                  pathname === "/events" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {t("nav.events")}
              </Link>
              <Link
                href="/faces"
                className={`text-sm font-medium font-pixel ${
                  pathname === "/faces" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {t("nav.faces")}
              </Link>
              <Link
                href="/rules"
                className={`text-sm font-medium font-pixel ${
                  pathname === "/rules" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {t("nav.rules")}
              </Link>

              {/* Auth buttons mobile */}
              {user ? (
                <>
                  <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-3 w-3 text-primary" />
                    </div>
                    <span>{displayName}</span>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-[#FFF32A] text-black hover:bg-[#FFF32A]/90 border-[#FFF32A]"
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
                  <Link href="/auth/signin">
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      {t("nav.signin")}
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
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
