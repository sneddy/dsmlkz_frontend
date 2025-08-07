import { Skeleton } from "@/components/ui/skeleton"

export default function ResearchLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero Section Skeleton */}
      <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-24">
        <div className="container mx-auto px-4 text-center">
          <Skeleton className="h-12 w-96 mx-auto mb-4" />
          <Skeleton className="h-6 w-80 mx-auto mb-6" />
          <Skeleton className="h-4 w-full max-w-2xl mx-auto mb-2" />
          <Skeleton className="h-4 w-3/4 max-w-xl mx-auto" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 space-y-16">
        {/* Researchers Section Skeleton */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <Skeleton className="h-10 w-80 mx-auto" />
            <Skeleton className="h-4 w-full max-w-3xl mx-auto mb-2" />
            <Skeleton className="h-4 w-2/3 max-w-2xl mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="border rounded-lg p-6 space-y-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="border rounded-lg p-6 space-y-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </section>

        {/* Seminars Section Skeleton */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <Skeleton className="h-10 w-72 mx-auto" />
            <Skeleton className="h-4 w-full max-w-3xl mx-auto mb-2" />
            <Skeleton className="h-4 w-2/3 max-w-2xl mx-auto" />
          </div>
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="border rounded-lg p-6 space-y-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="aspect-video w-full" />
            </div>
            <div className="border rounded-lg p-6 space-y-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-full" />
              <div className="space-y-4">
                <div className="p-4 border rounded-lg space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-full" />
                </div>
                <div className="p-4 border rounded-lg space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Publications Section Skeleton */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <Skeleton className="h-10 w-80 mx-auto" />
            <Skeleton className="h-4 w-full max-w-3xl mx-auto mb-2" />
            <Skeleton className="h-4 w-2/3 max-w-2xl mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg p-6 space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
