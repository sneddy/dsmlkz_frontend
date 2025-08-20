import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"

interface HeroSectionProps {
  title: string
  subtitle: string
  description?: string
  primaryButton?: {
    text: string
    href?: string
  }
  secondaryButton?: {
    text: string
    href?: string
  }
}

export default function HeroSection({
  title,
  subtitle,
  description,
  primaryButton,
  secondaryButton,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden py-16 px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-[#00AEC7]/20 via-slate-900/80 to-[#FFF32A]/20"></div>
      <div className="relative max-w-4xl mx-auto text-center z-10">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-pixel font-bold mb-6 sm:mb-8 tracking-tight leading-tight px-4">
          <span className="bg-gradient-to-r from-[#FFF32A] via-[#00AEC7] to-[#FFF32A] bg-clip-text text-transparent animate-pulse">
            {title}
          </span>
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-4 px-4 font-medium">
          {subtitle}
        </p>

        {description && (
          <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-12 px-4">
            {description}
          </p>
        )}

        {(primaryButton || secondaryButton) && (
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4">
            {primaryButton &&
              (primaryButton.href ? (
                <Link href={primaryButton.href} className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-[#FFF32A] to-[#FFF32A]/90 text-black hover:from-[#FFF32A]/90 hover:to-[#FFF32A]/80 font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group text-base font-pixel"
                  >
                    {primaryButton.text}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              ) : (
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-[#FFF32A] to-[#FFF32A]/90 text-black hover:from-[#FFF32A]/90 hover:to-[#FFF32A]/80 font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group text-base font-pixel"
                >
                  {primaryButton.text}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              ))}

            {secondaryButton &&
              (secondaryButton.href ? (
                <Link href={secondaryButton.href} className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto border-2 border-[#00AEC7] text-[#00AEC7] hover:bg-[#00AEC7]/10 backdrop-blur-sm px-8 py-4 rounded-full transition-all duration-300 group bg-transparent text-base font-pixel"
                  >
                    <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                    {secondaryButton.text}
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-2 border-[#00AEC7] text-[#00AEC7] hover:bg-[#00AEC7]/10 backdrop-blur-sm px-8 py-4 rounded-full transition-all duration-300 group bg-transparent text-base font-pixel"
                >
                  <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  {secondaryButton.text}
                </Button>
              ))}
          </div>
        )}
      </div>
    </section>
  )
}

export { HeroSection }
