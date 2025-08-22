import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./contexts/**/*.{js,ts,jsx,tsx,mdx}",
    "./translations/**/*.{js,ts,jsx,tsx,mdx}",
    "./widgets/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
    "./shared/**/*.{js,ts,jsx,tsx,mdx}",
    "./scripts/**/*.{js,ts,jsx,tsx,mdx}",
    "./types/**/*.{js,ts,jsx,tsx,mdx}",
    "./config/**/*.{js,ts,jsx,tsx,mdx}",
    "./docs/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#00AEC7",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "#FFF32A",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Добавляем кастомные цвета проекта
        dsml: {
          blue: "#00AEC7",
          yellow: "#FFF32A",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', "cursive"],
      },
    },
  },
  // 🛡️ SAFELIST - ЗАЩИТА ОТ УДАЛЕНИЯ В PRODUCTION
  safelist: [
    // === ОСНОВНЫЕ ЦВЕТА ПРОЕКТА ===
    // Текст
    "text-[#00AEC7]",
    "text-[#FFF32A]",
    "text-dsml-blue",
    "text-dsml-yellow",

    // Фон
    "bg-[#00AEC7]",
    "bg-[#FFF32A]",
    "bg-dsml-blue",
    "bg-dsml-yellow",

    // Границы
    "border-[#00AEC7]",
    "border-[#FFF32A]",
    "border-dsml-blue",
    "border-dsml-yellow",

    // === HOVER СОСТОЯНИЯ ===
    "hover:bg-[#00AEC7]",
    "hover:bg-[#FFF32A]",
    "hover:text-[#00AEC7]",
    "hover:text-[#FFF32A]",
    "hover:border-[#00AEC7]",
    "hover:border-[#FFF32A]",
    "hover:bg-dsml-blue",
    "hover:bg-dsml-yellow",
    "hover:text-dsml-blue",
    "hover:text-dsml-yellow",

    // === FOCUS СОСТОЯНИЯ ===
    "focus:bg-[#00AEC7]",
    "focus:bg-[#FFF32A]",
    "focus:text-[#00AEC7]",
    "focus:text-[#FFF32A]",
    "focus:border-[#00AEC7]",
    "focus:border-[#FFF32A]",
    "focus:ring-[#00AEC7]",
    "focus:ring-[#FFF32A]",

    // === ПРОЗРАЧНОСТИ ===
    "bg-[#00AEC7]/10",
    "bg-[#00AEC7]/20",
    "bg-[#00AEC7]/30",
    "bg-[#00AEC7]/40",
    "bg-[#00AEC7]/50",
    "bg-[#00AEC7]/60",
    "bg-[#00AEC7]/70",
    "bg-[#00AEC7]/80",
    "bg-[#00AEC7]/90",

    "bg-[#FFF32A]/10",
    "bg-[#FFF32A]/20",
    "bg-[#FFF32A]/30",
    "bg-[#FFF32A]/40",
    "bg-[#FFF32A]/50",
    "bg-[#FFF32A]/60",
    "bg-[#FFF32A]/70",
    "bg-[#FFF32A]/80",
    "bg-[#FFF32A]/90",

    "text-[#00AEC7]/50",
    "text-[#00AEC7]/70",
    "text-[#00AEC7]/90",
    "text-[#FFF32A]/50",
    "text-[#FFF32A]/70",
    "text-[#FFF32A]/90",

    // === БЕЛЫЙ ЦВЕТ С ПРОЗРАЧНОСТЬЮ ===
    "bg-white/10",
    "bg-white/20",
    "bg-white/30",
    "bg-white/40",
    "bg-white/50",
    "bg-white/60",
    "bg-white/70",
    "bg-white/80",
    "bg-white/90",
    "text-white/90",
    "text-white/80",
    "text-white/70",

    // === ГРАДИЕНТЫ ===
    "from-[#00AEC7]",
    "to-[#FFF32A]",
    "via-[#00AEC7]",
    "via-[#FFF32A]",
    "from-dsml-blue",
    "to-dsml-yellow",
    "to-cyan-600",
    "from-cyan-500",
    "bg-gradient-to-r",
    "bg-gradient-to-l",
    "bg-gradient-to-t",
    "bg-gradient-to-b",
    "bg-gradient-to-br",
    "bg-gradient-to-bl",
    "bg-gradient-to-tr",
    "bg-gradient-to-tl",

    // === АНИМАЦИИ ===
    "animate-spin",
    "animate-pulse",
    "animate-bounce",
    "animate-reverse",

    // === СОСТОЯНИЯ КОМПОНЕНТОВ ===
    "data-[state=active]:bg-[#00AEC7]",
    "data-[state=active]:text-white",
    "data-[state=active]:bg-[#FFF32A]",
    "data-[state=active]:text-black",

    // === КАСТОМНЫЕ ФОНОВЫЕ КЛАССЫ ===
    "bg-card-horizontal",
    "bg-card-mobile",
    "bg-card-horizontal-fallback",
    "bg-card-mobile-fallback",
    "bg-hero-pattern",
    "bg-dashboard-pattern",

    // === ДОПОЛНИТЕЛЬНЫЕ УТИЛИТЫ ===
    "shadow-[#00AEC7]/20",
    "shadow-[#FFF32A]/20",
    "ring-[#00AEC7]",
    "ring-[#FFF32A]",
    "outline-[#00AEC7]",
    "outline-[#FFF32A]",

    // === RESPONSIVE КЛАССЫ ===
    "sm:bg-[#00AEC7]",
    "md:bg-[#00AEC7]",
    "lg:bg-[#00AEC7]",
    "xl:bg-[#00AEC7]",
    "sm:text-[#00AEC7]",
    "md:text-[#00AEC7]",
    "lg:text-[#00AEC7]",
    "xl:text-[#00AEC7]",

    // === DARK MODE ===
    "dark:bg-[#00AEC7]",
    "dark:text-[#00AEC7]",
    "dark:border-[#00AEC7]",
    "dark:bg-[#FFF32A]",
    "dark:text-[#FFF32A]",
    "dark:border-[#FFF32A]",
  ],
  plugins: [require("tailwindcss-animate")],
}

export default config
