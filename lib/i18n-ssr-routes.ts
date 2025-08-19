// SSR страницы, которые требуют полной перезагрузки для правильного рендеринга
export const SSR_PATTERNS = [
  "^/news(?:/.*)?$", // новости
  "^/jobs(?:/.*)?$", // вакансии
  "^/articles(?:/.*)?$", // добавлена поддержка articles как SSR страницы
  // если какие-то ещё нужны — добавляй сюда
]

export function isSSRPath(pathname: string): boolean {
  // Убираем языковой префикс для проверки
  const cleanPath = pathname.replace(/^\/(?:en|ru|kk)/, "") || "/"
  return SSR_PATTERNS.some((pattern) => new RegExp(pattern).test(cleanPath))
}
