import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[80vh] py-8">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-[#00AEC7]">404</h1>
        <h2 className="text-2xl font-semibold text-[#FFF32A]">Page Not Found</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="pt-6">
          <Link href="/">
            <Button className="bg-[#00AEC7] hover:bg-[#00AEC7]/90 text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
