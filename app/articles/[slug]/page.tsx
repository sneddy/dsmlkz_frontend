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
      <div className="container py-8">
        <div className="mb-6">
          <Link href="/articles" className="inline-flex items-center text-[#00AEC7] hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад к статьям
          </Link>
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4 text-[#00AEC7]">{metadata.title}</h1>
          <p className="text-muted-foreground mb-8">Эта статья скоро будет доступна. Пожалуйста, проверьте позже.</p>
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
    <div className="container py-8">
      <div className="mb-6">
        <Link href="/articles" className="inline-flex items-center text-[#00AEC7] hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад к статьям
        </Link>
      </div>

      <article className="max-w-3xl mx-auto">
        <div className="mb-8">
          <BlobImage
            src={metadata.imageUrl}
            alt={metadata.title}
            width={800}
            height={450}
            className="w-full h-auto rounded-lg"
            style={gradientBorderStyle}
          />
        </div>

        <h1 className="text-3xl font-bold mb-4 text-[#00AEC7]">{metadata.title}</h1>

        {metadata.date && (
          <div className="flex items-center text-sm text-muted-foreground mb-6">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{metadata.date}</span>
          </div>
        )}

        <MarkdownContent content={content} />
      </article>
    </div>
  )
}
