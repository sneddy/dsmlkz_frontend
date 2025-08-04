import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ArrowRight, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Article {
  id: string
  title: string
  excerpt: string
  date: string
  readTime: string
  category: string
  image: string
  featured?: boolean
}

interface ArticleCardProps {
  article: Article
  featured?: boolean
}

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  return (
    <Card
      className={`group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border-slate-700/50 hover:border-[#00AEC7]/50 shadow-xl hover:shadow-2xl overflow-hidden ${
        featured ? "lg:col-span-1" : ""
      }`}
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <Image
          src={article.image || "/placeholder.svg"}
          alt={article.title}
          width={500}
          height={featured ? 300 : 250}
          className={`w-full object-cover transition-transform duration-300 group-hover:scale-110 ${
            featured ? "h-[200px] sm:h-[250px] md:h-[300px]" : "h-[150px] sm:h-[200px]"
          }`}
        />
        {featured && (
          <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
            <Badge className="bg-[#FFF32A] text-black font-semibold text-xs sm:text-sm">
              <Star className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          </div>
        )}
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
          <Badge variant="secondary" className="bg-black/50 text-white border-none text-xs sm:text-sm">
            {article.category}
          </Badge>
        </div>
      </div>

      <CardHeader className="p-3 sm:p-4 md:p-6">
        <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
            {new Date(article.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
            {article.readTime}
          </div>
        </div>

        <CardTitle
          className={`font-pixel text-[#00AEC7] group-hover:text-[#00AEC7]/80 transition-colors leading-tight ${
            featured ? "text-base sm:text-lg md:text-xl lg:text-2xl" : "text-sm sm:text-base md:text-lg"
          }`}
        >
          {article.title}
        </CardTitle>

        <CardDescription
          className={`text-gray-400 leading-relaxed ${
            featured ? "text-xs sm:text-sm md:text-base" : "text-xs sm:text-sm"
          }`}
        >
          {article.excerpt}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
        <Link href={`/articles/${article.id}`}>
          <Button
            variant="ghost"
            className={`w-full justify-between text-[#00AEC7] hover:text-[#FFF32A] hover:bg-[#00AEC7]/10 transition-all duration-300 group/btn ${
              featured ? "text-xs sm:text-sm md:text-base" : "text-xs sm:text-sm"
            }`}
          >
            Read Article
            <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
