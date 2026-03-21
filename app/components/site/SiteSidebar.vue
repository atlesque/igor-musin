<script setup lang="ts">
import { watch } from 'vue'
import type { LocaleConfig } from '~/app/types/site'

const props = defineProps<{
  siteTitle: string
  portrait: {
    src: string
    alt: string
  }
  localeConfig: LocaleConfig
  switchTo: string
}>()

const route = useRoute()
const isMenuOpen = ref(false)
const mobilePanelId = 'site-sidebar-panel'

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function closeMenu() {
  isMenuOpen.value = false
}

function handlePanelClick(event: MouseEvent) {
  const target = event.target

  if (!(target instanceof Element))
    return

  if (target.closest('a'))
    closeMenu()
}

watch(() => route.fullPath, closeMenu)
</script>

<template>
  <aside
    class="site-sidebar"
    :class="{ 'site-sidebar--menu-open': isMenuOpen }"
  >
    <header class="site-sidebar__header">
      <div class="site-sidebar__topbar">
        <NuxtLink
          class="site-sidebar__title"
          :to="props.localeConfig.basePath"
          @click="closeMenu"
        >
          {{ props.siteTitle }}
        </NuxtLink>

        <button
          class="site-sidebar__menu-button"
          type="button"
          :aria-controls="mobilePanelId"
          :aria-expanded="isMenuOpen ? 'true' : 'false'"
          @click="toggleMenu"
        >
          <span class="site-sidebar__menu-label">Menu</span>
          <span
            class="site-sidebar__menu-icon"
            aria-hidden="true"
          />
        </button>
      </div>
    </header>

    <div
      :id="mobilePanelId"
      class="site-sidebar__panel"
      :class="{ 'site-sidebar__panel--open': isMenuOpen }"
      @click="handlePanelClick"
    >
      <SiteSidebarNav :items="props.localeConfig.navigation" />

      <div class="site-sidebar__widgets">
        <SiteLazyImage
          class="site-sidebar__portrait"
          :src="props.portrait.src"
          :alt="props.portrait.alt"
          aspect-ratio="1473 / 2003"
          sizes="224px"
        />

        <div
          class="site-sidebar__intro"
          v-html="props.localeConfig.introHtml"
        />

        <SiteLanguageSwitcher
          :label="props.localeConfig.switchLabel"
          :to="props.switchTo"
        />
      </div>
    </div>
  </aside>
</template>
