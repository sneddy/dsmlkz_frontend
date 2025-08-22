// Утилиты для валидации
export const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isValidNickname = (nickname: string) => {
  const nicknameRegex = /^[a-zA-Z0-9_-]+$/
  return nicknameRegex.test(nickname) && nickname.length >= 3
}
