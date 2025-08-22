// Константы для аутентификации
export const AUTH_CONSTANTS = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_LOGIN_ATTEMPTS: 5,
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 часа
  DEBUG: process.env.NODE_ENV === "development",
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 секунда
} as const

// Экспортируем отдельно для обратной совместимости
export const DEBUG = AUTH_CONSTANTS.DEBUG
export const MAX_RETRIES = AUTH_CONSTANTS.MAX_RETRIES
export const RETRY_DELAY = AUTH_CONSTANTS.RETRY_DELAY
