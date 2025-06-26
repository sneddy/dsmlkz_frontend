import type React from "react"
import { Suspense } from "react"
import { Toaster } from "@/components/ui/toaster"
import { SupabaseProvider } from "@/contexts/supabase-context"
import { AuthProvider } from "@/contexts/auth-context"
import { LanguageProvider } from "@/contexts/language-context"
import { GoogleAnalytics } from "@/components/google-analytics"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { Press_Start_2P } from "next/font/google"
import type { Metadata } from "next"
import ClientLayout from "./client-layout"

// Make sure Radix UI deps are referenced so they’re bundled
import "@/lib/radix-deps"

const inter = Inter({ subsets: ["latin", "cyrillic"] })
const pixelFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
})

export const metadata: Metadata = {
  title: "DSML Kazakhstan Community",
  description: "A community platform for Data Science and Machine Learning enthusiasts in Kazakhstan",
  icons: {
    icon: "/images/dsml-logo.png",
    apple: "/images/dsml-logo.png",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`dark ${pixelFont.variable}`} suppressHydrationWarning>
      <body className={inter.className}>
        {/* Add Google Analytics with Suspense boundary */}
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        <SupabaseProvider>
          <AuthProvider>
            <LanguageProvider>
              <ClientLayout>{children}</ClientLayout>
              <Toaster />
            </LanguageProvider>
          </AuthProvider>
        </SupabaseProvider>
      </body>
    </html>
  )
}
