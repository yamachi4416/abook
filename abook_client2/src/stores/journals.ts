import { formatDate } from '@vueuse/core'
import {
  JournalEditModel,
  JournalSearchModel,
  JournalViewModel,
} from '~~/libs/models'

export const useJournalsStore = defineStore('journals', () => {
  const api = useApiRequest()

  function newJournal(params?: JournalEditModel): JournalEditModel {
    const journal: JournalEditModel = {
      accrualDate: formatDate(new Date(), 'YYYY-MM-DD'),
      ...params,
    }
    return journal
  }

  async function getJournal(id: string) {
    return await api.$get<JournalViewModel>(`/journals/${id}`)
  }

  async function createJournal(journal: JournalEditModel) {
    return await api.$post<{ id: string }>('/journals', journal)
  }

  async function updateJournal(journal: JournalEditModel) {
    return await api.$patch<JournalViewModel>(
      `/journals/${journal.id}`,
      journal,
    )
  }

  async function deleteJournal(id: string) {
    return await api.$delete<void>(`/journals/${id}`)
  }

  async function searchJournals(query: JournalSearchModel) {
    return await api.$get<JournalViewModel[]>('/journals/search', query)
  }

  return {
    newJournal,
    getJournal,
    createJournal,
    updateJournal,
    deleteJournal,
    searchJournals,
  }
})
