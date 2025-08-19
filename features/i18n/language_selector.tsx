"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"

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
    return ["en", "ru", "kk"].includes(firstSegment) ? firstSegment : "en"
  }

  const handleSelect = (code: string) => {
    const currentLocale = getCurrentLocale()
    const pathWithoutLocale = pathname.replace(`/${currentLocale}`, "") || "/"
    const newUrl = `/${code}${pathWithoutLocale}`

    console.log("[v0] Language switch:", { from: currentLocale, to: code, newUrl })
    window.location.href = newUrl
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
