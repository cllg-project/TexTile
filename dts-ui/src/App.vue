<template>
  <v-app>
    <AppBar />
      <v-main class="h-100">
      <RouterView />
    </v-main>
    <LanguageIndicator :show="true" />
  </v-app>
</template>
<script setup>
import AppBar from './components/AppBar.vue'
import LanguageIndicator from './components/LanguageIndicator.vue'
</script>