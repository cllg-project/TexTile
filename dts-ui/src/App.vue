<template>
  <v-app>
    <AppBar />
      <v-main
    class="h-100"
    style="min-width: 1000px"
  >
      <RouterView />
    </v-main>
  </v-app>
</template>
<script setup>
import AppBar from './components/AppBar.vue'
</script>