export default defineNuxtConfig({
  components: true,
  srcDir: 'src',

  app: {
    baseURL: process.env.NUXT_APP_BASE_URL ?? '',
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: '',
      firebaseConfig: {},
    },
  },

  modules: ['@pinia/nuxt'],
})
