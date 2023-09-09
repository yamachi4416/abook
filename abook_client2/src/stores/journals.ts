import { JournalSearchModel, JournalViewModel } from '~~/libs/models'

export const useJournalsStore = defineStore('journals', () => {
  const api = useApiRequest()

  async function searchJournals(query: JournalSearchModel) {
    return await api.$get<JournalViewModel[]>('/journals/search', query)
  }

  return {
    searchJournals,
  }
})
