import datetime from '@/modules/utils/datetime'
import { JournalModel } from '@/modules/models/JournalModel'

export const actions = {
  async get ({ commit }, id) {
    if (!id || id === '0') {
      return JournalModel.wrap({})
    }
    return JournalModel.wrap(await this.$axios.$get(`/journals/${id}`))
  },

  async getBalance ({ commit }, { from, to, periods }) {
    const params = new URLSearchParams()
    periods.forEach(v => params.append('periods', v))
    return await this.$axios.$get(`/journals/balance/${from}/${to}`, {
      params
    })
  },

  async create ({ commit }, journal) {
    await this.$axios.$post('/journals', journal)
  },

  async update ({ commit }, journal) {
    await this.$axios.$patch(`/journals/${journal.id}`, journal)
  },

  async delete ({ commit }, id) {
    await this.$axios.$delete(`/journals/${id}`)
  },

  async searchByDate ({ commit }, { date, query }) {
    const searchDate = datetime(date).format('YYYY-MM-DD')
    const { accountId, financeDiv, journalDiv, memo } = query
    return JournalModel.wraps(
      await this.$axios.$get('/journals/search', {
        params: {
          accrualDateStart: searchDate,
          accrualDateEnd: searchDate,
          accountId,
          financeDiv,
          journalDiv,
          memo
        }
      }))
  },

  async search ({ commit }, {
    accountId, accrualDateStart, accrualDateEnd, memo, financeDiv, journalDiv
  }) {
    return JournalModel.groupByAccrualDate(
      JournalModel.wraps(
        await this.$axios.$get('/journals/search', {
          params: {
            accountId,
            journalDiv,
            financeDiv,
            accrualDateStart,
            accrualDateEnd,
            memo
          }
        })))
  }
}
