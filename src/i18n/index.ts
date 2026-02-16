import { createI18n } from 'vue-i18n'
import ru from './locales/ru'
import en from './locales/en'
import zh from './locales/zh'
import es from './locales/es'
import hi from './locales/hi'
import pt from './locales/pt'
import ja from './locales/ja'
import de from './locales/de'
import fr from './locales/fr'

export const SUPPORTED_LOCALES = {
  ru: 'Русский',
  en: 'English',
  zh: '中文',
  es: 'Español',
  hi: 'हिन्दी',
  pt: 'Português',
  ja: '日本語',
  de: 'Deutsch',
  fr: 'Français',
} as const

export type SupportedLocale = keyof typeof SUPPORTED_LOCALES

const STORAGE_KEY = 'h2o-locale'

function detectLocale(): SupportedLocale {
  const saved = localStorage.getItem(STORAGE_KEY)
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
  localStorage.setItem(STORAGE_KEY, locale)
}

const i18n = createI18n({
  legacy: false,
  locale: detectLocale(),
  fallbackLocale: 'en',
  messages: { ru, en, zh, es, hi, pt, ja, de, fr },
})

export default i18n
