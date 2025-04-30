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

  // Фирменная рамка с градиентом
  const gradientBorderStyle = {
    borderWidth: "4px",
    borderStyle: "solid",
    borderImage: "linear-gradient(to right, #FFF32A, #00AEC7) 1",
  }

  return (
    <Card className="overflow-hidden w-full flex flex-col md:flex-row" style={gradientBorderStyle}>
      <div className="md:w-2/5 lg:w-1/3 p-4 flex items-center justify-center">
        <BlobImage
          src={imageUrl}
          alt={title || "Статья DSML Kazakhstan"}
          width={600}
          height={400}
          className="w-full h-auto object-contain max-h-[400px]"
          onError={() => setImageError(true)}
          fallbackSrc="/placeholder.svg?height=400&width=600"
        />
      </div>
      <div className="flex flex-col flex-grow md:w-3/5 lg:w-2/3">
        <CardContent className="flex-grow p-6">
          {title && <h3 className="text-xl font-bold mb-3 text-[#00AEC7]">{title}</h3>}
          {date && (
            <div className="flex items-center text-sm text-muted-foreground mb-3">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{date}</span>
            </div>
          )}
          <p className="text-sm text-white whitespace-pre-line">{preview}</p>
        </CardContent>
        <CardFooter className="p-6 pt-0">
          {isArticleAvailable ? (
            <Link href={`/articles/${slug}`} className="w-full md:w-auto">
              <Button className="w-full md:w-auto bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] hover:from-[#FFF32A]/90 hover:to-[#00AEC7]/90 text-black font-medium">
                Читать полностью
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Button
              className="w-full md:w-auto bg-gradient-to-r from-[#FFF32A]/50 to-[#00AEC7]/50 text-black font-medium cursor-not-allowed opacity-70"
              disabled
            >
              Скоро будет доступно
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </div>
    </Card>
  )
}
