<script setup lang="ts">
defineProps<{
  title: string
  bodyHtml: string[]
}>()
</script>

<template>
  <article class="content-card content-card--text">
    <header class="content-card__header">
      <h1>{{ title }}</h1>
    </header>

    <div class="prose-content">
      <div
        v-for="(paragraph, index) in bodyHtml"
        :key="index"
        v-html="paragraph"
      />
    </div>
  </article>
</template>
