export default defineNuxtConfig({
  ssr: false,
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
    presets: [
      {
        from: '~~/types/models',
        type: true,
        imports: ['Models']
      },
    ],
  },

  pinia: {
    autoImports: ['storeToRefs'],
  },
})
