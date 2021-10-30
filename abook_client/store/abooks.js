import { AbookModel } from '@/modules/models/AbookModel'

export const state = () => ({
  current: null
})

export const getters = {
  current(state) {
    return state.current
  }
}

export const mutations = {
  setCurrent(state, abook) {
    state.current = abook
  }
}

export const actions = {
  async fetchCurrent({ commit }) {
    const current = AbookModel.wrap(
      (await this.$axios.$get('/abooks/current')) || {}
    )
    commit('setCurrent', current)
    return current
  },

  async getCurrent() {
    const current = AbookModel.wrap(
      (await this.$axios.$get('/abooks/current')) || {}
    )
    return current
  },

  async save({ commit }, { abook }) {
    if (abook.isRegisted()) {
      const saved = await this.$axios.$patch('/abooks', abook)
      commit('setCurrent', AbookModel.wrap(saved))
    } else {
      const saved = await this.$axios.$post('/abooks', abook)
      commit('setCurrent', AbookModel.wrap(saved))
    }
  }
}
