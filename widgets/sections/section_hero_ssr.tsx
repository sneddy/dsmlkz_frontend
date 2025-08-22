"use client"

import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"

type SectionHeroSSRProps = {
  titleKey: string
  subtitleLine1Key?: string
  subtitleLine2Key?: string
  badgeKeys?: string[]
  className?: string
}

function getNestedTranslation(translations: Record<string, any>, key: string): string {
  const keys = key.split(".")
  let result = translations

  for (const k of keys) {
    if (result && typeof result === "object" && k in result) {
      result = result[k]
    } else {
      return key // Return key if translation not found
    }
  }

  return typeof result === "string" ? result : key
}

export function SectionHeroSSR({
  titleKey,
  subtitleLine1Key,
  subtitleLine2Key,
  badgeKeys = [],
  className = "",
}: SectionHeroSSRProps) {
  const { translations } = useLanguage()

  const t = (key: string) => getNestedTranslation(translations, key)

  return (
    <div
      className={cn(
        "relative overflow-hidden py-16 px-4 bg-gradient-to-br from-slate-900 via-black to-slate-800",
        className,
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#00AEC7]/20 via-slate-900/80 to-[#FFF32A]/20"></div>
      <div className="relative max-w-7xl mx-auto text-center z-10">
        <h1 className="text-4xl md:text-6xl font-pixel font-bold mb-6 tracking-tight leading-tight">
          <span className="bg-gradient-to-r from-[#FFF32A] via-[#00AEC7] to-[#FFF32A] bg-clip-text text-transparent drop-shadow-lg">
            {t(titleKey)}
          </span>
        </h1>

        {(subtitleLine1Key || subtitleLine2Key) && (
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8 font-medium">
            {subtitleLine1Key && t(subtitleLine1Key)}
            {subtitleLine2Key && (
              <>
                <br />
                <span className="font-semibold">{t(subtitleLine2Key)}</span>
              </>
            )}
          </p>
        )}

        {badgeKeys.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {badgeKeys.map((badgeKey, i) => (
              <span
                key={i}
                className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-full text-white font-medium border border-white/20 hover:bg-white/20 transition-all duration-300 shadow-lg"
              >
                {t(badgeKey)}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
