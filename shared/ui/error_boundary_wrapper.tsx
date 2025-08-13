"use client"

import type React from "react"

import { ErrorBoundary } from "@/shared/ui/error_boundary"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface ErrorBoundaryWrapperProps {
  children: React.ReactNode
}

export function ErrorBoundaryWrapper({ children }: ErrorBoundaryWrapperProps) {
  const fallback = (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-6 text-center">
      <AlertTriangle className="h-10 w-10 text-yellow-500 mb-4" />
      <h2 className="text-xl font-bold mb-2">Что-то пошло не так</h2>
      <p className="text-muted-foreground mb-4">Произошла непредвиденная ошибка</p>
      <Button onClick={() => window.location.reload()}>Попробовать снова</Button>
    </div>
  )

  return <ErrorBoundary fallback={fallback}>{children}</ErrorBoundary>
}
