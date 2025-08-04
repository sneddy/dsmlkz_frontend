import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Job Not Found</h1>
        <p className="text-gray-400 mb-8">The job posting you're looking for doesn't exist or has been removed.</p>
        <Link href="/jobs">
          <Button className="bg-gradient-to-r from-[#FFF32A] to-[#00AEC7] text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Button>
        </Link>
      </div>
    </div>
  )
}
