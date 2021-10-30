export default opts => ({
  data() {
    const d = {}
    Object.entries(opts).forEach(([k, v]) => {
      d[k] = this.$appoptions.getOpt(v)
    })
    return d
  },

  beforeDestroy() {
    Object.entries(opts).forEach(([k, v]) => {
      this.$appoptions.setOpt(v, this.$data[k])
    })

    this.$appoptions.flush()
  }
})
