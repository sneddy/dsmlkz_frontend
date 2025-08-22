"use client"

import { useLanguage } from "@/contexts/language-context"
import { getClientLanguage, setClientLanguage } from "@/lib/language-sync"
import { Button } from "@/components/ui/button"

export function LanguageDebug() {
  const { language, translations, setLanguage } = useLanguage()

  const handleLanguageChange = (newLang: "en" | "ru" | "kk") => {
    setLanguage(newLang)
  }

  const handleCookieSync = () => {
    const cookieLang = getClientLanguage()
    console.log("[v0] LanguageDebug: cookie language", cookieLang)
    if (cookieLang !== language) {
      setLanguage(cookieLang)
    }
  }

  const handleSetCookie = (newLang: "en" | "ru" | "kk") => {
    setClientLanguage(newLang)
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-lg p-4 text-sm text-white max-w-xs">
      <h3 className="font-bold mb-2 text-[#00AEC7]">Language Debug</h3>
      
      <div className="space-y-2">
        <div>
          <span className="text-gray-400">Current:</span>{" "}
          <span className="font-mono text-[#FFF32A]">{language}</span>
        </div>
        
        <div>
          <span className="text-gray-400">Cookie:</span>{" "}
          <span className="font-mono text-[#FFF32A]">{getClientLanguage()}</span>
        </div>
        
        <div>
          <span className="text-gray-400">Translations:</span>{" "}
          <span className="font-mono text-[#FFF32A]">{Object.keys(translations).length}</span>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        <div className="flex gap-1">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => handleLanguageChange("ru")}
            className="text-xs px-2 py-1"
          >
            RU
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => handleLanguageChange("en")}
            className="text-xs px-2 py-1"
          >
            EN
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => handleLanguageChange("kk")}
            className="text-xs px-2 py-1"
          >
            KK
          </Button>
        </div>
        
        <div className="flex gap-1">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleCookieSync}
            className="text-xs px-2 py-1"
          >
            Sync
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => handleSetCookie("ru")}
            className="text-xs px-2 py-1"
          >
            Set RU
          </Button>
        </div>
      </div>
    </div>
  )
}
