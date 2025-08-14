import { getNewsList } from "@/entities/news/api"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BlobImage } from "@/shared/ui/blob_image"
import { absoluteUrl } from "@/lib/seo"

export const revalidate = 1800 // ISR 30 minutes

export async function generateMetadata() {
  return {
    title: "News — DSML Kazakhstan",
    description:
      "Latest news and updates from DSML Kazakhstan community. Stay informed about machine learning and AI developments in Central Asia.",
    openGraph: {
      title: "News — DSML Kazakhstan",
      description:
        "Latest news and updates from DSML Kazakhstan community. Stay informed about machine learning and AI developments in Central Asia.",
      type: "website",
      url: absoluteUrl("/news"),
      images: [{ url: absoluteUrl("/images/dsml-logo.png") }],
    },
    twitter: {
      card: "summary_large_image",
      title: "News — DSML Kazakhstan",
      description:
        "Latest news and updates from DSML Kazakhstan community. Stay informed about machine learning and AI developments in Central Asia.",
      images: [absoluteUrl("/images/dsml-logo.png")],
    },
    alternates: {
      canonical: absoluteUrl("/news"),
    },
  }
}

export default async function NewsPage() {
  const newsList = await getNewsList()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#00AEC7] to-[#FFF32A] py-16 px-4">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight font-pixel">News</h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Latest news and updates <br />
            <span className="font-semibold">from DSML Kazakhstan community</span>
          </p>

          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <span className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium border border-white/30">
              Daily updates
            </span>
            <span className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium border border-white/30">
              Latest news
            </span>
          </div>
        </div>
      </div>

      {/* News Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsList.map((item) => (
            <Link key={item.id} href={`/news/${item.id}`}>
              <Card className="h-full border-2 bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:border-[#00AEC7] transition-all duration-300 hover:scale-105 cursor-pointer">
                <div className="h-1 bg-gradient-to-r from-[#FFF32A] via-[#00AEC7] to-[#FFF32A]"></div>

                {item.image && (
                  <div className="relative h-48 overflow-hidden">
                    <BlobImage
                      src={item.image}
                      alt={item.title}
                      width={400}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-[#FFF32A] font-pixel line-clamp-2">{item.title}</CardTitle>
                  {item.date && <p className="text-sm text-[#00AEC7] font-medium">{formatDate(item.date)}</p>}
                </CardHeader>

                <CardContent>
                  {item.excerpt && <p className="text-gray-300 text-sm line-clamp-3 leading-relaxed">{item.excerpt}</p>}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {newsList.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">News not found</p>
          </div>
        )}
      </div>
    </div>
  )
}
