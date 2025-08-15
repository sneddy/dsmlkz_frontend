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

export function formatDate(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) return "Вчера"
  if (diffDays < 7) return `${diffDays} дней назад`

  const day = date.getDate()
  const months = ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"]
  const monthName = months[date.getMonth()]
  const year = date.getFullYear()

  return `${day} ${monthName} ${year}`
}
