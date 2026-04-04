<script setup lang="ts">
import type { GalleryImage } from '../../types/site'

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

const swipeStartX = ref<number | null>(null)
const swipeStartY = ref<number | null>(null)

const resetSwipe = () => {
  swipeStartX.value = null
  swipeStartY.value = null
}

const onTouchStart = (event: TouchEvent) => {
  if (event.touches.length !== 1) {
    resetSwipe()
    return
  }

  const touch = event.touches.item(0)
  if (!touch) {
    resetSwipe()
    return
  }

  const { clientX, clientY } = touch
  swipeStartX.value = clientX
  swipeStartY.value = clientY
}

const onTouchEnd = (event: TouchEvent) => {
  if (swipeStartX.value === null || swipeStartY.value === null) {
    return
  }

  const touch = event.changedTouches.item(0)
  if (!touch) {
    resetSwipe()
    return
  }

  const { clientX, clientY } = touch
  const deltaX = clientX - swipeStartX.value
  const deltaY = clientY - swipeStartY.value

  resetSwipe()

  const isHorizontalSwipe = Math.abs(deltaX) > 48 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2

  if (!isHorizontalSwipe) {
    return
  }

  if (deltaX < 0) {
    emit('next')
    return
  }

  emit('previous')
}

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
      @touchstart="onTouchStart"
      @touchend="onTouchEnd"
      @touchcancel="resetSwipe"
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
