<script setup lang="ts">
import type { AlbumPage } from '~/app/types/site'

defineProps<{
  albums: AlbumPage[]
}>()
</script>

<template>
  <section class="album-feed">
    <article
      v-for="album in albums"
      :key="album.key"
      class="album-card"
    >
      <NuxtLink
        class="album-card__media"
        :to="album.path"
      >
        <SiteLazyImage
          :src="album.cover"
          :alt="album.title"
          aspect-ratio="16 / 10"
          sizes="(max-width: 720px) 100vw, 62ch"
        />
      </NuxtLink>

      <header class="album-card__header">
        <h2>
          <NuxtLink :to="album.path">
            {{ album.title }}
          </NuxtLink>
        </h2>
      </header>
    </article>
  </section>
</template>
