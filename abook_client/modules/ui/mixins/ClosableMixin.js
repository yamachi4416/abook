export default {
  destroyed() {
    this.$emit('close')
  },

  methods: {
    async close() {
      if (this.$children && this.$children[0] && this.$children[0].close) {
        await this.$children[0].close()
      }
      await this.$nextTick(async () => {
        await this.$destroy()
      })
    }
  }
}
