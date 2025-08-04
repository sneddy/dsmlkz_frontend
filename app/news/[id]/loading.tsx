import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function NewsDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Кнопка назад */}
      <div className="mb-6">
        <Skeleton className="h-10 w-40" />
      </div>

      {/* Основная карточка новости */}
      <Card className="border-2">
        <CardHeader className="bg-gradient-to-r from-[#FFF32A]/5 to-[#00AEC7]/5">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-5 w-48" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {/* Изображение */}
          <Skeleton className="w-full h-96 mb-6 rounded-lg" />

          {/* Контент */}
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
