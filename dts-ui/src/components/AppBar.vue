<template>
  <v-app-bar app color="secondary" density="comfortable">
    <v-container class="d-flex align-center" fluid>
      <RouterLink to="/" class="text-decoration-none">
        <v-app-bar-title class="text-h6 font-weight-bold text-white app-title">{{ $t('appTitle') }}</v-app-bar-title>
      </RouterLink>
      <v-spacer />
      
      <!-- Desktop Navigation -->
      <div class="d-none d-md-flex align-center">
        <v-btn variant="text" to="/catalog" class="text-white">{{ $t('navigation.browseLibrary') }}</v-btn>
        <v-btn variant="text" to="/search" class="text-white">{{ $t('navigation.textSearch') }}</v-btn>
        <v-btn variant="text" to="/about" class="text-white">{{ $t('navigation.about') }}</v-btn>
        <v-divider vertical class="mx-2" />
        
        <!-- Language Switcher -->
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn variant="text" v-bind="props" :title="$t('language.switch')" class="text-white language-activator">
              <span class="lang-flag" aria-hidden="true">{{ currentLanguageFlag }}</span>
              <span class="lang-name">{{ currentLanguageName }}</span>
            </v-btn>
          </template>
          <v-list>
            <v-list-item 
              v-for="lang in availableLanguages" 
              :key="lang.code"
              @click="switchLanguage(lang.code)"
              :class="{ 'bg-primary': currentLocale === lang.code }"
            >
              <v-list-item-title>
                <span class="mr-2">{{ lang.flag }}</span>
                {{ lang.name }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        
        <!-- Theme Switcher -->
        <v-btn icon @click="toggleTheme" :title="$t('theme.switchTo', { mode: $t(`theme.${nextTheme}`) })">
          <v-icon class="text-white">{{ isDark ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent' }}</v-icon>
        </v-btn>
      </div>
      
      <!-- Mobile Navigation Menu - Only show on mobile/tablet screens -->
      <div class="d-md-none">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props" class="text-white">
              <v-icon>mdi-menu</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item to="/catalog">
              <v-list-item-title>{{ $t('navigation.browseLibrary') }}</v-list-item-title>
            </v-list-item>
            <v-list-item to="/search">
              <v-list-item-title>{{ $t('navigation.textSearch') }}</v-list-item-title>
            </v-list-item>
            <v-list-item to="/about">
              <v-list-item-title>{{ $t('navigation.about') }}</v-list-item-title>
            </v-list-item>
            <v-divider class="my-2" />
            <v-list-item 
              v-for="lang in availableLanguages" 
              :key="lang.code"
              @click="switchLanguage(lang.code)"
              :class="{ 'bg-primary': currentLocale === lang.code }"
            >
              <v-list-item-title>
                <span class="mr-2">{{ lang.flag }}</span>
                {{ lang.name }}
              </v-list-item-title>
            </v-list-item>
            <v-divider class="my-2" />
            <v-list-item @click="toggleTheme">
              <v-list-item-title>
                <v-icon class="mr-2">{{ isDark ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent' }}</v-icon>
                {{ $t('theme.switchTo', { mode: $t(`theme.${nextTheme}`) }) }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-container>
  </v-app-bar>
</template>
<script setup>
import { computed, onMounted } from 'vue'
import { useTheme } from 'vuetify'
import { useI18n } from 'vue-i18n'
import { setLocale, getCurrentLocale } from '../i18n'

const theme = useTheme()
const { locale } = useI18n()

const isDark = computed(() => theme.global.current.value.dark)
const nextTheme = computed(() => theme.global.name.value === 'dark' ? 'light' : 'dark')
const currentLocale = computed(() => getCurrentLocale())
const currentLanguageName = computed(() => {
  const lang = availableLanguages.find(l => l.code === currentLocale.value)
  return lang ? lang.name : 'English'
})

const currentLanguageFlag = computed(() => {
  const lang = availableLanguages.find(l => l.code === currentLocale.value)
  return lang ? lang.flag : '🏳️'
})

const availableLanguages = [
  { code: 'en', name: 'English', icon: 'mdi-web', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', icon: 'mdi-web', flag: '🇫🇷' }
]

// Theme persistence
const THEME_STORAGE_KEY = 'vuetify-theme'

function toggleTheme() { 
  const newTheme = nextTheme.value
  theme.global.name.value = newTheme
  // Save theme preference to localStorage
  localStorage.setItem(THEME_STORAGE_KEY, newTheme)
}

function switchLanguage(langCode) {
  setLocale(langCode)
}

// Load saved theme on component mount
onMounted(() => {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
  if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
    theme.global.name.value = savedTheme
  }
})
</script>

<style scoped>
.language-activator {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.lang-flag {
  font-size: 18px;
  line-height: 1;
}
.lang-name {
  display: inline-block;
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .app-title {
    font-size: 1rem !important;
  }
}

@media (max-width: 600px) {
  .app-title {
    font-size: 0.9rem !important;
    max-width: 150px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>