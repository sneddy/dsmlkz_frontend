import { notFound } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowLeft, Share2, BookOpen, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { MarkdownContent } from "@/components/markdown-content"

// Mock data for articles
const articles = {
  "alibek-interview": {
    id: "alibek-interview",
    title: "Interview with Alibek Datbayev: Journey in Data Science",
    excerpt:
      "Exclusive interview with one of Kazakhstan's leading data scientists about his career path and insights into the industry.",
    content: `# Interview with Alibek Datbayev: Journey in Data Science

*An exclusive conversation with one of Kazakhstan's most prominent data scientists about his career journey, challenges, and vision for the future of AI in Central Asia.*

## Background

Alibek Datbayev has been at the forefront of Kazakhstan's data science revolution for over a decade. With a background in mathematics and computer science, he has worked with leading tech companies and has been instrumental in building the local data science community.

## The Journey Begins

**DSML KZ**: Tell us about your journey into data science. What sparked your interest?

**Alibek**: My journey started during my university years when I was studying mathematics. I was fascinated by the power of statistical analysis and how it could reveal hidden patterns in data. This was back in 2010, when data science wasn't even a well-defined field yet.

## Challenges in Kazakhstan

**DSML KZ**: What were the main challenges you faced building a career in data science in Kazakhstan?

**Alibek**: The biggest challenge was the lack of local expertise and resources. We had to learn everything from scratch, mostly from international sources. There were no local communities, no mentors, and very few companies that understood the value of data science.

## Building the Community

**DSML KZ**: How did you contribute to building the data science community in Kazakhstan?

**Alibek**: I started by organizing small meetups and workshops. We began with just 5-10 people, but gradually grew to hundreds. The key was creating a space where people could learn, share experiences, and collaborate on projects.

## Advice for Newcomers

**DSML KZ**: What advice would you give to someone starting their data science journey today?

**Alibek**: Start with the fundamentals - statistics, programming, and domain knowledge. Don't rush into complex algorithms without understanding the basics. Also, join communities like DSML KZ, participate in competitions, and work on real projects.

## The Future

**DSML KZ**: What's your vision for the future of AI and data science in Central Asia?

**Alibek**: I see tremendous potential. We have talented people, growing tech infrastructure, and increasing awareness among businesses. I believe Central Asia can become a significant player in the global AI landscape within the next decade.

## Conclusion

Alibek's journey exemplifies the spirit of innovation and community building that defines Kazakhstan's data science ecosystem. His contributions continue to inspire the next generation of data scientists in the region.`,
    date: "2024-01-15",
    readTime: "8 min read",
    category: "Interview",
    author: "DSML KZ Team",
    image: "/placeholder.svg?height=400&width=800",
    tags: ["Interview", "Career", "Data Science", "Kazakhstan"],
  },
  "universities-for-data-science-2023": {
    id: "universities-for-data-science-2023",
    title: "Best Universities for Data Science in Kazakhstan 2023",
    excerpt: "Comprehensive guide to the top universities offering data science programs in Kazakhstan.",
    content: `# Best Universities for Data Science in Kazakhstan 2023

*A comprehensive analysis of the leading educational institutions offering data science and related programs in Kazakhstan.*

## Introduction

As the demand for data science professionals continues to grow in Kazakhstan, choosing the right educational path becomes crucial. This guide examines the top universities offering quality data science education in the country.

## Ranking Methodology

Our ranking is based on several key factors:
- Curriculum quality and relevance
- Faculty expertise and research output
- Industry partnerships and internship opportunities
- Graduate employment rates
- Infrastructure and resources

## Top Universities

### 1. Nazarbayev University
**Location**: Nur-Sultan
**Programs**: MSc in Data Science, Computer Science with Data Science track
**Highlights**: 
- International faculty
- Strong research focus
- Modern facilities
- Industry partnerships

### 2. Al-Farabi Kazakh National University
**Location**: Almaty
**Programs**: Applied Mathematics, Computer Science, Information Systems
**Highlights**:
- Established reputation
- Large alumni network
- Research opportunities
- Affordable tuition

### 3. Kazakh-British Technical University
**Location**: Almaty
**Programs**: Computer Science, Information Technology
**Highlights**:
- British curriculum standards
- Industry connections
- Modern labs
- English instruction

### 4. Satbayev University
**Location**: Almaty
**Programs**: Information Systems, Computer Engineering
**Highlights**:
- Technical focus
- Industry partnerships
- Research projects
- Strong engineering foundation

### 5. KIMEP University
**Location**: Almaty
**Programs**: Computer Information Systems, Business Analytics
**Highlights**:
- Business-oriented approach
- International accreditation
- Small class sizes
- Career services

## Program Comparison

| University | Duration | Language | Tuition (USD) | Research Focus |
|------------|----------|----------|---------------|----------------|
| Nazarbayev | 2 years | English | $8,000/year | High |
| Al-Farabi | 2 years | Kazakh/Russian | $2,000/year | Medium |
| KBTU | 4 years | English | $6,000/year | Medium |
| Satbayev | 4 years | Kazakh/Russian | $3,000/year | High |
| KIMEP | 4 years | English | $7,000/year | Low |

## Admission Requirements

Most programs require:
- Strong mathematics background
- Programming experience (preferred)
- English proficiency (for English-taught programs)
- Entrance exams or standardized test scores

## Career Prospects

Graduates from these programs typically find employment in:
- Tech companies
- Financial institutions
- Government agencies
- Consulting firms
- Research organizations

## Conclusion

Kazakhstan offers several excellent options for data science education. The choice depends on your language preference, budget, and career goals. Consider visiting campuses and talking to current students and alumni before making your decision.`,
    date: "2024-01-10",
    readTime: "12 min read",
    category: "Education",
    author: "Education Team",
    image: "/placeholder.svg?height=400&width=800",
    tags: ["Education", "Universities", "Data Science", "Kazakhstan", "Career"],
  },
}

