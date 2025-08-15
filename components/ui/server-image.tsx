import Image from "next/image"
import { cn } from "@/lib/utils"

interface ServerImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  fallbackSrc?: string
  priority?: boolean
  sizes?: string
  quality?: number
}

export function ServerImage({
  src,
  alt,
  width,
  height,
  className,
  fallbackSrc = "/placeholder.svg",
  priority = false,
  sizes,
  quality = 75,
}: ServerImageProps) {
  return (
    <Image
      src={src || fallbackSrc}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      sizes={sizes}
      quality={quality}
      className={cn("object-cover", className)}
    />
  )
}
