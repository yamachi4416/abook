export const state = () => ({
  vh: 0,
  transition: '',
  loading: 0,
  modalStack: []
})

export const getters = {
  vh (state) {
    return state.vh
  },

  loading (state) {
    return state.loading
  },

  transition (state) {
    return state.transition
  },

  currentModal (state) {
    const l = state.modalStack.length
    return l === 0 ? null : state.modalStack[l - 1]
  }
}

export const mutations = {
  setVH (state, vh) {
    state.pvh = state.vh
    state.vh = vh
  },

  startLoading (state, status = 1) {
    if (state.loading < status) {
      state.loading = status
    }
  },

  stopLoading (state, status = 1) {
    if (state.loading <= status) {
      state.loading = 0
    }
  },

  setTransition (state, transition) {
    state.transition = transition
  },

  addModal (state, el) {
    state.modalStack.push({
      uid: el._uid,
      handler: () => el.$destroy()
    })
  },

  removeModal (state, el) {
    const id = el.uid || el._uid
    state.modalStack = state.modalStack
      .filter(({ uid }) => uid !== id)
  },

  destroyModals (state) {
    state.modalStack.forEach(({ handler }) => handler())
    state.modalStack = []
  }
}
