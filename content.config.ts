import { defineContentConfig, defineCollection } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    site: defineCollection({
      type: 'data',
      source: 'site.json',
    }),
  },
})
