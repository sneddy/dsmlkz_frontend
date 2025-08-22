// Типы для аутентификации
export interface AuthUser {
  id: string
  email: string
  nickname?: string
}

export interface AuthState {
  user: AuthUser | null
  loading: boolean
  error: string | null
}
