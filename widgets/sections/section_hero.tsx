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
  return (
    <div
      className={cn("relative overflow-hidden py-16 px-4", className)}
      style={{
        backgroundImage: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
      }}
    >
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight font-pixel">{title}</h1>

        {(subtitleLine1 || subtitleLine2) && (
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
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
