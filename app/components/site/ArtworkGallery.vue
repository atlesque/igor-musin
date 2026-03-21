<script setup lang="ts">
import type { GalleryImage } from '~/app/types/site'

const props = defineProps<{
  title: string
  images: GalleryImage[]
}>()

const activeIndex = ref<number | null>(null)

const activeImage = computed(() => {
  if (activeIndex.value === null) {
    return null
  }

  return props.images[activeIndex.value]
})

const openLightbox = (index: number) => {
  activeIndex.value = index
}

const closeLightbox = () => {
  activeIndex.value = null
}

const showNext = () => {
  if (activeIndex.value === null) {
    return
  }

  activeIndex.value = (activeIndex.value + 1) % props.images.length
}

const showPrevious = () => {
  if (activeIndex.value === null) {
    return
  }

  activeIndex.value = (activeIndex.value - 1 + props.images.length) % props.images.length
}
</script>

<template>
  <section class="gallery-block">
    <div class="gallery-grid">
      <button
        v-for="(image, index) in images"
        :key="`${image.src}-${index}`"
        class="gallery-grid__item"
        type="button"
        :aria-label="`Open ${title} image ${index + 1}`"
        @click="openLightbox(index)"
      >
        <SiteLazyImage
          :src="image.src"
          :alt="image.alt"
          aspect-ratio="1550 / 2200"
          sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw"
        />
      </button>
    </div>

    <SiteLightboxModal
      v-if="activeImage && activeIndex !== null"
      :image="activeImage"
      :current-index="activeIndex"
      :total="images.length"
      @close="closeLightbox"
      @next="showNext"
      @previous="showPrevious"
    />
  </section>
</template>
