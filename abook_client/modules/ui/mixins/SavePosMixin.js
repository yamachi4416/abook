export default {
  beforeRouteLeave(to, from, next) {
    this.$savedpos.setPos(this.$route.fullPath, '.main')
    next()
  },

  mounted() {
    this.$savedpos.scroll(this.$route.fullPath, '.main')
  }
}
