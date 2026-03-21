// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // MDC components used in Nuxt Content markdown files can be single-word
  {
    files: ['app/components/content/**'],
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
)
