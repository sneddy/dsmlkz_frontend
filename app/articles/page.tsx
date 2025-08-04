import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, BookOpen, TrendingUp, Users } from "lucide-react"
import Link from "next/link"
import { ArticleCard } from "@/components/article-card"

// Mock data for articles
const featuredArticles = [
  {
    id: "alibek-interview",
    title: "Interview with Alibek Datbayev: Journey in Data Science",
    excerpt:
      "Exclusive interview with one of Kazakhstan's leading data scientists about his career path and insights into the industry.",
    date: "2024-01-15",
    readTime: "8 min read",
    category: "Interview",
    image: "/placeholder.svg?height=300&width=500",
    featured: true,
  },
  {
    id: "universities-for-data-science-2023",
    title: "Best Universities for Data Science in Kazakhstan 2023",
    excerpt: "Comprehensive guide to the top universities offering data science programs in Kazakhstan.",
    date: "2024-01-10",
    readTime: "12 min read",
    category: "Education",
    image: "/placeholder.svg?height=300&width=500",
    featured: true,
  },
  {
    id: "dsml-interview-alexander-pak",
    title: "Alexander Pak: Building AI Solutions in Central Asia",
    excerpt: "Deep dive into the challenges and opportunities of developing AI solutions in the Central Asian market.",
    date: "2024-01-05",
    readTime: "10 min read",
    category: "Interview",
    image: "/placeholder.svg?height=300&width=500",
    featured: true,
  },
]

const recentArticles = [
  {
    id: "shad-review-sultan-nurmukhamedov",
    title: "Sultan Nurmukhamedov's Review of Shad Academy",
    excerpt: "First-hand experience and insights from studying at one of the most prestigious tech academies.",
    date: "2023-12-20",
    readTime: "6 min read",
    category: "Review",
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "anuar-aimoldin-ods-ml-competitions-award-2019",
    title: "Anuar Aimoldin Wins ODS ML Competition Award 2019",
    excerpt: "Celebrating the achievement of Kazakhstani data scientist in international machine learning competition.",
    date: "2023-12-15",
    readTime: "4 min read",
    category: "Achievement",
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "best-technical-university-research-2022",
    title: "Best Technical Universities for Research in Kazakhstan 2022",
    excerpt: "Analysis of research opportunities and facilities at top technical universities in Kazakhstan.",
    date: "2023-12-10",
    readTime: "9 min read",
    category: "Research",
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "best-company-for-data-specialists-2022",
    title: "Best Companies for Data Specialists in Kazakhstan 2022",
    excerpt: "Comprehensive review of top companies offering excellent opportunities for data professionals.",
    date: "2023-12-05",
    readTime: "11 min read",
    category: "Career",
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "ai-olympiad-qualification-results",
    title: "AI Olympiad Qualification Results Announced",
    excerpt: "Results and highlights from the national AI olympiad qualification rounds.",
    date: "2023-11-30",
    readTime: "5 min read",
    category: "Competition",
    image: "/placeholder.svg?height=200&width=400",
  },
]

const categories = [
  { name: "All", count: 8, active: true },
  { name: "Interview", count: 2, active: false },
  { name: "Education", count: 2, active: false },
  { name: "Career", count: 2, active: false },
  { name: "Research", count: 1, active: false },
  { name: "Achievement", count: 1, active: false },
]

export default function ArticlesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-800">
      {/* Hero Section */}
      <section className="relative py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00AEC7]/10 to-[#FFF32A]/10"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 tracking-tight font-pixel">
            <span className="bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] bg-clip-text text-transparent">
              Knowledge Hub
            </span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8 px-2">
            Discover insights, interviews, and stories from Kazakhstan's thriving data science and AI community
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12">
            <div className="text-center">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-[#00AEC7] mb-1">8+</div>
              <div className="text-xs sm:text-sm text-gray-400">Articles</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-[#FFF32A] mb-1">5</div>
              <div className="text-xs sm:text-sm text-gray-400">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-purple-400 mb-1">1000+</div>
              <div className="text-xs sm:text-sm text-gray-400">Readers</div>
            </div>
          </div>

          <Link href="#featured">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-[#00AEC7] to-[#00AEC7]/80 text-white hover:from-[#00AEC7]/90 hover:to-[#00AEC7]/70 font-semibold px-6 sm:px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group text-sm sm:text-base"
            >
              <BookOpen className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              Explore Articles
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-6 sm:py-8 container px-4 sm:px-6">
        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
          {categories.map((category) => (
            <Badge
              key={category.name}
              variant={category.active ? "default" : "secondary"}
              className={`cursor-pointer transition-all duration-300 text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2 ${
                category.active
                  ? "bg-[#00AEC7] text-white hover:bg-[#00AEC7]/90"
                  : "bg-slate-800/50 text-gray-300 hover:bg-slate-700/50 border-slate-600"
              }`}
            >
              {category.name} ({category.count})
            </Badge>
          ))}
        </div>
      </section>

      {/* Featured Articles */}
      <section id="featured" className="py-8 sm:py-12 md:py-16 container px-4 sm:px-6">
        <div className="mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 font-pixel">
            <span className="bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] bg-clip-text text-transparent">
              Featured Articles
            </span>
          </h2>
          <p className="text-sm sm:text-base text-gray-400 max-w-2xl">
            Hand-picked stories and insights from our community leaders and experts
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {featuredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} featured />
          ))}
        </div>
      </section>

      {/* Recent Articles */}
      <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-r from-slate-800/30 to-slate-900/30 backdrop-blur-sm">
        <div className="container px-4 sm:px-6">
          <div className="mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 font-pixel">
              <span className="bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] bg-clip-text text-transparent">
                Recent Articles
              </span>
            </h2>
            <p className="text-sm sm:text-base text-gray-400 max-w-2xl">
              Stay updated with the latest content from our community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {recentArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-r from-[#00AEC7]/10 via-transparent to-[#FFF32A]/10">
        <div className="container px-4 sm:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 font-pixel text-white">
              Stay Updated with Our Latest Articles
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-6 sm:mb-8 px-2">
              Join our community to receive notifications about new articles, interviews, and insights from Kazakhstan's
              data science ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-[#FFF32A] to-[#FFF32A]/80 text-black hover:from-[#FFF32A]/90 hover:to-[#FFF32A]/70 font-semibold px-6 sm:px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group text-sm sm:text-base"
                >
                  <Users className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  Join Community
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="https://t.me/dsmlkz_news" target="_blank" rel="noopener noreferrer">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-6 sm:px-8 py-3 rounded-full transition-all duration-300 bg-transparent text-sm sm:text-base"
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Follow News
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
