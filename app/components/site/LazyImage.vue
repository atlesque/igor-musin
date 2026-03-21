<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'

const loadedImageSources = new Set<string>()

const props = withDefaults(defineProps<{
  src: string
  alt: string
  aspectRatio?: string
  sizes?: string
}>(), {
  aspectRatio: '1 / 1',
  sizes: '100vw',
})

const frame = ref<HTMLElement | null>(null)
const shouldLoad = ref(false)
const isLoaded = ref(false)
const isVisible = ref(false)

let observer: IntersectionObserver | null = null
let visibilityFrame = 0

const disconnectObserver = () => {
  observer?.disconnect()
  observer = null
}

const markVisibleSoon = () => {
  cancelAnimationFrame(visibilityFrame)
  visibilityFrame = requestAnimationFrame(() => {
    visibilityFrame = requestAnimationFrame(() => {
      isVisible.value = true
    })
  })
}

const startLoading = () => {
  shouldLoad.value = true
}

const onLoad = () => {
  isLoaded.value = true
  loadedImageSources.add(props.src)
  markVisibleSoon()
}

const setupLoading = () => {
  disconnectObserver()
  cancelAnimationFrame(visibilityFrame)

  if (loadedImageSources.has(props.src)) {
    shouldLoad.value = true
    isLoaded.value = true
    isVisible.value = true
    return
  }

  shouldLoad.value = false
  isLoaded.value = false
  isVisible.value = false

  if (!frame.value) {
    return
  }

  if (typeof IntersectionObserver === 'undefined') {
    startLoading()
    return
  }

  observer = new IntersectionObserver((entries) => {
    if (entries.some(entry => entry.isIntersecting)) {
      startLoading()
      disconnectObserver()
    }
  }, {
    rootMargin: '240px 0px',
    threshold: 0.01,
  })

  observer.observe(frame.value)
}

onMounted(() => {
  setupLoading()
})

watch(() => props.src, () => {
  setupLoading()
})

onBeforeUnmount(() => {
  disconnectObserver()
  cancelAnimationFrame(visibilityFrame)
})
</script>

<template>
  <div
    ref="frame"
    class="lazy-image"
    :class="{
      'lazy-image--loaded': isLoaded,
      'lazy-image--visible': isVisible,
    }"
    :style="{ '--lazy-image-aspect-ratio': aspectRatio }"
  >
    <div
      v-if="!isLoaded"
      class="lazy-image__skeleton"
      aria-hidden="true"
    />

    <img
      v-if="shouldLoad"
      class="lazy-image__media"
      :src="src"
      :alt="alt"
      :sizes="sizes"
      decoding="async"
      @load="onLoad"
    >
  </div>
</template>
