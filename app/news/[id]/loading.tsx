import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function NewsDetailLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Кнопка назад */}
        <div className="mb-6">
          <Skeleton className="h-10 w-40 bg-gray-700" />
        </div>

        {/* Основная карточка новости */}
        <Card className="border-2 bg-gray-800/50 border-gray-700">
          <div className="h-1 bg-gradient-to-r from-gray-600 to-gray-500"></div>

          <CardHeader className="bg-gradient-to-r from-gray-700/20 to-gray-600/10">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <Skeleton className="h-8 w-64 mb-2 bg-gray-600" />
                <Skeleton className="h-5 w-48 bg-gray-600" />
              </div>
              <Skeleton className="h-10 w-32 bg-gray-600" />
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {/* Изображение */}
            <Skeleton className="w-full h-96 mb-6 rounded-lg bg-gray-600" />

            {/* Контент */}
            <div className="space-y-4">
              <Skeleton className="h-4 w-full bg-gray-600" />
              <Skeleton className="h-4 w-full bg-gray-600" />
              <Skeleton className="h-4 w-3/4 bg-gray-600" />
              <Skeleton className="h-4 w-full bg-gray-600" />
              <Skeleton className="h-4 w-5/6 bg-gray-600" />
              <Skeleton className="h-4 w-full bg-gray-600" />
              <Skeleton className="h-4 w-2/3 bg-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
