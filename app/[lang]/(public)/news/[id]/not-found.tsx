import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, AlertCircle } from "lucide-react"

export default function NewsNotFound({ params }: { params: { lang: string } }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container py-8">
        <div className="mb-6">
          <Link
            href={`/${params.lang}/news`}
            className="inline-flex items-center text-[#00AEC7] hover:text-[#00AEC7]/80 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад к новостям
          </Link>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <AlertCircle className="h-16 w-16 text-[#FFF32A]" />
              </div>
              <CardTitle className="text-2xl text-[#00AEC7]">
                Новость не найдена
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-6">
                Новость, которую вы ищете, не существует или была удалена.
              </p>
              <Button asChild className="bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] hover:from-[#FFF32A]/90 hover:to-[#00AEC7]/90 text-black">
                <Link href={`/${params.lang}/news`}>
                  Вернуться к новостям
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
