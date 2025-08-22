// Хук для переводов
export const useTranslation = () => {
  return {
    t: (key: string) => key,
    currentLanguage: 'en',
  }
}
