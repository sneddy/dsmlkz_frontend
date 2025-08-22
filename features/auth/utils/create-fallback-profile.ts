// Утилита для создания fallback профиля
export const createFallbackProfile = () => {
  return {
    id: '',
    nickname: '',
    fullName: '',
    bio: '',
    avatar: '',
    city: '',
    skills: [],
    experience: '',
    education: '',
    company: '',
    position: '',
    website: '',
    linkedin: '',
    github: '',
    telegram: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}
