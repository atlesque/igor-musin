export interface NavItem {
  label: string
  to?: string
  children?: NavItem[]
}

export interface LocaleConfig {
  code: string
  language: string
  label: string
  shortLabel: string
  basePath: string
  homeTitle: string
  homeDescription: string
  introHtml: string
  navigation: NavItem[]
  switchLabel: string
  aliases: Record<string, string>
}

export interface BasePage {
  key: string
  locale: string
  title: string
  description: string
  path: string
}

export interface TextPage extends BasePage {
  bodyHtml: string[]
}

export interface HomePage extends BasePage {
  introHtml: string
  albumKeys: string[]
}

export interface GalleryImage {
  src: string
  full: string
  alt: string
}

export interface AlbumPage extends BasePage {
  date: string
  cover: string
  images: GalleryImage[]
}

export interface SiteDocument {
  title: string
  portrait: {
    src: string
    alt: string
  }
  locales: Record<string, LocaleConfig>
  pages: Record<string, TextPage | HomePage>
  albums: Record<string, AlbumPage>
}
