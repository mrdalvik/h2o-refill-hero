import { createI18n } from 'vue-i18n'
import { STORAGE_KEYS } from '@/constants/storageKeys'
import ru from './locales/ru'
import uk from './locales/uk'
import be from './locales/be'
import kk from './locales/kk'
import uz from './locales/uz'
import az from './locales/az'
import hy from './locales/hy'
import ka from './locales/ka'
import ky from './locales/ky'
import tg from './locales/tg'
import tk from './locales/tk'
import ro from './locales/ro'
import en from './locales/en'
import zh from './locales/zh'
import es from './locales/es'
import hi from './locales/hi'
import pt from './locales/pt'
import ja from './locales/ja'
import de from './locales/de'
import fr from './locales/fr'
import it from './locales/it'

export const SUPPORTED_LOCALES = {
  ru: 'Русский',
  uk: 'Українська',
  be: 'Беларуская',
  kk: 'Қазақша',
  uz: 'O\'zbekcha',
  az: 'Azərbaycan',
  hy: 'Հայերեն',
  ka: 'ქართული',
  ky: 'Кыргызча',
  tg: 'Тоҷикӣ',
  tk: 'Türkmençe',
  ro: 'Română',
  en: 'English',
  zh: '中文',
  es: 'Español',
  hi: 'हिन्दी',
  pt: 'Português',
  ja: '日本語',
  de: 'Deutsch',
  fr: 'Français',
  it: 'Italiano',
} as const

export type SupportedLocale = keyof typeof SUPPORTED_LOCALES

const LOCALE_ENGLISH_NAMES: Record<SupportedLocale, string> = {
  ru: 'Russian',
  uk: 'Ukrainian',
  be: 'Belarusian',
  kk: 'Kazakh',
  uz: 'Uzbek',
  az: 'Azerbaijani',
  hy: 'Armenian',
  ka: 'Georgian',
  ky: 'Kyrgyz',
  tg: 'Tajik',
  tk: 'Turkmen',
  ro: 'Romanian',
  en: 'English',
  zh: 'Chinese',
  es: 'Spanish',
  hi: 'Hindi',
  pt: 'Portuguese',
  ja: 'Japanese',
  de: 'German',
  fr: 'French',
  it: 'Italian',
}

export const SORTED_LOCALES = (Object.entries(SUPPORTED_LOCALES) as [SupportedLocale, string][])
  .sort(([a], [b]) => {
    if (a === 'en') return -1
    if (b === 'en') return 1
    return LOCALE_ENGLISH_NAMES[a].localeCompare(LOCALE_ENGLISH_NAMES[b])
  })

function detectLocale(): SupportedLocale {
  const saved = localStorage.getItem(STORAGE_KEYS.LOCALE)
  if (saved && saved in SUPPORTED_LOCALES) {
    return saved as SupportedLocale
  }

  const browserLang = navigator.language.split('-')[0]
  if (browserLang in SUPPORTED_LOCALES) {
    return browserLang as SupportedLocale
  }

  return 'en'
}

export function saveLocale(locale: SupportedLocale) {
  localStorage.setItem(STORAGE_KEYS.LOCALE, locale)
}

const i18n = createI18n({
  legacy: false,
  locale: detectLocale(),
  fallbackLocale: 'en',
  messages: { ru, uk, be, kk, uz, az, hy, ka, ky, tg, tk, ro, en, zh, es, hi, pt, ja, de, fr, it },
})

export default i18n
