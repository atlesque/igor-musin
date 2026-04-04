// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devServer: {
    port: 8110,
  },
  modules: [
    '@nuxt/content',
    '@nuxtjs/i18n',
    '@nuxt/eslint',
  ],
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'alternate icon', href: '/favicon.ico' },
      ],
    },
  },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      siteUrl: 'https://igormusin.com',
    },
  },
  i18n: {
    defaultLocale: 'nl-BE',
    strategy: 'prefix_except_default',
    customRoutes: 'meta',
    detectBrowserLanguage: false,
    locales: [
      {
        code: 'nl-BE',
        language: 'nl-BE',
        name: 'Nederlands',
      },
      {
        code: 'ru',
        language: 'ru-RU',
        name: 'Русский',
      },
    ],
  },
  devtools: { enabled: true },
  compatibilityDate: '2024-04-03',
})
