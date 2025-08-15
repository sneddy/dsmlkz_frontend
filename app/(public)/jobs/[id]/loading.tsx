export default function JobLoading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center space-x-2 text-sm mb-4">
        <div className="h-4 bg-gray-700 rounded w-16 animate-pulse" />
        <span>/</span>
        <div className="h-4 bg-gray-700 rounded w-20 animate-pulse" />
        <span>/</span>
        <div className="h-4 bg-gray-700 rounded w-24 animate-pulse" />
      </div>

      {/* Meta info skeleton */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="h-4 bg-gray-700 rounded w-32 animate-pulse" />
        <div className="h-4 bg-gray-700 rounded w-28 animate-pulse" />
        <div className="h-4 bg-gray-700 rounded w-24 animate-pulse" />
        <div className="h-6 bg-gray-700 rounded-full w-16 animate-pulse" />
      </div>

      {/* Content skeleton */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
        {/* Image skeleton */}
        <div className="aspect-video w-full bg-gray-700 animate-pulse" />

        {/* Text content skeleton */}
        <div className="p-8 space-y-4">
          <div className="h-4 bg-gray-700 rounded w-full animate-pulse" />
          <div className="h-4 bg-gray-700 rounded w-5/6 animate-pulse" />
          <div className="h-4 bg-gray-700 rounded w-4/6 animate-pulse" />
          <div className="h-4 bg-gray-700 rounded w-full animate-pulse" />
          <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse" />
          <div className="h-4 bg-gray-700 rounded w-5/6 animate-pulse" />
          <div className="h-4 bg-gray-700 rounded w-2/3 animate-pulse" />

          {/* Button skeleton */}
          <div className="mt-8 pt-6 border-t border-gray-600/30">
            <div className="h-12 bg-gray-700 rounded-xl w-48 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Back button skeleton */}
      <div className="mt-8 text-center">
        <div className="h-12 bg-gray-700 rounded-xl w-32 mx-auto animate-pulse" />
      </div>
    </div>
  )
}
