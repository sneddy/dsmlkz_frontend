export function truncateText(html: string, maxLength = 575) {
  let text = html.replace(/<br\s*\/?>/gi, " ")
  text = text.replace(/<[^>]*>?/gm, "")
  text = text.replace(/\s+/g, " ").trim()

  if (text.length <= maxLength) return { text, isTruncated: false }

  let breakPoint = text.lastIndexOf(" ", maxLength - 3)
  if (breakPoint === -1) breakPoint = maxLength - 3

  return {
    text: text.substring(0, breakPoint) + "...",
    isTruncated: true,
  }
}

export function normalizeHref(href: string) {
  const trimmed = href.trim()

  if (!trimmed) return "#"
  if (/^(javascript|data|vbscript):/i.test(trimmed)) return "#"
  if (trimmed.startsWith("//")) return `https:${trimmed}`
  if (/^(https?:|mailto:|tel:|#|\/)/i.test(trimmed)) return trimmed
  if (/^(www\.|[a-z0-9-]+(?:\.[a-z0-9-]+)+\/)/i.test(trimmed)) return `https://${trimmed}`

  return trimmed
}

export function normalizeTelegramHref(value: string) {
  const trimmed = value.trim()

  if (!trimmed) return "#"
  if (/^https?:\/\/(t\.me|telegram\.me)\//i.test(trimmed)) {
    const handle = trimmed
      .replace(/^https?:\/\/(t\.me|telegram\.me)\//i, "")
      .replace(/^@/, "")
    return `https://t.me/${handle}`
  }
  if (/^https?:\/\//i.test(trimmed)) return normalizeHref(trimmed)

  return `https://t.me/${trimmed.replace(/^@/, "")}`
}

export function normalizeHtmlLinks(html: string) {
  return html.replace(/<a\b([^>]*)>/gi, (match, attributes: string) => {
    const hrefMatch = attributes.match(/\s+href=(["'])(.*?)\1/i)

    if (!hrefMatch) return match

    const normalizedHref = normalizeHref(hrefMatch[2])
    let nextAttributes = attributes.replace(/\s+href=(["'])(.*?)\1/i, ` href=${hrefMatch[1]}${normalizedHref}${hrefMatch[1]}`)

    if (/^https?:\/\//i.test(normalizedHref)) {
      if (/\s+target=(["'])(.*?)\1/i.test(nextAttributes)) {
        nextAttributes = nextAttributes.replace(/\s+target=(["'])(.*?)\1/i, ' target="_blank"')
      } else {
        nextAttributes += ' target="_blank"'
      }

      const relMatch = nextAttributes.match(/\s+rel=(["'])(.*?)\1/i)
      if (relMatch) {
        const relValues = new Set(relMatch[2].split(/\s+/).filter(Boolean))
        relValues.add("noopener")
        relValues.add("noreferrer")
        nextAttributes = nextAttributes.replace(/\s+rel=(["'])(.*?)\1/i, ` rel="${Array.from(relValues).join(" ")}"`)
      } else {
        nextAttributes += ' rel="noopener noreferrer"'
      }
    }

    return `<a${nextAttributes}>`
  })
}

type RelativeDateLabels = {
  yesterday: string
  daysAgo: string
  months: string[]
}

const defaultDateLabels: RelativeDateLabels = {
  yesterday: "Вчера",
  daysAgo: "дней назад",
  months: ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"],
}

export function formatDate(dateString: string, labels: RelativeDateLabels = defaultDateLabels) {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) return labels.yesterday
  if (diffDays < 7) return `${diffDays} ${labels.daysAgo}`

  const day = date.getDate()
  const monthName = labels.months[date.getMonth()]
  const year = date.getFullYear()

  return `${day} ${monthName} ${year}`
}
