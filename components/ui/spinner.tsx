"use client"

import { cn } from "@/lib/utils"

interface SpinnerProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function Spinner({ className, size = "md" }: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  }

  return (
    <div className="flex justify-center items-center p-4">
      <div
        className={cn("animate-spin rounded-full border-b-transparent border-primary", sizeClasses[size], className)}
      />
    </div>
  )
}
