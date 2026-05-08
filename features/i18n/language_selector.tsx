"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useTranslation } from "@/hooks/use-translation"

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage()
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  const languages = [
    { code: "en", name: "English" },
    { code: "ru", name: "Русский" },
    { code: "kk", name: "Қазақша" },
  ]

  const handleSelect = (code: string) => {
    setLanguage(code as "en" | "ru" | "kk")
    setOpen(false)
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t("common.selectLanguage")} className="min-h-11 min-w-11">
          <Globe className="h-5 w-5" />
          <span className="sr-only">{t("common.selectLanguage")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleSelect(lang.code)}
            className={language === lang.code ? "bg-muted" : ""}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
