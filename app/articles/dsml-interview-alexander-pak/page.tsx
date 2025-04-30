import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { BlobImage } from "@/components/ui/blob-image"
import { MarkdownContent } from "@/components/markdown-content"
import { loadMarkdownFile } from "../utils/markdown-loader"

export default async function AlexanderPakInterviewPage() {
  // Load markdown content
  const content = await loadMarkdownFile("dsml-interview-alexander-pak")

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
            src="https://swfxusemimczhhhfzjhc.supabase.co/storage/v1/object/public/articles//photo_2023-03-09_16-16-12.jpg"
            alt="Александр Пак"
            width={800}
            height={450}
            className="w-full h-auto rounded-lg"
            style={gradientBorderStyle}
          />
        </div>

        <MarkdownContent content={content} />
      </article>
    </div>
  )
}
