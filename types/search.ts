// Типы для поиска
export interface SearchFilters {
  skills?: string[]
  city?: string
  experience?: string
  company?: string
}

export interface SearchResult {
  id: string
  nickname: string
  fullName?: string
  avatar?: string
  city?: string
  skills?: string[]
  experience?: string
  company?: string
  position?: string
}
