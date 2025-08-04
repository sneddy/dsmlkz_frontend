import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, FileX } from "lucide-react"

export default function NewsNotFound() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card
        className="text-center border-2"
        style={{
          borderImage: "linear-gradient(to right, #FFF32A, #00AEC7) 1",
        }}
      >
        <CardHeader className="bg-gradient-to-r from-[#FFF32A]/5 to-[#00AEC7]/5">
          <div className="flex justify-center mb-4">
            <FileX className="h-16 w-16 text-[#00AEC7]" />
          </div>
          <CardTitle className="text-2xl text-[#FFF32A]">Новость не найдена</CardTitle>
        </CardHeader>

        <CardContent className="pt-6">
          <p className="text-[#00AEC7] mb-6">К сожалению, запрашиваемая новость не существует или была удалена.</p>

          <Link href="/news">
            <Button className="bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] hover:from-[#FFF32A]/90 hover:to-[#00AEC7]/90 text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Вернуться к новостям
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
