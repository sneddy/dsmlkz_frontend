export function formatJobDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) return "вчера"
  if (diffDays < 7) return `${diffDays} дн. назад`

  // For dates older than a week, show day, month and year
  const day = date.getDate()
  const month = date.getMonth()
  const year = date.getFullYear()

  const monthNames = ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"]

  return `${day} ${monthNames[month]} ${year}`
}

export function getChannelInfo(channelId: number) {
  if (channelId === -1001120572276) {
    return {
      type: "ML Jobs",
      color: "text-purple-400",
      bgColor: "bg-purple-900/50",
      borderColor: "border-purple-700",
    }
  } else if (channelId === -1001944996511) {
    return {
      type: "IT Jobs",
      color: "text-blue-400",
      bgColor: "bg-blue-900/50",
      borderColor: "border-blue-700",
    }
  }
  return {
    type: "General",
    color: "text-gray-400",
    bgColor: "bg-gray-800",
    borderColor: "border-gray-600",
  }
}

export function truncateJobText(html: string, maxLength = 575): { text: string; isTruncated: boolean } {
  // Remove HTML tags
  let text = html.replace(/<br\s*\/?>/gi, " ")
  text = text.replace(/<[^>]*>?/gm, "")
  text = text.replace(/\s+/g, " ").trim()

  if (text.length <= maxLength) return { text, isTruncated: false }

  // Find good break point
  let breakPoint = text.lastIndexOf(" ", maxLength - 3)
  if (breakPoint === -1) breakPoint = maxLength - 3

  return {
    text: text.substring(0, breakPoint) + "...",
    isTruncated: true,
  }
}
