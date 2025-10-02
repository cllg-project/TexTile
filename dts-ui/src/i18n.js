import { createI18n } from 'vue-i18n'
import en from './locales/en.js'
import fr from './locales/fr.js'

// Get saved language or default to English
const savedLocale = localStorage.getItem('comma-reader-locale') || 'en'

const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'en',
  messages: {
    en,
    fr
  }
})

// Save locale changes to localStorage
export function setLocale(locale) {
  i18n.global.locale.value = locale
  localStorage.setItem('comma-reader-locale', locale)
}

export function getCurrentLocale() {
  return i18n.global.locale.value
}

export default i18n