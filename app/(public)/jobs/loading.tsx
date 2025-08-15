import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function JobsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero skeleton */}
      <div className="text-center mb-12">
        <div className="h-12 bg-gray-700 rounded-lg w-64 mx-auto mb-4 animate-pulse" />
        <div className="h-6 bg-gray-700 rounded w-96 mx-auto mb-2 animate-pulse" />
        <div className="h-4 bg-gray-700 rounded w-80 mx-auto animate-pulse" />
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <div className="text-center">
              <div className="h-8 bg-gray-700 rounded w-16 mx-auto mb-2 animate-pulse" />
              <div className="h-4 bg-gray-700 rounded w-20 mx-auto animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* Search skeleton */}
      <div className="max-w-md mx-auto mb-8">
        <div className="h-12 bg-gray-700 rounded-xl animate-pulse" />
      </div>

      {/* Jobs grid skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(9)].map((_, i) => (
          <Card key={i} className="h-[56rem] bg-gray-800/50 border-gray-700 animate-pulse">
            <div className="h-1 bg-gray-600" />
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-700 rounded w-24" />
                <div className="h-6 bg-gray-700 rounded w-16" />
              </div>
            </CardHeader>
            <CardContent className="pt-4 pb-6 flex-1 flex flex-col space-y-2">
              <div className="aspect-square bg-gray-700 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-700 rounded w-full" />
                <div className="h-4 bg-gray-700 rounded w-5/6" />
                <div className="h-4 bg-gray-700 rounded w-4/6" />
                <div className="h-4 bg-gray-700 rounded w-full" />
                <div className="h-4 bg-gray-700 rounded w-3/4" />
              </div>
              <div className="flex justify-between items-center pt-2">
                <div className="h-10 bg-gray-700 rounded-xl w-24" />
                <div className="h-10 bg-gray-700 rounded-xl w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
