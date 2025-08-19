"use client"
import { usePathname, useSearchParams, useRouter } from "next/navigation"
import { isSSRPath } from "@/lib/i18n-ssr-routes"

export function useLanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Формируем query string
  const searchStr = searchParams?.toString() ? `?${searchParams.toString()}` : ""

  // Убираем префикс локали из пути: /en/news -> /news
  function stripLocalePrefix(path: string): string {
    const parts = path.split("/")
    const maybeLocale = parts[1]

    if (["en", "ru", "kk"].includes(maybeLocale)) {
      return "/" + parts.slice(2).join("/")
    }
    return path
  }

  return function switchLanguage(nextLocale: "en" | "ru" | "kk") {
    const basePath = stripLocalePrefix(pathname || "/")

    if (!isSSRPath(basePath)) {
      console.log("[v0] CSR page detected, updating language context only")

      // Сохраняем выбор языка в cookie для будущих сессий
      document.cookie = `locale=${nextLocale};path=/;max-age=31536000`

      // Обновляем языковой контекст через событие
      window.dispatchEvent(
        new CustomEvent("languageChange", {
          detail: { locale: nextLocale },
        }),
      )

      return
    }

    // Для SSR страниц формируем URL с языковым префиксом
    const targetUrl = `/${nextLocale}${basePath}${searchStr}`

    console.log("[v0] Language switch:", {
      basePath,
      targetUrl,
      isSSR: isSSRPath(basePath),
    })

    // SSR страницы: полная перезагрузка для правильного server-side рендеринга
    console.log("[v0] SSR page detected, using window.location.assign")
    window.location.assign(targetUrl)
  }
}
