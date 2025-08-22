// Хук для аутентификации
export const useAuth = () => {
  return {
    user: null,
    loading: false,
    signIn: () => {},
    signOut: () => {},
  }
}
