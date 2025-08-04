export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container py-8">
        {/* Back Button Skeleton */}
        <div className="mb-6">
          <div className="h-6 w-32 bg-gray-700 rounded animate-pulse"></div>
        </div>

        <article className="max-w-4xl mx-auto">
          {/* Article Header Skeleton */}
          <div className="relative mb-12">
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-gray-600 to-gray-500"></div>

              <div className="p-8">
                <div className="w-full h-64 bg-gray-700 rounded-lg mb-6 animate-pulse"></div>
                <div className="h-10 bg-gray-700 rounded-lg mb-4 animate-pulse"></div>
                <div className="h-6 bg-gray-700 rounded-lg w-48 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Article Content Skeleton */}
          <div className="relative">
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
              <div className="space-y-4">
                <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-700 rounded w-5/6 animate-pulse"></div>
                <div className="h-4 bg-gray-700 rounded w-4/6 animate-pulse"></div>
                <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-700 rounded w-5/6 animate-pulse"></div>
                <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-700 rounded w-2/3 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Back Button Skeleton */}
          <div className="mt-12 text-center">
            <div className="h-12 w-48 bg-gray-700 rounded-lg mx-auto animate-pulse"></div>
          </div>
        </article>
      </div>
    </div>
  )
}
