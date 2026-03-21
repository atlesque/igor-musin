<script setup lang="ts">
definePageMeta({
  i18n: {
    paths: {
      'nl-BE': '/[slug]',
      ru: '/[slug]',
    },
  },
})

const route = useRoute()
const { locale } = useI18n()
const localeCode = computed(() => locale.value === 'ru' ? 'ru' : 'nl-BE')
const slug = computed(() => decodeURIComponent(String(route.params.slug || '')))
</script>

<template>
  <SitePage
    :locale-code="localeCode"
    :slug="slug"
  />
</template>
