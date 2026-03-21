<script setup lang="ts">
defineProps<{
  label: string
  to: string
}>()
</script>

<template>
  <NuxtLink
    class="language-switcher"
    :to="to"
  >
    {{ label }}
  </NuxtLink>
</template>
