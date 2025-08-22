// Хук для поиска участников
export const useMemberSearch = () => {
  return {
    search: '',
    results: [],
    loading: false,
    searchMembers: () => {},
  }
}
