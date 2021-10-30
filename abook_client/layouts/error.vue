<template>
  <DefaultLayout>
    <template #title>
      {{ title }}
    </template>

    <template #default>
      <div id="message_body">
        <div>
          <p>{{ message }}</p>
        </div>
      </div>
    </template>

    <template #footer>
      <span>
        <button data-icon="home" @click="home"></button>
      </span>
      <span></span>
      <span></span>
      <span></span>
    </template>
  </DefaultLayout>
</template>

<script>
export default {
  layout: 'default',
  props: {
    error: {
      type: Object,
      required: false,
      default: () => ({})
    }
  },

  computed: {
    code() {
      const e = this.error
      const message = e.message || ''

      if (
        /network error/i.test(message) ||
        /Loading chunk.*?failed\./i.test(message)
      ) {
        return 'offline'
      }

      return this.error.statusCode
    },

    title() {
      const code = this.code
      const key = `errors.statusCode.${code}.title`
      return this.$te(key)
        ? this.$t(key, this.error)
        : this.$t('errors.statusCode.default.title', this.error)
    },

    message() {
      const code = this.code
      const key = `errors.statusCode.${code}.message`
      return this.$te(key)
        ? this.$t(key, this.error)
        : this.$t('errors.statusCode.default.message', this.error)
    }
  },

  beforeMount() {
    window.console.log(this.error)
    this.$store.commit('ui/stopLoading', 9)
  },

  methods: {
    home() {
      if (this.$route.path === '/') {
        this.$router.go({ path: '/', force: true })
      } else {
        this.$router.replace('/')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/scss/vars.scss';

#message_body {
  display: table;
  width: 100%;
  height: 100%;

  & > * {
    display: table-row;

    p {
      display: table-cell;
      white-space: pre-line;
      text-align: center;
      vertical-align: middle;
      height: 100%;
      width: 100%;
    }
  }
}
</style>
