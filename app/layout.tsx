import type React from "react"
import { Suspense } from "react"
import { Toaster } from "@/components/ui/toaster"
import { GoogleAnalytics } from "@/shared/providers/analytics"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { Press_Start_2P } from "next/font/google"
import type { Metadata } from "next"
import ClientLayout from "./client-layout"
import { AuthProvider } from "@/contexts/auth-context"
import { LanguageProvider } from "@/contexts/language-context"
import { ProfileProvider } from "@/features/profile/client/ProfileProvider"
import { LanguageSyncProvider } from "@/components/language-sync-provider"
import { LanguageDebug } from "@/components/language-debug"
import { getTranslations } from "@/translations/index"

const inter = Inter({ subsets: ["latin", "cyrillic"] })
const pixelFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
})

export const metadata: Metadata = {
  title: "DSML Kazakhstan Community",
  description: "DSMLKZ Community - Сообщество энтузиастов AI и Машинного обучения в Казахстане",
  icons: {
    icon: "/images/dsml-logo.png",
    apple: "/images/dsml-logo.png",
  },
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const defaultTranslations = getTranslations("ru")

  return (
    <html lang="ru" className={`dark ${pixelFont.variable}`} suppressHydrationWarning>
      <head>
        <link rel="alternate" type="application/rss+xml" title="DSML Kazakhstan News" href="/news.xml" />
      </head>
      <body className={inter.className}>
        {/* Add Google Analytics with Suspense boundary */}
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        {/* Language provider with Russian as default */}
        <LanguageProvider language="ru" translations={defaultTranslations}>
          <LanguageSyncProvider />
          <AuthProvider>
            <ProfileProvider>
              <ClientLayout>{children}</ClientLayout>
            </ProfileProvider>
          </AuthProvider>
          {/* Debug component for testing language sync */}
          <LanguageDebug />
        </LanguageProvider>
        <Toaster />
      </body>
    </html>
  )
}
