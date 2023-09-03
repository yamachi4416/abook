import { defineStore } from 'pinia'

export const useUsersStore = defineStore('users', () => {
  const api = useApiRequest()

  async function syncUser() {
    return await api.$put('/users')
  }

  return {
    syncUser,
  }
})
