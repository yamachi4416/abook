<template>
  <div class="layout">
    <nuxt />
    <Loading />
  </div>
</template>

<script>
export default {

  head () {
    return {
      meta: [
        { hid: 'description', name: 'description', content: this.$t('head.description') }
      ]
    }
  },

  beforeMount () {
    this.setVH()
    window.addEventListener('resize', this.setVH)
  },

  beforeDestroy () {
    window.removeEventListener('resize', this.setVH)
  },

  methods: {
    setVH () {
      const vh = window.innerHeight
      this.$store.commit('ui/setVH', vh)
    }
  }
}
</script>
