export default defineNuxtConfig({
  ssr: true,
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

  modules: ['@pinia/nuxt', '@vueuse/nuxt'],

  imports: {
    dirs: ['stores'],
  },

  pinia: {
    autoImports: ['storeToRefs'],
  },
})
