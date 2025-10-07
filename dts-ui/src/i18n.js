import { createI18n } from 'vue-i18n'
import en from './locales/en.js'
import fr from './locales/fr.js'

// Get saved language or default to English
const savedLocale = (typeof window !== 'undefined' && localStorage.getItem('comma-reader-locale')) || 'en'

const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'en',
  globalInjection: true,
  messages: {
    en,
    fr
  }
})

// Save locale changes to localStorage
export function setLocale(locale) {
  i18n.global.locale.value = locale
  if (typeof window !== 'undefined') {
    localStorage.setItem('comma-reader-locale', locale)
  }
}

export function getCurrentLocale() {
  return i18n.global.locale.value
}

export default i18n