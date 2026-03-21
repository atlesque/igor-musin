<script setup lang="ts">
import type { AlbumPage, HomePage, SiteDocument, TextPage } from '~/app/types/site'
import siteDataRaw from '~~/content/site.json'

const props = defineProps<{
  localeCode: 'nl-BE' | 'ru'
  slug: string
}>()

const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const site = computed(() => siteDataRaw as SiteDocument)

if (!site.value) {
  throw createError({ statusCode: 500, statusMessage: 'Site content not found', fatal: true })
}

const localeConfig = computed(() => site.value!.locales[props.localeCode])
const pageKey = computed(() => localeConfig.value.aliases[props.slug] || null)

if (!pageKey.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const page = computed(() => {
  if (pageKey.value === 'home') {
    return site.value!.pages[`${props.localeCode}:home`] as HomePage
  }

  return (
    site.value!.pages[`${props.localeCode}:${pageKey.value}`] as TextPage |
    undefined
  ) || (
    site.value!.albums[`${props.localeCode}:${pageKey.value}`] as AlbumPage |
    undefined
  )
})

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const pageType = computed(() => {
  if ('images' in page.value!) {
    return 'album'
  }

  if ('albumKeys' in page.value!) {
    return 'home'
  }

  return 'text'
})

const toLocalePath = (targetLocale: 'nl-BE' | 'ru', localPath: string) => {
  if (targetLocale === 'ru') {
    return localPath === '/' ? '/ru' : `/ru${localPath}`
  }

  return localPath
}

const resolvedAlbums = computed(() => {
  if (!('albumKeys' in page.value!)) {
    return []
  }

  return page.value.albumKeys
    .map((key) => {
      const album = site.value!.albums[`${props.localeCode}:${key}`]

      if (!album) {
        return null
      }

      return {
        ...album,
        path: toLocalePath(props.localeCode, album.path),
      }
    })
    .filter(Boolean)
})

const textPage = computed(() => page.value as TextPage)
const albumPage = computed(() => page.value as AlbumPage)

const alternatePath = computed(() => {
  const targetLocale = props.localeCode === 'ru' ? 'nl-BE' : 'ru'

  if (pageKey.value === 'home') {
    return toLocalePath(targetLocale, '/')
  }

  const alternate =
    site.value!.pages[`${targetLocale}:${pageKey.value}`] ||
    site.value!.albums[`${targetLocale}:${pageKey.value}`]

  return toLocalePath(targetLocale, alternate?.path || '/')
})

const canonicalUrl = computed(() => new URL(route.path || '/', runtimeConfig.public.siteUrl).toString())
const alternateLinks = computed(() => {
  const nlPage = pageKey.value === 'home'
    ? site.value!.pages['nl-BE:home']
    : site.value!.pages[`nl-BE:${pageKey.value}`] || site.value!.albums[`nl-BE:${pageKey.value}`]
  const ruPage = pageKey.value === 'home'
    ? site.value!.pages['ru:home']
    : site.value!.pages[`ru:${pageKey.value}`] || site.value!.albums[`ru:${pageKey.value}`]

  return [
    {
      rel: 'alternate',
      hreflang: 'nl-BE',
      href: new URL(toLocalePath('nl-BE', nlPage?.path || '/'), runtimeConfig.public.siteUrl).toString(),
    },
    {
      rel: 'alternate',
      hreflang: 'ru-RU',
      href: new URL(toLocalePath('ru', ruPage?.path || '/'), runtimeConfig.public.siteUrl).toString(),
    },
  ]
})

const seoImage = computed(() => {
  const image = 'cover' in page.value! ? page.value.cover : site.value!.portrait.src
  return new URL(image, runtimeConfig.public.siteUrl).toString()
})

useHead(() => ({
  htmlAttrs: {
    lang: localeConfig.value.language,
  },
  link: [
    {
      rel: 'canonical',
      href: canonicalUrl.value,
    },
    ...alternateLinks.value,
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(
        pageType.value === 'album'
          ? {
              '@context': 'https://schema.org',
              '@type': 'ImageGallery',
              name: page.value!.title,
              url: canonicalUrl.value,
              inLanguage: localeConfig.value.language,
            }
          : {
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: site.value!.title,
              url: runtimeConfig.public.siteUrl,
              inLanguage: localeConfig.value.language,
            },
      ),
    },
  ],
}))

useSeoMeta({
  title: () => page.value!.title,
  description: () => page.value!.description,
  ogTitle: () => page.value!.title,
  ogDescription: () => page.value!.description,
  ogImage: () => seoImage.value,
  ogUrl: () => canonicalUrl.value,
  ogType: () => pageType.value === 'album' ? 'article' : 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: () => page.value!.title,
  twitterDescription: () => page.value!.description,
  twitterImage: () => seoImage.value,
  robots: 'index, follow',
})
</script>

<template>
  <SiteLayout
    :site-title="site!.title"
    :portrait="site!.portrait"
    :locale-config="localeConfig"
    :switch-to="alternatePath"
  >
    <SiteHomeAlbums
      v-if="pageType === 'home'"
      :albums="resolvedAlbums"
    />

    <SitePageText
      v-else-if="pageType === 'text'"
      :title="page!.title"
      :body-html="textPage.bodyHtml"
    />

    <SiteAlbumPageView
      v-else
      :title="page!.title"
      :date="albumPage.date"
      :locale="localeConfig.language"
      :images="albumPage.images"
    />
  </SiteLayout>
</template>
