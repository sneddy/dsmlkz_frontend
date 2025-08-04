import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, FileX } from "lucide-react"

export default function NewsNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="text-center border-2 bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <div className="h-1 bg-gradient-to-r from-[#FFF32A] via-[#00AEC7] to-[#FFF32A]"></div>

          <CardHeader className="bg-gradient-to-r from-gray-700/20 to-gray-600/10">
            <div className="flex justify-center mb-4">
              <FileX className="h-16 w-16 text-[#00AEC7]" />
            </div>
            <CardTitle className="text-2xl text-[#FFF32A] font-pixel">Новость не найдена</CardTitle>
          </CardHeader>

          <CardContent className="pt-6">
            <p className="text-gray-300 mb-6">К сожалению, запрашиваемая новость не существует или была удалена.</p>

            <Link href="/news">
              <Button className="bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] hover:from-[#FFF32A]/90 hover:to-[#00AEC7]/90 text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Вернуться к новостям
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
