<template>
  <v-chip 
    v-if="showVersionIndicator"
    size="small" 
    variant="outlined" 
    class="version-indicator"
  >
    <v-icon start size="small">mdi-information-outline</v-icon>
    v{{ appVersion }}
  </v-chip>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: true
  }
})

const showVersionIndicator = computed(() => props.show)
const appVersion = computed(() => {
  return import.meta.env.VITE_APP_VERSION || '1.0.0'
})
</script>

<style scoped>
.version-indicator {
  position: fixed;
  bottom: 16px;
  right: 16px;
  z-index: 1000;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.version-indicator:hover {
  opacity: 1;
}
</style>