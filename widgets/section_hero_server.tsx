import { Card, CardContent } from "@/components/ui/card"
import { getServerTranslations } from "@/lib/utils/server-translations"

interface StatCard {
  value: string
  label: string
  color?: string
}

interface SectionHeroServerProps {
  title: string
  subtitle?: string
  highlight?: string
  badges?: string[]
  stats?: StatCard[]
  gradientFrom?: string
  gradientTo?: string
  showDefaultJobStats?: boolean
}

export default async function SectionHeroServer({
  title,
  subtitle,
  highlight,
  badges = [],
  stats,
  gradientFrom = "#00AEC7",
  gradientTo = "#FFF32A",
  showDefaultJobStats = false,
}: SectionHeroServerProps) {
  const { t } = await getServerTranslations()

  const defaultJobStats: StatCard[] = [
    {
      value: "500+",
      label: t("jobs.activeVacancies"),
      color: "text-[#FFF32A]",
    },
    {
      value: "50+",
      label: t("jobs.companies"),
      color: "text-[#00AEC7]",
    },
    {
      value: "24/7",
      label: t("jobs.updates"),
      color: "text-purple-400",
    },
  ]

  const displayStats = showDefaultJobStats ? defaultJobStats : stats

  return (
    <section
      className="relative overflow-hidden py-16 px-4"
      style={{
        background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
      }}
    >
      <div className="absolute inset-0 bg-black/20"></div>

      <div className="relative max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight font-pixel">{title}</h1>

        {(subtitle || highlight) && (
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8">
            {subtitle} {subtitle && highlight && <br />}
            {highlight && <span className="font-semibold">{highlight}</span>}
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

        {displayStats && displayStats.length > 0 && (
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm mt-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                {displayStats.map((stat, i) => (
                  <div key={i}>
                    <div className={`text-3xl font-bold mb-2 ${stat.color || "text-white"}`}>{stat.value}</div>
                    <div className="text-white/80">{stat.label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  )
}
