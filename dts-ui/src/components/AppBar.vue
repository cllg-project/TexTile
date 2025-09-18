<template>
  <v-app-bar app color="secondary" density="comfortable">
    <v-container class="d-flex align-center">
      <RouterLink to="/" class="text-decoration-none">
        <v-app-bar-title class="text-h6 font-weight-bold text-white">DTS‑UI</v-app-bar-title>
      </RouterLink>
      <v-spacer />
      <v-btn variant="text" to="/catalog" class="text-white">Browse Library</v-btn>
      <v-btn variant="text" to="/search" class="text-white">Text Search</v-btn>
      <v-divider vertical class="mx-2" />
      <v-btn icon @click="toggleTheme" :title="`Switch to ${nextTheme} mode`">
        <v-icon class="text-white">{{ isDark ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent' }}</v-icon>
      </v-btn>
    </v-container>
  </v-app-bar>
</template>
<script setup>
import { computed } from 'vue'
import { useTheme } from 'vuetify'
const theme = useTheme()
const isDark = computed(() => theme.global.current.value.dark)
const nextTheme = computed(() => theme.global.name.value === 'dark' ? 'light' : 'dark')
function toggleTheme(){ theme.global.name.value = nextTheme.value }
</script>