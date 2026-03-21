// @ts-check
import tsParser from '@typescript-eslint/parser'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tsParser,
      },
    },
  },
  // MDC components used in Nuxt Content markdown files can be single-word
  {
    files: ['app/components/content/**'],
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
  {
    files: ['app/components/site/PageText.vue', 'app/components/site/SiteSidebar.vue'],
    rules: {
      'vue/no-v-html': 'off',
    },
  },
)
