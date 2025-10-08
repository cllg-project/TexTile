<template>
  <v-card variant="tonal" class="junicode">
    <v-card-text>
      <div class="d-flex align-center justify-space-between mb-2">
        <div class="text-subtitle-2">CATMuS Medieval keyboard</div>
        <div class="d-flex align-center" style="gap:8px">
          <v-btn size="small" variant="text" @click="$emit('backspace')" title="Backspace">
            ← Backspace
          </v-btn>
          <v-btn size="small" variant="text" @click="$emit('space')" title="Insert space">
            ␣ Space
          </v-btn>
        </div>
      </div>

      <div v-for="(row, rIdx) in orderedRows" :key="rIdx" class="kb-row">
        <div class="kb-keys">
          <v-tooltip
            v-for="(key, i) in row"
            :key="`${rIdx}-${i}-${key.character}`"
            location="top"
          >
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                size="small"
                variant="tonal"
                class="kb-key"
                @click="$emit('insert', key.character)"
                :title="key.legend || key.character"
              >
                {{ displayChar(key.character) }}
              </v-btn>
            </template>
            <span>{{ key.legend || key.character }}</span>
          </v-tooltip>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'
import catmus from '../catmus-medieval.json'

const chars = (catmus?.characters || []).filter(c => !!c.character)

const orderedRows = computed(() => {
  const byRow = new Map()
  for (const c of chars) {
    const row = Number.isFinite(c.row) ? c.row : 0
    if (!byRow.has(row)) byRow.set(row, [])
    byRow.get(row).push(c)
  }
  return Array.from(byRow.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([_, arr]) => arr.sort((a, b) => (a.column ?? 0) - (b.column ?? 0)))
})

// Show dotted-circle for combining marks so they’re visible
const COMBINING_RE = /\p{M}/u
function displayChar(ch){
  return COMBINING_RE.test(ch) ? `◌${ch}` : ch
}
</script>

<style scoped>
.junicode {
  font-family: 'Junicode', ui-serif, serif;
  font-feature-settings: 'liga' 1, 'hlig' 1, 'calt' 0;
}
.kb-row + .kb-row { margin-top: 8px; }
.kb-keys { display: flex; flex-wrap: wrap; gap: 6px; }
.kb-key {
  min-width: 36px;
  font-family: inherit;      /* inherit Junicode */
  font-size: 1.1rem;
  line-height: 1.15;
  text-transform: none !important; /* Ensure no uppercase transformation */
}
</style>