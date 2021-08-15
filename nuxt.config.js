import locales from './locales'

export default {
  publicRuntimeConfig: {
    APP_NAME: process.env.APP_NAME || 'RecipeManager',
    DISABLE_UNIT_CREATION: process.env.DISABLE_UNIT_CREATION,
    DISABLE_FOOD_CREATION: process.env.DISABLE_FOOD_CREATION,
    DISABLE_INGREDIENT_ATTRIBUTE_CREATION:
      process.env.DISABLE_INGREDIENT_ATTRIBUTE_CREATION,
    PLACEHOLDER_IMAGE: process.env.PLACEHOLDER_IMAGE,
    NOT_FOUND_IMAGE: process.env.NOT_FOUND_IMAGE,
    LOCALE_FORMAT: { year: 'numeric', month: '2-digit', day: '2-digit' }
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - ' + process.env.APP_NAME || 'RecipeManager',
    title: process.env.APP_NAME || 'RecipeManager',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@mdi/font/css/materialdesignicons.min.css',
    '~/assets/dialog.scss',
    '~/assets/cursor.scss',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [{ src: '~/plugins/vuetify.ts', ssr: false }],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: {
    dirs: [
      '~/components/',
      {
        path: '~/components/account',
        prefix: 'account',
      },
      {
        path: '~/components/account/user',
        prefix: 'account-user',
      },
      {
        path: '~/components/btn',
        prefix: 'btn',
      },
      {
        path: '~/components/ingredient',
        prefix: 'ingredient',
      },
      {
        path: '~/components/recipe',
        prefix: 'recipe',
      },
      {
        path: '~/components/recipe/property',
        prefix: 'recipe-property',
      },
    ],
  },

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    ['@nuxtjs/vuetify', { iconfont: 'mdi' }],
    // https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://pwa.nuxtjs.org
    '@nuxtjs/pwa',
    // https://i18n.nuxtjs.org
    'nuxt-i18n',
    // https://http.nuxtjs.org
    '@nuxt/http',
    // https://auth.nuxtjs.org
    '@nuxtjs/auth-next',
    // https://github.com/blokwise/dynamic
    '@blokwise/dynamic',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    credentials: true,
    baseURL: process.env.API_URL,
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
    },
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    defaultAssets: {
      icons: false,
    },
    theme: {
      themes: {
        light: {
          primary: '#8462e5',
        },
        dark: {
          primary: '#8462e5',
        },
      },
    },
  },

  i18n: {
    locales: process.env.LOCALES ? process.env.LOCALES.split(',') : [],
    defaultLocale: process.env.LOCALE || 'en',
    vueI18n: {
      fallbackLocale: process.env.LOCALES || 'en',
      messages: locales,
    },
    pages: {
      recipes: {
        en: '/recipes',
        de: '/rezepte',
      },
      'recipes/_id': {
        en: '/recipes/:id?',
        de: '/rezepte/:id?',
      },
    },
  },

  proxy: {},

  auth: {
    strategies: {
      laravelSanctum: {
        provider: 'laravel/sanctum',
        url: process.env.API_URL,
        endpoints: {
          login: { url: '/login', method: 'post' },
          logout: { url: '/logout', method: 'post' },
          user: { url: '/api/user', method: 'get' },
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extractCSS: true,
    optimization: {
      splitChunks: {
        chunks: 'all',
        automaticNameDelimiter: '.',
        name: 'vendor',
        maxSize: 256000,
      },
    },
  },
}
