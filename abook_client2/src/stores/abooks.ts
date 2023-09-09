import { AbookEditModel, AbookViewModel } from '~~/libs/models'

export const useAbooksStore = defineStore('abooks', () => {
  const api = useApiRequest()

  const current = ref<AbookViewModel | null>(null)

  function newAbook(): AbookEditModel {
    return {
      name: '',
      startOfMonthIsPrev: false,
      startOfMonthDate: 1,
    }
  }

  async function getCurrent() {
    return await api.$get<AbookViewModel>('/abooks/current')
  }

  async function fetchCurrent() {
    const abook = await getCurrent()
    current.value = abook
    api.currentAbookId.value = abook.abookId
    return abook
  }

  async function saveAbook(abook: AbookEditModel) {
    const action = abook.abookId ? api.$patch : api.$post
    const saved = await action<AbookViewModel>('/abooks', abook)
    current.value = saved
    api.currentAbookId.value = saved.abookId
  }

  return {
    current,
    newAbook,
    fetchCurrent,
    saveAbook,
  }
})
