import type React from "react"
import { Suspense } from "react"
import { Toaster } from "@/components/ui/toaster"
import { GoogleAnalytics } from "@/shared/providers/analytics"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { Press_Start_2P } from "next/font/google"
import type { Metadata } from "next"
import ClientLayout from "./client-layout"
import { LanguageProvider } from "@/contexts/language-context"
import { SupabaseProvider } from "@/contexts/supabase-context"
import { AuthProvider } from "@/contexts/auth-context"

// Make sure Radix UI deps are referenced so they're bundled
import "@/lib/radix-deps"

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
  return (
    <html lang="en" className={`dark ${pixelFont.variable}`} suppressHydrationWarning>
      <head>
        <link rel="alternate" type="application/rss+xml" title="DSML Kazakhstan News" href="/news.xml" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        {/* Add Google Analytics with Suspense boundary */}
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        <SupabaseProvider>
          <AuthProvider>
            <LanguageProvider>
              <ClientLayout>{children}</ClientLayout>
            </LanguageProvider>
          </AuthProvider>
        </SupabaseProvider>
        <Toaster />
      </body>
    </html>
  )
}
