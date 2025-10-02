<template>
  <v-chip 
    v-if="showLanguageIndicator"
    size="small" 
    variant="outlined" 
    class="language-indicator"
  >
    <v-icon start size="small">mdi-translate</v-icon>
    {{ getCurrentLanguageName() }}
  </v-chip>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { getCurrentLocale } from '../i18n'

const props = defineProps({
  show: {
    type: Boolean,
    default: true
  }
})

const { t } = useI18n()
const currentLocale = computed(() => getCurrentLocale())
const showLanguageIndicator = computed(() => props.show)

const languages = {
  en: 'English',
  fr: 'Français'
}

function getCurrentLanguageName() {
  return languages[currentLocale.value] || currentLocale.value
}
</script>

<style scoped>
.language-indicator {
  position: fixed;
  bottom: 16px;
  right: 16px;
  z-index: 1000;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.language-indicator:hover {
  opacity: 1;
}
</style>