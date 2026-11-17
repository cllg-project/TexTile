<template>
  <article class="ms-row">
    <div class="ms-actions">
      <v-btn size="small" variant="tonal" color="primary" :to="{ name: 'document', params: { resource: encodeURIComponent(item.id) } }">
        {{ $t('browse.read') }}
      </v-btn>
    </div>
    <div class="ms-main">
      <RouterLink class="ms-title" :to="{ name: 'document', params: { resource: encodeURIComponent(item.id) } }">
        <span v-html="item.titleHtml" />
      </RouterLink>
      <div class="ms-meta">
        <v-chip
          v-for="l in item.languages"
          :key="l"
          size="x-small"
          label
          variant="tonal"
          :color="getLanguageColor(formatLanguage(l, t))"
        >{{ formatLanguage(l, t) }}</v-chip>
        <span v-if="years" class="ms-years">{{ years }}</span>
        <span v-if="item.pages != null">{{ $t('browse.pages', { count: $n(item.pages) }, item.pages) }}</span>
        <span v-if="item.tokens != null">{{ $t('browse.tokens', { count: $n(item.tokens) }) }}</span>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatYears } from '../lib/catalog'
import { formatLanguage, getLanguageColor } from '../lib/language-utils'

const { t } = useI18n()
const props = defineProps({ item: { type: Object, required: true } })
const years = computed(() => formatYears(props.item.start, props.item.stop))
</script>

<style scoped>
.ms-row {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;
  padding: 14px 4px;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.ms-main { min-width: 0; }
.ms-actions { flex: none; }
.ms-title {
  display: inline-block;
  font-weight: 500;
  font-size: 1.05rem;
  line-height: 1.35;
  color: inherit;
  text-decoration: none;
}
.ms-title:hover { color: rgb(var(--v-theme-primary)); text-decoration: underline; }
.ms-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 12px;
  margin-top: 6px;
  font-size: 0.85rem;
  opacity: 0.8;
}
.ms-years { font-variant-numeric: tabular-nums; }
:deep(mark.dts-hit) { background: #ffe9a8; color: inherit; padding: 0 1px; border-radius: 2px; }
@media (max-width: 600px) {
  .ms-row { flex-direction: column; align-items: flex-start; }
}
</style>
