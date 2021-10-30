export default {
  ssr: false,

  target: 'server',

  server: {
    host: '0.0.0.0',
    port: process.env.APP_PORT
  },

  publicRuntimeConfig: {
    axios: {
      browserBaseURL: process.env.API_BASE_URL
    },
    firebaseConfig: JSON.parse(process.env.FIREBASE_CONFIG || '{}')
  },

  env: {
    dev: process.env.NODE_ENV === 'development'
  },

  head: {
    base: { href: process.env.APP_CONTEXT_ROOT },
    titleTemplate: 'αBooK',
    title: 'αBooK',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content:
          'width=device-width,initial-scale=1,maximum-scale=1,user-scalable=0,viewport-fit=cover'
      },
      { name: 'theme-color', content: '#fff' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/icon?family=Material+Icons+Outlined'
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=M+PLUS+1p:wght@400&display=swap'
      }
    ],
    script: [
      {
        src: '//polyfill.io/v3/polyfill.min.js?features=default%2Ces2017%2Cfetch%2Csmoothscroll'
      }
    ]
  },

  css: ['~assets/scss/main.scss'],

  router: {
    base: process.env.APP_CONTEXT_ROOT,
    middleware: ['auth'],
    scrollBehavior: (to, from, savedPosition) => {
      if (savedPosition) {
        return savedPosition
      } else {
        return { x: 0, y: 0 }
      }
    }
  },

  plugins: [
    '~plugins/firebase',
    '~plugins/axios',
    '~plugins/router',
    '~plugins/savedpos',
    '~plugins/flash',
    '~plugins/appoptions',
    '~plugins/i18n',
    '~plugins/filter'
  ],

  components: [
    {
      path: '@/components/',
      pathPrefix: false
    }
  ],

  buildModules: ['@nuxtjs/eslint-module'],

  modules: [
    '@nuxtjs/pwa',
    '@nuxtjs/axios',
    [
      '@nuxtjs/i18n',
      {
        seo: false,
        strategy: 'no_prefix',
        locales: [
          { code: 'en', name: 'English', iso: 'en-US', file: 'en.json' },
          { code: 'ja', name: '日本語', iso: 'ja_JP', file: 'ja.json' },
          { code: 'zh', name: '中文', iso: 'zh-TW', file: 'zh.json' }
        ],
        defaultLocale: 'en',
        langDir: 'locales/',
        lazy: true,
        detectBrowserLanguage: {
          useCookie: true,
          fallbackLocale: 'en'
        }
      }
    ]
  ],

  loading: false,

  pwa: {
    manifest: {
      lang: 'ja',
      name: 'αBooK',
      title: 'αBooK',
      short_name: 'αBooK',
      theme_color: '#ffffff',
      display: 'standalone'
    },
    workbox: {
      offline: false
    }
  },

  build: {
    postcss: {
      preset: {
        autoprefixer: { grid: 'autoplace' }
      }
    }
  }
}
