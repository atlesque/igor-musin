import { readFileSync, writeFileSync } from 'node:fs'

const pages = JSON.parse(readFileSync('/tmp/igormusin-pages.json', 'utf8'))
const posts = JSON.parse(readFileSync('/tmp/igormusin-posts.json', 'utf8'))
const homeNlHtml = readFileSync('/tmp/igormusin-home.html', 'utf8')
const homeRuHtml = readFileSync('/tmp/igormusin-ru.html', 'utf8')

const SITE_TITLE = 'Musin Igor Nikolaevich'
const PORTRAIT = '/images/originals/DSC04945-2-web.jpg'

const decodeSlug = slug => decodeURIComponent(slug || '')
const stripTags = value => value.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
const extractParagraphs = html =>
  [...html.matchAll(/<p>([\s\S]*?)<\/p>/g)].map(match => match[0].trim())
const contactBodyHtml = locale => locale === 'ru'
  ? [
      '<p>Игорь его сайт поддерживает внук <a href="https://atlesque.dev/">Александр</a>.</p>',
      '<p>По всем вопросам о Игоре и его работе отправьте электронное письмо по адресу: <a href="mailto:alexander@atlesque.media">alexander@atlesque.media</a></p>',
    ]
  : [
      '<p>Igor zijn website wordt onderhouden door kleinzoon <a href="https://atlesque.dev/">Alexander</a>.</p>',
      '<p>Voor alle vragen rond Igor en zijn werk, stuur een e-mail naar: <a href="mailto:alexander@atlesque.media">alexander@atlesque.media</a></p>',
    ]

const getLocaleFromLink = link => link.includes('/ru/') ? 'ru' : 'nl-BE'
const getLocalImage = url => `/images/originals/${url.split('/').pop()}`

const matchMeta = (html, name) => {
  const match = html.match(new RegExp(`<meta[^>]+${name}="description"[^>]+content="([^"]+)"`, 'i'))
  return match?.[1] || ''
}

const matchTitle = html => html.match(/<title>([^<]+)<\/title>/i)?.[1] || SITE_TITLE
const matchIntro = html => html.match(/<div class="textwidget"><p>(.*?)<\/p>/i)?.[1] || ''

const albumOrder = ['album-5', 'album-4', 'album-3', 'album-2']
const albumKeyBySlug = {
  'album-2': 'album-2',
  'album-3': 'album-3',
  'album-4': 'album-4',
  'album-5': 'album-5',
  'альбом-2': 'album-2',
  'альбом-3': 'album-3',
  'альбом-4': 'album-4',
  'альбом-5': 'album-5',
}

const routeKeyBySlug = {
  biografie: 'biography',
  biography: 'biography',
  biografiya: 'biography',
  биография: 'biography',
  contact: 'contact',
  kontakt: 'contact',
  контакт: 'contact',
  'album-2': 'album-2',
  'album-3': 'album-3',
  'album-4': 'album-4',
  'album-5': 'album-5',
  'albom-2': 'album-2',
  'albom-3': 'album-3',
  'albom-4': 'album-4',
  'albom-5': 'album-5',
  'альбом-2': 'album-2',
  'альбом-3': 'album-3',
  'альбом-4': 'album-4',
  'альбом-5': 'album-5',
}

const ruCanonicalSlugByKey = {
  biography: 'biografiya',
  contact: 'kontakt',
  'album-2': 'albom-2',
  'album-3': 'albom-3',
  'album-4': 'albom-4',
  'album-5': 'albom-5',
}

