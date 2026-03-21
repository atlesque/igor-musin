<script setup lang="ts">
import type { LocaleConfig } from '~/app/types/site'

defineProps<{
  siteTitle: string
  portrait: {
    src: string
    alt: string
  }
  localeConfig: LocaleConfig
  switchTo: string
}>()
</script>

<template>
  <div class="site-shell">
    <div class="site-shell__inner">
      <SiteSidebar
        :site-title="siteTitle"
        :portrait="portrait"
        :locale-config="localeConfig"
        :switch-to="switchTo"
      />

      <main class="site-main-content">
        <slot />
      </main>
    </div>
  </div>
</template>
