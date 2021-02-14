import { AccountModel } from '@/modules/models/AccountModel'

export const actions = {
  async get ({ commit }, id) {
    if (!id || id === '0') {
      return AccountModel.wrap({})
    }
    return AccountModel.wrap(await this.$axios.$get(`/accounts/${id}`))
  },

  async getAll () {
    return await this.$axios.$get('/accounts/')
  },

  async create ({ commit }, account) {
    return await this.$axios.$post('/accounts', account)
  },

  async update ({ commit }, account) {
    return await this.$axios.$patch(`/accounts/${account.id}`, account)
  },

  async delete ({ commit }, id) {
    return await this.$axios.$delete(`/accounts/${id}`)
  },

  async updateDispOrders ({ commit }, ids) {
    return await this.$axios.$patch('/accounts/dispOrders', ids)
  }
}
