// Типы для профиля
export interface Profile {
  id: string
  nickname: string
  fullName?: string
  bio?: string
  avatar?: string
  city?: string
  skills?: string[]
  experience?: string
  education?: string
  company?: string
  position?: string
  website?: string
  linkedin?: string
  github?: string
  telegram?: string
  createdAt: string
  updatedAt: string
}
