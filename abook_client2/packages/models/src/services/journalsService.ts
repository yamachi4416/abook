import {
  JournalEditModel,
  JournalSearchModel,
  JournalViewModel,
} from '../share'
import { formatDate } from '../utils/date'
import { ApiRequestService, JournalsService } from './interfaces'

function newJournal(params?: JournalEditModel): JournalEditModel {
  return {
    accrualDate: formatDate(new Date(), 'YYYY-MM-DD'),
    ...params,
  }
}

export function journalsService({
  api,
}: {
  api: ApiRequestService
}): JournalsService {
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
}
