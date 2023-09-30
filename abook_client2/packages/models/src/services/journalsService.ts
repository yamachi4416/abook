import { formatDate } from '../utils/date'
import { ApiRequestService, JournalsService } from './interfaces'

export function journalsService({
  api,
}: {
  api: ApiRequestService
}): JournalsService {
  return {
    newJournal(params) {
      return {
        accrualDate: formatDate(new Date(), 'YYYY-MM-DD'),
        ...params,
      }
    },
    async getJournal({ id, signal }) {
      return await api.$get({ path: `/journals/${id}`, signal })
    },
    async createJournal({ journal }) {
      return await api.$post({ path: '/journals', body: journal })
    },
    async updateJournal({ journal }) {
      return await api.$patch({
        path: `/journals/${journal.id}`,
        body: journal,
      })
    },
    async deleteJournal({ id }) {
      await api.$delete({ path: `/journals/${id}` })
    },
    async searchJournals({ query, signal }) {
      return await api.$get({ path: '/journals/search', query, signal })
    },
    async searchBalances({
      accrualDateStart,
      accrualDateEnd,
      periods,
      signal,
    }) {
      const from = formatDate(accrualDateStart, 'YYYYMMDD')
      const to = formatDate(accrualDateEnd, 'YYYYMMDD')
      return await api.$get({
        path: `/journals/balance/${from}/${to}`,
        query: { periods },
        signal,
      })
    },
  }
}
