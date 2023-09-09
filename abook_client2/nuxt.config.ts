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

  modules: ['@pinia/nuxt', '@nuxtjs/i18n', '@vueuse/nuxt'],

  imports: {
    dirs: ['stores'],
    presets: ['pinia'],
  },

  i18n: {
    strategy: 'no_prefix',
    defaultLocale: 'ja',
    locales: [
      { code: 'ja', name: '日本語', iso: 'ja_JP', file: 'ja.json' },
      { code: 'en', name: 'English', iso: 'en-US', file: 'en.json' },
      { code: 'zh', name: '中文', iso: 'zh-TW', file: 'zh.json' },
    ],
    langDir: 'locales/',
    lazy: true,
    detectBrowserLanguage: {
      useCookie: true,
      fallbackLocale: 'ja',
    },
  },
})
