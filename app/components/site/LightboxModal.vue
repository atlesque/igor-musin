<script setup lang="ts">
import type { GalleryImage } from '~/app/types/site'

const props = defineProps<{
  image: GalleryImage
  currentIndex: number
  total: number
}>()

const emit = defineEmits<{
  close: []
  next: []
  previous: []
}>()

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    emit('close')
  }
  else if (event.key === 'ArrowRight') {
    emit('next')
  }
  else if (event.key === 'ArrowLeft') {
    emit('previous')
  }
}

watchEffect((onCleanup) => {
  document.addEventListener('keydown', onKeydown)
  document.body.style.overflow = 'hidden'

  onCleanup(() => {
    document.removeEventListener('keydown', onKeydown)
    document.body.style.overflow = ''
  })
})
</script>

<template>
  <Teleport to="body">
    <div
      class="lightbox"
      role="dialog"
      aria-modal="true"
      :aria-label="image.alt"
      @click.self="emit('close')"
    >
      <button
        class="lightbox__close"
        type="button"
        aria-label="Close image"
        @click="emit('close')"
      >
        ×
      </button>

      <button
        class="lightbox__nav lightbox__nav--prev"
        type="button"
        aria-label="Previous image"
        @click="emit('previous')"
      >
        ‹
      </button>

      <figure class="lightbox__figure">
        <img
          class="lightbox__image"
          :src="props.image.full"
          :alt="props.image.alt"
        >
        <figcaption class="lightbox__caption">
          {{ currentIndex + 1 }} / {{ total }}
        </figcaption>
      </figure>

      <button
        class="lightbox__nav lightbox__nav--next"
        type="button"
        aria-label="Next image"
        @click="emit('next')"
      >
        ›
      </button>
    </div>
  </Teleport>
</template>
