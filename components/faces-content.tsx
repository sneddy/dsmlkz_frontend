"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/hooks/use-translation"
import { getSupabaseClient } from "@/lib/supabase-client"
import { CommunityFaceCard } from "@/components/community-face-card"

export function FacesContent() {
  const [faces, setFaces] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(9) // Show 3 rows initially (3 columns x 3 rows)
  const { t } = useTranslation()
  const supabase = getSupabaseClient()

  useEffect(() => {
    const fetchCommunityFaces = async () => {
      try {
        setLoading(true)

        // Fetch community faces from the database
        const { data, error } = await supabase
          .from("community_faces")
          .select("*")
          .order("display_order", { ascending: true })
          .order("name", { ascending: true })

        if (error) {
          throw error
        }

        console.log("Fetched community faces:", data)

        // Check if any faces have image_path
        if (data && data.length > 0) {
          console.log("Sample image_path:", data[0].image_path)
        }

        setFaces(data || [])
      } catch (err: any) {
        console.error("Error fetching community faces:", err)
        setError(err.message || "Failed to load community faces")
      } finally {
        setLoading(false)
      }
    }

    fetchCommunityFaces()
  }, [supabase])

  const loadMore = () => {
    // Load 9 more cards (3 more rows)
    setVisibleCount((prev) => prev + 9)
  }

  const visibleFaces = faces.slice(0, visibleCount)
  const hasMore = visibleCount < faces.length

  return (
    <div className="container py-8">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold mb-2 font-pixel text-[#FFF32A]">{t("faces.title")}</h1>
        <p className="text-muted-foreground text-center max-w-2xl mb-6">{t("faces.description")}</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex flex-col items-center gap-4">
                  <Skeleton className="h-40 w-40 rounded-md" />
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-4 w-32 mx-auto" />
                    <Skeleton className="h-3 w-24 mx-auto" />
                    <Skeleton className="h-3 w-40 mx-auto" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{error}</p>
        </div>
      ) : faces.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t("faces.noResults")}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleFaces.map((face) => (
              <CommunityFaceCard key={face.id} face={face} />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-8">
              <Button onClick={loadMore} className="bg-[#00AEC7] hover:bg-[#0095a8] text-white">
                Load More
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
