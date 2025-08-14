import type React from "react"
import { LanguageProvider } from "@/contexts/language-context"

export default function StaticLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <LanguageProvider>{children}</LanguageProvider>
}
