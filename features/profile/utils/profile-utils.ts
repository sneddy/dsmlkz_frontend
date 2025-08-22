// Утилиты для профиля
export const profileUtils = {
  validateNickname: (nickname: string) => {
    const nicknameRegex = /^[a-zA-Z0-9_-]+$/
    return nicknameRegex.test(nickname) && nickname.length >= 3
  },
  
  formatSkills: (skills: string[]) => {
    return skills.join(', ')
  },
}
