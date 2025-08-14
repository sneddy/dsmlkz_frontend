"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSafeAuth } from "@/hooks/use-safe-auth"
import { useSafeTranslation } from "@/hooks/use-safe-translation"

// Safe LanguageSelector that handles missing provider
function SafeLanguageSelector() {
  try {
    const LanguageSelector = require("@/features/i18n/language_selector").default
    return <LanguageSelector />
  } catch {
    return null
  }
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, signOut, profile } = useSafeAuth()
  const { t } = useSafeTranslation()

  // Close mobile menu when path changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  // Enforce dark mode
  useEffect(() => {
    document.documentElement.classList.add("dark")
  }, [])

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
                href="/"
                className={`text-sm font-medium font-pixel ${
                  pathname === "/" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t("nav.home") || "Home"}
              </Link>
              <Link
                href="/news"
                className={`text-sm font-medium font-pixel ${
                  pathname === "/news" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t("nav.newsFeed") || "News"}
              </Link>
              <Link
                href="/jobs"
                className={`text-sm font-medium font-pixel ${
                  pathname === "/jobs" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t("nav.jobsFeed") || "Jobs"}
              </Link>
              <Link
                href="/research"
                className={`text-sm font-medium font-pixel ${
                  pathname === "/research" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t("nav.research") || "Research"}
              </Link>
              <Link
                href="/articles"
                className={`text-sm font-medium font-pixel ${
                  pathname === "/articles" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t("nav.articles") || "Articles"}
              </Link>
              <Link
                href="/events"
                className={`text-sm font-medium font-pixel ${
                  pathname === "/events" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t("nav.events") || "Events"}
              </Link>
              <Link
                href="/faces"
                className={`text-sm font-medium font-pixel ${
                  pathname === "/faces" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t("nav.faces") || "Faces"}
              </Link>
              <Link
                href="/rules"
                className={`text-sm font-medium font-pixel ${
                  pathname === "/rules" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t("nav.rules") || "Rules"}
              </Link>
            </nav>
          </div>

          {/* --------- Right section (language, auth, burger) --------- */}
          <div className="flex items-center gap-4">
            <SafeLanguageSelector />

            {user ? (
              <div className="hidden md:flex items-center gap-4">
                <Link href="/dashboard" className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{profile?.nickname || user.email?.split("@")[0]}</span>
                </Link>
                <Button
                  size="sm"
                  onClick={() => {
                    const btn = document.activeElement as HTMLButtonElement
                    if (btn) btn.disabled = true
                    signOut()
                  }}
                >
                  {t("auth.signOut") || "Sign Out"}
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                <Link href="/auth/signin">
                  <Button variant="outline" size="sm">
                    {t("home.signIn") || "Sign In"}
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">{t("home.signUp") || "Sign Up"}</Button>
                </Link>
              </div>
            )}

            {/* Mobile burger */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen((prev) => !prev)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* ---------- Mobile menu ---------- */}
        {isMenuOpen && (
          <div className="container md:hidden fixed inset-x-0 top-16 z-50 bg-background border-b shadow-lg py-4 pb-6">
            <nav className="flex flex-col gap-4">
              {/* ... existing mobile nav links ... */}
              <Link
                href="/"
                className={`text-sm font-medium font-pixel ${
                  pathname === "/" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {t("nav.home") || "Home"}
              </Link>
              <Link
                href="/news"
                className={`text-sm font-medium font-pixel ${
                  pathname === "/news" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {t("nav.newsFeed") || "News"}
              </Link>
              <Link
                href="/jobs"
                className={`text-sm font-medium font-pixel ${
                  pathname === "/jobs" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {t("nav.jobsFeed") || "Jobs"}
              </Link>
              <Link
                href="/research"
                className={`text-sm font-medium font-pixel ${
                  pathname === "/research" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {t("nav.research") || "Research"}
              </Link>
              <Link
                href="/articles"
                className={`text-sm font-medium font-pixel ${
                  pathname === "/articles" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {t("nav.articles") || "Articles"}
              </Link>
              <Link
                href="/events"
                className={`text-sm font-medium font-pixel ${
                  pathname === "/events" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {t("nav.events") || "Events"}
              </Link>
              <Link
                href="/faces"
                className={`text-sm font-medium font-pixel ${
                  pathname === "/faces" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {t("nav.faces") || "Faces"}
              </Link>
              <Link
                href="/rules"
                className={`text-sm font-medium font-pixel ${
                  pathname === "/rules" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {t("nav.rules") || "Rules"}
              </Link>

              {/* Auth buttons mobile */}
              {user ? (
                <>
                  <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-3 w-3 text-primary" />
                    </div>
                    <span>{profile?.nickname || user.email?.split("@")[0]}</span>
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
                    {t("auth.signOut") || "Sign Out"}
                  </Button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link href="/auth/signin">
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      {t("home.signIn") || "Sign In"}
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button size="sm" className="w-full">
                      {t("home.signUp") || "Sign Up"}
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
