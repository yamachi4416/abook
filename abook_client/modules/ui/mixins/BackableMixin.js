export default {
  methods: {
    back(n = -1) {
      if (history.length > 2) {
        this.$router.go(n)
      } else if (this.$route.fullPath === '/') {
        this.$router.go({ path: '/', force: true })
      } else {
        this.$router.replace('/')
      }
    }
  }
}
