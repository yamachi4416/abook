import { defineStore } from 'pinia'

export const useAbooksStore = defineStore('abooks', () => {
  const api = useApiRequest()

  const current = ref<Models.AbookViewModel | null>(null)

  async function getCurrent() {
    return await api.$get<Models.AbookViewModel>('/abooks/current')
  }

  async function fetchCurrent() {
    const abook = await getCurrent()
    current.value = abook
    api.currentAbookId.value = abook.abookId
    return abook
  }

  return {
    current,
    getCurrent,
    fetchCurrent,
  }
})
