"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"
import { isSSRPath } from "@/lib/i18n-ssr-routes"

export default function LanguageSelector() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const languages = [
    { code: "en", name: "English" },
    { code: "ru", name: "Русский" },
    { code: "kk", name: "Қазақша" },
  ]

  const getCurrentLocale = () => {
    const segments = pathname.split("/").filter(Boolean)
    const firstSegment = segments[0]

    if (isSSRPath(pathname)) {
      return ["en", "ru", "kk"].includes(firstSegment) ? firstSegment : "en"
    } else {
      // Для CSR страниц берем язык из localStorage
      const savedLang = typeof window !== "undefined" ? localStorage.getItem("preferred-language") : null
      return savedLang && ["en", "ru", "kk"].includes(savedLang) ? savedLang : "en"
    }
  }

  const handleSelect = (code: string) => {
    const currentLocale = getCurrentLocale()

    localStorage.setItem("preferred-language", code)

    if (isSSRPath(pathname)) {
      // SSR страницы: полная перезагрузка с языковым префиксом
      const pathWithoutLocale = pathname.replace(`/${currentLocale}`, "") || "/"
      const newUrl = `/${code}${pathWithoutLocale}`
      console.log("[v0] Language switch (SSR):", { from: currentLocale, to: code, newUrl })

      window.dispatchEvent(
        new CustomEvent("languageChange", {
          detail: { language: code },
        }),
      )

      window.location.href = newUrl
    } else {
      // CSR страницы: только обновление языка в контексте
      console.log("[v0] Language switch (CSR):", { from: currentLocale, to: code, pathname })

      // Отправляем custom event для обновления языка в контексте
      window.dispatchEvent(
        new CustomEvent("languageChange", {
          detail: { language: code },
        }),
      )
    }

    setOpen(false)
  }

  const currentLanguage = getCurrentLocale()

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe className="h-5 w-5" />
          <span className="sr-only">Select language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleSelect(lang.code)}
            className={currentLanguage === lang.code ? "bg-muted" : ""}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