interface ArticlePageProps {
  params: {
    slug: string
  }
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const article = articles[params.slug as keyof typeof articles]

  if (!article) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-800">
      {/* Navigation */}
      <nav className="py-4 sm:py-6 px-4 sm:px-6 border-b border-slate-800/50">
        <div className="container max-w-4xl mx-auto">
          <Link
            href="/articles"
            className="inline-flex items-center text-[#00AEC7] hover:text-[#FFF32A] transition-colors group text-sm sm:text-base"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Articles
          </Link>
        </div>
      </nav>

      {/* Article Header */}
      <header className="py-8 sm:py-12 md:py-16 px-4 sm:px-6">
        <div className="container max-w-4xl mx-auto">
          <div className="mb-4 sm:mb-6">
            <Badge className="bg-[#00AEC7]/20 text-[#00AEC7] border-[#00AEC7]/30 mb-3 sm:mb-4 text-xs sm:text-sm">
              {article.category}
            </Badge>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 font-pixel leading-tight">
              <span className="bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] bg-clip-text text-transparent">
                {article.title}
              </span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed mb-6 sm:mb-8">
              {article.excerpt}
            </p>
          </div>

          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-400 mb-6 sm:mb-8">
            <div className="flex items-center gap-1 sm:gap-2">
              <User className="h-3 w-3 sm:h-4 sm:w-4" />
              {article.author}
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
              {new Date(article.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
              {article.readTime}
            </div>
          </div>

          {/* Article Image */}
          <div className="relative overflow-hidden rounded-xl sm:rounded-2xl mb-8 sm:mb-12">
            <Image
              src={article.image || "/placeholder.svg"}
              alt={article.title}
              width={800}
              height={400}
              className="w-full h-[200px] sm:h-[300px] md:h-[450px] object-cover"
              priority
            />
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8 sm:mb-12">
            {article.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-slate-800/50 text-gray-300 border-slate-600 text-xs sm:text-sm"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </header>

      {/* Article Content */}
      <main className="pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6">
        <div className="container max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm border-slate-700/50 shadow-xl">
            <CardContent className="p-4 sm:p-6 md:p-8">
              <div className="prose prose-invert prose-sm sm:prose-base lg:prose-lg max-w-none">
                <MarkdownContent content={article.content} />
              </div>
            </CardContent>
          </Card>

          {/* Article Actions */}
          <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-[#00AEC7] to-[#00AEC7]/80 text-white hover:from-[#00AEC7]/90 hover:to-[#00AEC7]/70 font-semibold px-6 sm:px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group text-sm sm:text-base"
            >
              <Share2 className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              Share Article
            </Button>
            <Link href="/articles">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-6 sm:px-8 py-3 rounded-full transition-all duration-300 bg-transparent text-sm sm:text-base"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                More Articles
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
