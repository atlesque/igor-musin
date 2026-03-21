<script setup lang="ts">
defineProps<{
  title: string
  date: string
  locale: string
  images: {
    src: string
    full: string
    alt: string
  }[]
}>()
</script>

<template>
  <article class="content-card">
    <header class="content-card__header">
      <h1>{{ title }}</h1>
      <time
        class="content-card__meta"
        :datetime="date"
      >
        {{ new Intl.DateTimeFormat(locale).format(new Date(date)) }}
      </time>
    </header>

    <SiteArtworkGallery
      :title="title"
      :images="images"
    />
  </article>
</template>
