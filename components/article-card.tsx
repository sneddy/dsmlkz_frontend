"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BlobImage } from "@/components/ui/blob-image"
import { ArrowRight, Calendar } from "lucide-react"
import Link from "next/link"

interface ArticleCardProps {
  id: string
  title?: string
  preview: string
  imageUrl: string
  slug: string
  language?: string
  hasCustomPage?: boolean
  isMarkdownBased?: boolean
  date?: string
}

export function ArticleCard({
  id,
  title,
  preview,
  imageUrl,
  slug,
  language = "ru",
  hasCustomPage = false,
  isMarkdownBased = false,
  date,
}: ArticleCardProps) {
  const [imageError, setImageError] = useState(false)

  // Determine if the article is available
  const isArticleAvailable = hasCustomPage || isMarkdownBased

  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-[#FFF32A]/10 to-[#00AEC7]/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <Card className="relative overflow-hidden w-full flex flex-col md:flex-row bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:bg-gray-800/70 transition-all duration-300">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FFF32A] to-[#00AEC7]"></div>

        <div className="md:w-2/5 lg:w-1/3 p-6 flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFF32A]/20 to-[#00AEC7]/20 rounded-lg blur-sm"></div>
            <BlobImage
              src={imageUrl}
              alt={title || "Статья DSML Kazakhstan"}
              width={600}
              height={400}
              className="relative w-full h-auto object-contain max-h-[300px] rounded-lg"
              onError={() => setImageError(true)}
              fallbackSrc="/placeholder.svg?height=400&width=600"
            />
          </div>
        </div>

        <div className="flex flex-col flex-grow md:w-3/5 lg:w-2/3">
          <CardContent className="flex-grow p-6">
            {title && (
              <h3 className="text-xl md:text-2xl font-bold mb-3 text-[#00AEC7] group-hover:text-[#FFF32A] transition-colors duration-300">
                {title}
              </h3>
            )}

            {date && (
              <div className="flex items-center text-sm text-gray-400 mb-4">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{date}</span>
              </div>
            )}

            <p className="text-sm md:text-base text-gray-300 whitespace-pre-line leading-relaxed">{preview}</p>
          </CardContent>

          <CardFooter className="p-6 pt-0">
            {isArticleAvailable ? (
              <Link href={`/articles/${slug}`} className="w-full md:w-auto">
                <Button className="w-full md:w-auto bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] hover:from-[#FFF32A]/90 hover:to-[#00AEC7]/90 text-black font-medium transition-all duration-300 transform hover:scale-105">
                  Читать полностью
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Button
                className="w-full md:w-auto bg-gray-600/50 hover:bg-gray-600/70 text-gray-300 font-medium cursor-not-allowed border border-gray-600"
                disabled
              >
                Скоро будет доступно
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        </div>
      </Card>
    </div>
  )
}
