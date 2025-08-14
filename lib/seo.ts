export const SITE = "https://www.dsml.kz"

export const absoluteUrl = (path: string) =>
  path.startsWith("http") ? path : `${SITE}${path.startsWith("/") ? "" : "/"}${path}`

export const trimExcerpt = (s?: string, n = 160) =>
  (s ?? "")
    .replace(/\s+/g, " ")
    .slice(0, n)
    .trim()
    .replace(/[.,;:!?-]$/, "") + "…"
