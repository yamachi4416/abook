export default {
  methods: {
    keyRingInto () {
      const first = this.$refs.first.$el || this.$refs.first
      first.focus()
    },

    keyRing (event) {
      const code = event.keyCode

      if (code === 9) {
        const first = this.$refs.first.$el || this.$refs.first
        const last = this.$refs.last.$el || this.$refs.last
        const container = this.$refs.container.$el || this.$refs.container
        const src = event.srcElement

        if (!container.contains(src)) {
          event.preventDefault()
          event.shiftKey ? last.focus() : first.focus()
          return false
        } else if (first.contains(src)) {
          if (event.shiftKey) {
            event.preventDefault()
            last.focus()
            return false
          }
        } else if (last.contains(src)) {
          if (!event.shiftKey) {
            event.preventDefault()
            first.focus()
            return false
          }
        }
      }

      return true
    }
  }
}
