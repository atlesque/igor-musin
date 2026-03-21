<script setup lang="ts">
import type { NavItem } from '~/app/types/site'

defineProps<{
  items: NavItem[]
}>()
</script>

<template>
  <nav
    class="sidebar-nav"
    aria-label="Primary"
  >
    <ul class="sidebar-nav__list">
      <li
        v-for="item in items"
        :key="item.label"
        class="sidebar-nav__item"
      >
        <NuxtLink
          v-if="item.to"
          class="sidebar-nav__link"
          :to="item.to"
        >
          {{ item.label }}
        </NuxtLink>

        <details
          v-else-if="item.children?.length"
          class="sidebar-nav__group"
          open
        >
          <summary class="sidebar-nav__summary">
            <span>{{ item.label }}</span>
            <span
              class="sidebar-nav__toggle"
              aria-hidden="true"
            />
          </summary>
          <ul class="sidebar-nav__sublist">
            <li
              v-for="child in item.children"
              :key="child.label"
              class="sidebar-nav__subitem"
            >
              <NuxtLink
                class="sidebar-nav__link"
                :to="child.to"
              >
                {{ child.label }}
              </NuxtLink>
            </li>
          </ul>
        </details>
      </li>
    </ul>
  </nav>
</template>
