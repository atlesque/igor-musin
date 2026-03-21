<script setup lang="ts">
definePageMeta({
  i18n: {
    paths: {
      'nl-BE': '/',
      ru: '/',
    },
  },
})

const { locale } = useI18n()
const localeCode = computed(() => locale.value === 'ru' ? 'ru' : 'nl-BE')
</script>

<template>
  <SitePage
    :locale-code="localeCode"
    slug=""
  />
</template>
