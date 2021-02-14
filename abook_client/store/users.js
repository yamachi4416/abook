export const actions = {
  async watchUser (_, { name }) {
    return await new Promise(
      (resolve, reject) => this.$auth.watch(name, { resolve, reject }))
  },

  async syncUser () {
    return await this.$axios.$put('users')
  },

  async getUser ({ dispatch }) {
    if (this.$auth.currentUser) {
      return this.$auth.currentUser
    }

    return await new Promise(
      resolve => this.$auth.watchOnce(resolve))
  },

  async getToken ({ dispatch }) {
    const user = await dispatch('getUser')
    if (user) {
      return await user.getIdToken()
    }
    return null
  },

  async signIn () {
    return await this.$auth.signInWithRedirect()
  },

  async signOut () {
    return await this.$auth.signOut()
  }
}
