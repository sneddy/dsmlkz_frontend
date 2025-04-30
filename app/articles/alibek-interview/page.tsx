"use client"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ImageCarousel } from "@/components/image-carousel"

export default function AlibeksInterviewPage() {
  const router = useRouter()

  // Градиентная рамка
  const gradientBorderStyle = {
    borderWidth: "4px",
    borderStyle: "solid",
    borderImage: "linear-gradient(to right, #FFF32A, #00AEC7) 1",
  }

  // Подготовка массива изображений для карусели
  const totalImages = 15
  const baseImageUrl = "https://swfxusemimczhhhfzjhc.supabase.co/storage/v1/object/public/articles/alibek_article/"

  const carouselImages = Array.from({ length: totalImages }).map((_, index) => ({
    src: `${baseImageUrl}${index}.png`,
    alt: `Интервью с Алибеком Утюбаевым, страница ${index + 1}`,
    caption: `Страница ${index + 1} из ${totalImages}`,
  }))

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Link href="/articles" className="inline-flex items-center text-[#00AEC7] hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад к статьям
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-[#00AEC7] text-center">
          Интервью с Алибеком Утюбаевым, лидом аналитики в Arbuz.kz
        </h1>

        {/* Информация об интервью - перед изображениями */}
        <div className="mb-8 p-6 rounded-lg bg-black/5" style={gradientBorderStyle}>
          <h2 className="text-xl font-bold mb-4 text-[#00AEC7]">Об интервью</h2>
          <p className="mb-4">
            Мы обсудили с Алибеком его путь в сфере, видение развития анализа данных в Казахстане, рекомендации для
            начинающих и многое другое. А также попытались узнать, кто же такой Алибек Утюбаев вне аналитики данных: кем
            хотел стать в детстве, что читает, кем гордится и с кем себя ассоциирует.
          </p>
          <p>
            Интервью было проведено командой DSML Kazakhstan в рамках серии интервью с ведущими специалистами в области
            анализа данных и машинного обучения в Казахстане.
          </p>
        </div>

        {/* Карусель изображений */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#00AEC7]">Интервью</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
              <span>Листайте для просмотра</span>
              <ArrowLeft className="h-4 w-4" />
              <ArrowLeft className="h-4 w-4 transform rotate-180" />
            </div>
          </div>
          <ImageCarousel images={carouselImages} borderStyle={gradientBorderStyle} />
        </div>
      </div>
    </div>
  )
}
