import { cn } from "@/lib/utils"

type SectionHeroSSRProps = {
  title: string
  subtitleLine1?: string
  subtitleLine2?: string
  badges?: string[]
  className?: string
}

export function SectionHeroSSR({
  title,
  subtitleLine1,
  subtitleLine2,
  badges = [],
  className = "",
}: SectionHeroSSRProps) {
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
            {title}
          </span>
        </h1>

        {(subtitleLine1 || subtitleLine2) && (
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8 font-medium">
            {subtitleLine1}
            {subtitleLine2 && (
              <>
                <br />
                <span className="font-semibold">{subtitleLine2}</span>
              </>
            )}
          </p>
        )}

        {badges.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {badges.map((badge, i) => (
              <span
                key={i}
                className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-full text-white font-medium border border-white/20 hover:bg-white/20 transition-all duration-300 shadow-lg"
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
