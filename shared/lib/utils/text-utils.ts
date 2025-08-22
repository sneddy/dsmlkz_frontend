// Утилиты для работы с текстом
export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export const capitalizeFirst = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1)
}
