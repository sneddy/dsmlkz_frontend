"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import Link from "next/link"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Global error:", error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              <CardTitle className="text-xl text-red-400">Критическая ошибка</CardTitle>
              <CardDescription className="text-gray-400">
                Произошла серьезная ошибка в приложении
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-300 bg-gray-700/50 p-3 rounded-lg">
                <p className="font-medium">Ошибка:</p>
                <p className="text-gray-400 break-all">{error.message}</p>
              </div>
              
              <div className="flex flex-col space-y-2">
                <Button onClick={reset} className="w-full bg-[#00AEC7] hover:bg-[#00AEC7]/90">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Попробовать снова
                </Button>
                
                <Button asChild variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    На главную
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </body>
    </html>
  )
}
