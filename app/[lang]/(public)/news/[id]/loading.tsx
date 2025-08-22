import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function NewsDetailLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container py-8">
        <div className="mb-6">
          <Skeleton className="h-6 w-32 bg-gray-700" />
        </div>

        <article className="max-w-4xl mx-auto">
          <Card className="bg-gray-800/30 backdrop-blur-sm border border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-6 w-24 bg-gray-700" />
                  <Skeleton className="h-6 w-32 bg-gray-700" />
                </div>
                <Skeleton className="h-6 w-32 bg-gray-700" />
              </div>
              <Skeleton className="h-8 w-96 bg-gray-700" />
            </CardHeader>

            <CardContent className="space-y-6">
              <Skeleton className="h-96 w-full bg-gray-700" />
              
              <div className="space-y-4">
                <Skeleton className="h-4 w-full bg-gray-700" />
                <Skeleton className="h-4 w-3/4 bg-gray-700" />
                <Skeleton className="h-4 w-5/6 bg-gray-700" />
                <Skeleton className="h-4 w-2/3 bg-gray-700" />
                <Skeleton className="h-4 w-full bg-gray-700" />
              </div>

              <div className="pt-4 border-t border-gray-700">
                <Skeleton className="h-10 w-48 bg-gray-700" />
              </div>
            </CardContent>
          </Card>
        </article>
      </div>
    </div>
  )
}
