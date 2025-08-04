export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container py-8">
        {/* Hero Section Skeleton */}
        <div className="relative mb-12">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 text-center">
            <div className="w-32 h-1 bg-gradient-to-r from-gray-600 to-gray-500 rounded-full mx-auto mb-6"></div>
            <div className="h-12 bg-gray-700 rounded-lg mb-4 max-w-md mx-auto animate-pulse"></div>
            <div className="h-6 bg-gray-700 rounded-lg max-w-2xl mx-auto animate-pulse"></div>
          </div>
        </div>

        {/* Articles Skeleton */}
        <div className="space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden">
              <div className="w-full h-1 bg-gradient-to-r from-gray-600 to-gray-500"></div>
              <div className="flex flex-col md:flex-row">
                <div className="md:w-2/5 lg:w-1/3 p-6">
                  <div className="w-full h-48 bg-gray-700 rounded-lg animate-pulse"></div>
                </div>
                <div className="flex-grow p-6">
                  <div className="h-8 bg-gray-700 rounded-lg mb-4 animate-pulse"></div>
                  <div className="h-4 bg-gray-700 rounded-lg mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-700 rounded-lg mb-2 w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-700 rounded-lg mb-6 w-1/2 animate-pulse"></div>
                  <div className="h-10 bg-gray-700 rounded-lg w-40 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
