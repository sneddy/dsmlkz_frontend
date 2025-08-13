import { JobsFeed } from "@/widgets/jobs_feed"
import { SectionHero } from "@/widgets/section_hero"

export default function Jobs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <SectionHero
        title="Вакансии в Data Science"
        subtitleLine1="Найдите работу мечты в области машинного обучения"
        gradientFrom="#00AEC7"
        gradientTo="#FFF32A"
      />

      {/* Jobs Feed */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <JobsFeed channelIds={[-1001120572276, -1001944996511]} />
      </div>

      {/* Call to Action Section */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-t border-gray-700 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-4 font-pixel">Разместить вакансию</h2>
          <p className="text-xl text-gray-300 mb-2">Найдите лучших специалистов в области Data Science</p>
          <p className="text-gray-400 mb-8">Разместите вакансию в нашем сообществе из 10,000+ участников</p>
          <a
            href="mailto:contact@dsml.kz"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] text-gray-900 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            Связаться для размещения
          </a>
        </div>
      </div>
    </div>
  )
}
