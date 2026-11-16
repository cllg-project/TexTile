<template>
  <ul class="bars">
    <li v-for="item in items" :key="item.key ?? item.label" class="bar-row">
      <span class="bar-label" :title="item.title || item.label">
        <RouterLink v-if="item.to" :to="item.to">{{ item.label }}</RouterLink>
        <template v-else>{{ item.label }}</template>
      </span>
      <span class="bar-track" aria-hidden="true">
        <span class="bar-fill" :style="{ width: width(item.value) }" />
      </span>
      <span class="bar-value">{{ item.display }}</span>
    </li>
  </ul>
</template>

<script setup>
import { computed } from 'vue'

// items: [{ key?, label, value: number | null, display: string, title?, to? }]
const props = defineProps({ items: { type: Array, required: true } })

const max = computed(() => Math.max(0, ...props.items.map((i) => i.value || 0)))
function width(value) {
  if (!value || !max.value) return '0%'
  return `${Math.max(1, (value / max.value) * 100)}%`
}
</script>

<style scoped>
.bars { list-style: none; margin: 0; padding: 0; }
.bar-row {
  display: grid;
  grid-template-columns: minmax(90px, 34%) 1fr auto;
  align-items: center;
  gap: 10px;
  padding: 3px 0;
  font-size: 0.9rem;
}
.bar-label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-family: 'Junicode', ui-serif, serif; }
.bar-label a { color: inherit; text-decoration: none; }
.bar-label a:hover { color: rgb(var(--v-theme-primary)); text-decoration: underline; }
.bar-track { height: 10px; background: rgba(var(--v-border-color), 0.12); border-radius: 2px; overflow: hidden; }
.bar-fill { display: block; height: 100%; background: rgb(var(--v-theme-primary)); border-radius: 2px; }
.bar-value { font-variant-numeric: tabular-nums; min-width: 4.5em; text-align: right; opacity: 0.85; }
</style>
