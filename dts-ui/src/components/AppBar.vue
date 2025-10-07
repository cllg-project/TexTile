<template>
  <v-app-bar app color="secondary" density="comfortable">
    <v-container class="d-flex align-center">
      <RouterLink to="/" class="text-decoration-none">
        <v-app-bar-title class="text-h6 font-weight-bold text-white">{{ $t('appTitle') }}</v-app-bar-title>
      </RouterLink>
      <v-spacer />
      <v-btn variant="text" to="/catalog" class="text-white">{{ $t('navigation.browseLibrary') }}</v-btn>
      <v-btn variant="text" to="/search" class="text-white">{{ $t('navigation.textSearch') }}</v-btn>
      <v-btn variant="text" to="/about" class="text-white">{{ $t('navigation.about') }}</v-btn>
      <v-divider vertical class="mx-2" />
      
      <!-- Language Switcher -->
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props" :title="$t('language.switch')">
            <v-icon class="text-white">mdi-translate</v-icon>
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