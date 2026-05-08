"use client"
import { cn } from "@/lib/utils"

type SectionHeroProps = {
  title: string
  subtitleLine1?: string
  subtitleLine2?: string
  gradientFrom?: string
  gradientTo?: string
  badges?: string[]
  className?: string
}

export function SectionHero({
  title,
  subtitleLine1,
  subtitleLine2,
  gradientFrom = "#00AEC7",
  gradientTo = "#FFF32A",
  badges = [],
  className = "",
}: SectionHeroProps) {
  const useReadableTitleFont = title.length > 14

  return (
    <div
      className={cn("relative overflow-hidden px-4 py-12 sm:py-14 md:py-16", className)}
      style={{
        backgroundImage: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
      }}
    >
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative max-w-7xl mx-auto text-center">
        <h1
          className={cn(
            "mx-auto mb-5 max-w-5xl break-words text-balance text-[clamp(1.9rem,9vw,4.5rem)] font-bold leading-[1.12] text-white [overflow-wrap:break-word] sm:mb-6 md:leading-tight",
            useReadableTitleFont ? "font-sans" : "font-pixel",
          )}
        >
          {title}
        </h1>

        {(subtitleLine1 || subtitleLine2) && (
          <p className="mx-auto max-w-3xl text-balance text-base font-medium leading-relaxed text-white/90 sm:text-lg md:text-2xl">
            {subtitleLine1} <br />
            {subtitleLine2 && <span className="font-semibold">{subtitleLine2}</span>}
          </p>
        )}

        {badges.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {badges.map((badge, i) => (
              <span
                key={i}
                className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium border border-white/30"
              >
                {badge}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
