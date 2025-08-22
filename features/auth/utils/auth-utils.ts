// Утилиты для аутентификации
export const authUtils = {
  validateEmail: (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },
  
  validatePassword: (password: string) => {
    return password.length >= 8
  },
}
