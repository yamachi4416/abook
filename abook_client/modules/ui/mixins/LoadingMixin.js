export default {
  methods: {
    startLoading () {
      this.$store.commit('ui/startLoading', 2)
    },

    stopLoading () {
      this.$store.commit('ui/stopLoading', 2)
    },

    async useLoading (delegate, stop = true) {
      const active = document.activeElement
      if (active) {
        active.blur()
      }
      this.startLoading()
      await delegate()
      if (stop) {
        this.stopLoading()
        if (active) {
          active.focus()
        }
      }
    }
  }
}
