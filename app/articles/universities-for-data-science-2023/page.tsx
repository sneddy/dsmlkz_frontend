import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { BlobImage } from "@/components/ui/blob-image"
import { MarkdownContent } from "@/components/markdown-content"
import { loadMarkdownFile } from "../utils/markdown-loader"

export default async function UniversitiesArticlePage() {
  // Load markdown content
  const content = await loadMarkdownFile("universities-for-data-science-2023")

  // Gradient border style
  const gradientBorderStyle = {
    borderWidth: "4px",
    borderStyle: "solid",
    borderImage: "linear-gradient(to right, #FFF32A, #00AEC7) 1",
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
            src="https://swfxusemimczhhhfzjhc.supabase.co/storage/v1/object/public/articles//photo_2023-07-02_20-08-38.jpg"
            alt="Университеты Казахстана"
            width={800}
            height={450}
            className="w-full h-auto rounded-lg"
          />
        </div>

        <MarkdownContent content={content} />
      </article>
    </div>
  )
}
