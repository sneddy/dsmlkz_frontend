// Хук для защиты маршрутов
export const useAuthGuard = () => {
  return {
    isAuthenticated: false,
    isLoading: false,
  }
}