const site = {
  title: SITE_TITLE,
  portrait: {
    src: PORTRAIT,
    alt: 'Portrait of Igor Musin',
  },
  locales: {
    'nl-BE': {
      code: 'nl-BE',
      language: 'nl-BE',
      label: 'Nederlands',
      shortLabel: 'NL',
      basePath: '/',
      homeTitle: matchTitle(homeNlHtml),
      homeDescription: matchMeta(homeNlHtml, 'name'),
      introHtml: `<p>${matchIntro(homeNlHtml)}</p>`,
      navigation: [
        { label: 'Biografie', to: '/biografie' },
        {
          label: 'Albums',
          children: albumOrder.map(key => ({ label: siteAlbumTitle(key, 'nl-BE'), to: `/${key}` })),
        },
        { label: 'Contact', to: '/contact' },
      ],
      switchLabel: 'Русский',
      aliases: {
        '': 'home',
        biografie: 'biography',
        contact: 'contact',
        'album-2': 'album-2',
        'album-3': 'album-3',
        'album-4': 'album-4',
        'album-5': 'album-5',
      },
    },
    ru: {
      code: 'ru',
      language: 'ru-RU',
      label: 'Русский',
      shortLabel: 'RU',
      basePath: '/ru',
      homeTitle: 'Musin Igor Nikolaevich - Картины, рисунки и произведения искусства',
      homeDescription: 'Биография и работы Игоря Мусина из Украины, живущего в Брюгге, Бельгия.',
      introHtml: `<p>${matchIntro(homeRuHtml)}</p>`,
      navigation: [
        { label: 'Биография', to: '/ru/biografiya' },
        {
          label: 'Альбомы',
          children: albumOrder.map(key => ({ label: siteAlbumTitle(key, 'ru'), to: `/ru/${ruCanonicalSlugByKey[key]}` })),
        },
        { label: 'Контакт', to: '/ru/kontakt' },
      ],
      switchLabel: 'Nederlands',
      aliases: {
        '': 'home',
        biografiya: 'biography',
        биография: 'biography',
        kontakt: 'contact',
        контакт: 'contact',
        'albom-2': 'album-2',
        'albom-3': 'album-3',
        'albom-4': 'album-4',
        'albom-5': 'album-5',
        'альбом-2': 'album-2',
        'альбом-3': 'album-3',
        'альбом-4': 'album-4',
        'альбом-5': 'album-5',
      },
    },
  },
  pages: {},
  albums: {},
}

for (const page of pages) {
  const locale = getLocaleFromLink(page.link)
  const slug = decodeSlug(page.slug)
  const key = routeKeyBySlug[slug]

  if (!key) {
    continue
  }

  if (key === 'biography' || key === 'contact') {
    site.pages[`${locale}:${key}`] = {
      key,
      locale,
      title: stripTags(page.title.rendered),
      description:
        key === 'biography'
          ? locale === 'ru'
            ? 'Биография Игоря Мусина.'
            : 'Biografie van Igor Musin.'
          : locale === 'ru'
            ? 'Контактная информация по вопросам о работах Игоря Мусина.'
            : 'Contactinformatie voor vragen over het werk van Igor Musin.',
      path: locale === 'ru'
        ? `/${ruCanonicalSlugByKey[key]}`
        : slug === 'contact'
          ? '/contact'
          : '/biografie',
      bodyHtml: key === 'contact'
        ? contactBodyHtml(locale)
        : extractParagraphs(page.content.rendered),
    }
  }
}

for (const post of posts) {
  const locale = getLocaleFromLink(post.link)
  const slug = decodeSlug(post.slug)
  const key = albumKeyBySlug[slug]

  if (!key || site.albums[`${locale}:${key}`]) {
    continue
  }

  const images = [...post.content.rendered.matchAll(/href='(https:\/\/igormusin\.com\/wp-content\/uploads\/[^']+)'/g)]
    .map(match => match[1])
    .map(url => ({
      src: getLocalImage(url),
      full: getLocalImage(url),
      alt: `${stripTags(post.title.rendered)} artwork`,
    }))

  site.albums[`${locale}:${key}`] = {
    key,
    locale,
    title: stripTags(post.title.rendered),
    description:
      locale === 'ru'
        ? `${stripTags(post.title.rendered)}. Галерея работ Игоря Мусина.`
        : `${stripTags(post.title.rendered)}. Galerij met werk van Igor Musin.`,
    path: locale === 'ru' ? `/${ruCanonicalSlugByKey[key]}` : `/${key}`,
    date: post.date,
    cover: images[0]?.src || PORTRAIT,
    images,
  }
}

for (const locale of ['nl-BE', 'ru']) {
  site.pages[`${locale}:home`] = {
    key: 'home',
    locale,
    title: site.locales[locale].homeTitle,
    description: site.locales[locale].homeDescription,
    path: '/',
    introHtml: site.locales[locale].introHtml,
    albumKeys: albumOrder,
  }
}

writeFileSync('content/site.json', `${JSON.stringify(site, null, 2)}\n`)

function siteAlbumTitle(key, locale) {
  const albumNumber = key.split('-').pop()
  return locale === 'ru' ? `Альбом ${albumNumber}` : `Album ${albumNumber}`
}
