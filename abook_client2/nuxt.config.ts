export default defineNuxtConfig({
  ssr: false,
  components: true,
  srcDir: 'src',

  app: {
    baseURL: process.env.NUXT_APP_BASE_URL ?? '',
    head: {
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1.0',
        },
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/icon?family=Material+Icons+Outlined',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=M+PLUS+1p:wght@400&display=swap',
        },
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/water.css@2/out/water.css',
        },
      ],
    },
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
