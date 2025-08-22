// Хук для toast уведомлений
export const useToast = () => {
  // Реализация хука
  return {
    toast: (message: string) => console.log(message),
    error: (message: string) => console.error(message),
    success: (message: string) => console.log(message),
  }
}
