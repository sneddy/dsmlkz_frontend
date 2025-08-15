import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function JobNotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <div className="text-6xl font-bold text-[#00AEC7] mb-4">404</div>
        <h1 className="text-2xl font-bold text-white mb-4">Вакансия не найдена</h1>
        <p className="text-gray-400 mb-8">
          Запрашиваемая вакансия не найдена или была удалена. Возможно, она уже неактуальна.
        </p>
        <div className="space-y-4">
          <Link href="/jobs">
            <Button className="w-full bg-[#00AEC7] hover:bg-[#00AEC7]/80">Все вакансии</Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full bg-transparent">
              На главную
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
