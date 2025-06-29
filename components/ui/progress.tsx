/**
 * Progress – shadcn/ui–style wrapper around Radix Progress
 *
 * Usage:
 *   import { Progress } from "@/components/ui/progress"
 *   <Progress value={42} />
 */

"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

export interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  /** Current progress value (0-100). */
  value?: number
}

/**
 * Renders a visually-hidden Progress bar root element so screen readers
 * announce its value. Styling is handled with Tailwind classes that match
 * shadcn/ui defaults.
 */
export const Progress = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, ProgressProps>(
  ({ className, value = 0, max = 100, ...props }, ref) => (
    <ProgressPrimitive.Root
      ref={ref}
      max={max}
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-muted", className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 rounded-full bg-primary transition-all"
        style={{ transform: `translateX(-${100 - (value / max) * 100}%)` }}
      />
    </ProgressPrimitive.Root>
  ),
)
Progress.displayName = "Progress"
