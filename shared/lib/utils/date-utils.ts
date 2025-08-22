// Утилиты для работы с датами
export const formatDate = (date: Date) => {
  return date.toLocaleDateString()
}

export const formatRelativeTime = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return 'Сегодня'
  if (days === 1) return 'Вчера'
  if (days < 7) return `${days} дней назад`
  return formatDate(date)
}
