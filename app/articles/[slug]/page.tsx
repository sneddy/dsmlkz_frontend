import { ArrowLeft, Calendar } from "lucide-react"
import Link from "next/link"
import { BlobImage } from "@/components/ui/blob-image"
import { MarkdownContent } from "@/components/markdown-content"
import { loadMarkdownFile } from "../utils/markdown-loader"
import { notFound } from "next/navigation"
import { getArticleMetadata } from "../utils/articles-metadata"

// Gradient border style
const gradientBorderStyle = {
  borderWidth: "4px",
  borderStyle: "solid",
  borderImage: "linear-gradient(to right, #FFF32A, #00AEC7) 1",
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const { slug } = params

  // Get article metadata
  const metadata = getArticleMetadata(slug)

  if (!metadata) {
    return notFound()
  }

  // Check if this article has a custom page
  if (metadata.hasCustomPage && !metadata.isMarkdownBased) {
    return notFound()
  }

  // If it's not markdown-based and doesn't have a custom page, it's not available yet
  if (!metadata.isMarkdownBased) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="container py-4 sm:py-6 md:py-8 px-2 sm:px-4">
          <div className="mb-4 sm:mb-6">
            <Link
              href="/articles"
              className="inline-flex items-center text-[#00AEC7] hover:text-[#00AEC7]/80 transition-colors text-sm sm:text-base"
            >
              <ArrowLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              Назад к статьям
            </Link>
          </div>

          <div className="max-w-3xl mx-auto text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FFF32A]/10 to-[#00AEC7]/10 rounded-2xl blur-3xl"></div>
              <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 sm:p-8 md:p-12">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 sm:w-24 md:w-32 h-1 bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] rounded-full"></div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-[#00AEC7] px-2 leading-tight">
                  {metadata.title}
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-2 leading-relaxed">
                  Эта статья скоро будет доступна. Пожалуйста, проверьте позже.
                </p>
                <Link href="/articles">
                  <button className="bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] hover:from-[#FFF32A]/90 hover:to-[#00AEC7]/90 text-black font-medium px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-all duration-300 text-sm sm:text-base w-full sm:w-auto">
                    Вернуться к статьям
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Load markdown content
  const content = await loadMarkdownFile(slug)

  if (!content) {
    return notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container py-4 sm:py-6 md:py-8 px-2 sm:px-4">
        <div className="mb-4 sm:mb-6">
          <Link
            href="/articles"
            className="inline-flex items-center text-[#00AEC7] hover:text-[#00AEC7]/80 transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            Назад к статьям
          </Link>
        </div>

        <article className="max-w-4xl mx-auto">
          {/* Article Header */}
          <div className="relative mb-8 sm:mb-10 md:mb-12">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFF32A]/5 to-[#00AEC7]/5 rounded-2xl blur-2xl"></div>
            <div className="relative bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FFF32A] to-[#00AEC7]"></div>

              <div className="p-4 sm:p-6 md:p-8">
                <BlobImage
                  src={metadata.imageUrl}
                  alt={metadata.title}
                  width={800}
                  height={450}
                  className="w-full h-auto rounded-lg mb-4 sm:mb-5 md:mb-6 max-h-[200px] sm:max-h-[300px] md:max-h-[450px] object-cover"
                  style={gradientBorderStyle}
                />

                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-[#00AEC7] px-1 leading-tight">
                  {metadata.title}
                </h1>

                {metadata.date && (
                  <div className="flex items-center text-xs sm:text-sm text-gray-400 mb-4 sm:mb-6 px-1">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span>{metadata.date}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFF32A]/5 to-[#00AEC7]/5 rounded-2xl blur-2xl"></div>
            <div className="relative bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-4 sm:p-6 md:p-8">
              <MarkdownContent content={content} />
            </div>
          </div>

          {/* Back to Articles */}
          <div className="mt-8 sm:mt-10 md:mt-12 text-center">
            <Link href="/articles">
              <button className="bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] hover:from-[#FFF32A]/90 hover:to-[#00AEC7]/90 text-black font-medium px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-lg transition-all duration-300 transform hover:scale-105 text-sm sm:text-base w-full sm:w-auto">
                Вернуться к статьям
              </button>
            </Link>
          </div>
        </article>
      </div>
    </div>
  )
}
