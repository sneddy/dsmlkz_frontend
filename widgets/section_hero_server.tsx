import { Card, CardContent } from "@/components/ui/card"

export default function SectionHeroServer({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-16 px-4">
      <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-10"></div>

      <div className="relative max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-[#FFF32A] via-[#00AEC7] to-[#FFF32A] bg-clip-text text-transparent mb-6">
          {title}
        </h1>

        <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">{description}</p>

        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-[#FFF32A] mb-2">500+</div>
                <div className="text-gray-400">Активных вакансий</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#00AEC7] mb-2">50+</div>
                <div className="text-gray-400">Компаний</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400 mb-2">24/7</div>
                <div className="text-gray-400">Обновления</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
