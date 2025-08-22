// Константы для маршрутов
export const ROUTES = {
  HOME: '/',
  ARTICLES: '/articles',
  NEWS: '/news',
  JOBS: '/jobs',
  EVENTS: '/events',
  FACES: '/faces',
  RESEARCH: '/research',
  VALUES: '/values',
  RULES: '/rules',
  AUTH: {
    SIGNIN: '/auth/signin',
    SIGNUP: '/auth/signup',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    EMAIL_VERIFICATION: '/auth/email-verification',
  },
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
} as const
