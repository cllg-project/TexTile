<template>
  <div>
    <div class="conc-controls">
      <v-btn-toggle v-model="width" mandatory density="compact" variant="outlined" :aria-label="$t('search.concWidth')">
        <v-btn v-for="w in widths" :key="w" :value="w" size="small">{{ w }}</v-btn>
      </v-btn-toggle>
      <span class="conc-hint">{{ $t('search.concWidth') }}</span>
      <v-spacer />
      <v-btn
        v-if="params"
        :href="csvHref"
        download
        size="small"
        variant="text"
        color="primary"
        prepend-icon="mdi-file-delimited-outline"
        :title="$t('search.exportConcordanceHint')"
      >{{ $t('search.exportConcordance') }}</v-btn>
      <v-select
        v-model="size"
        :items="sizes"
        :label="$t('search.concPageSize')"
        density="compact"
        variant="outlined"
        hide-details
        class="conc-size"
      />
      <v-select
        v-model="sortKey"
        :items="sortItems"
        :label="$t('search.concSort')"
        density="compact"
        variant="outlined"
        hide-details
        class="conc-sort"
      />
    </div>

    <v-progress-linear v-if="loading" indeterminate color="primary" class="my-4" />
    <v-alert v-else-if="error" type="error" variant="tonal" density="compact" class="my-4">{{ error }}</v-alert>

    <template v-else-if="data">
      <p v-if="!rows.length" class="empty">{{ $t('search.noResults') }}</p>
      <template v-else>
        <p class="summary" role="status">
          {{ $t('search.concSummary', { pages: $n(data.total_pages), rows: $n(rows.length) }) }}
        </p>
        <v-alert v-if="data.capped" type="info" variant="tonal" density="compact" class="mb-3">
          {{ $t('search.concCapped', { count: $n(data.pages * data.size) }) }}
        </v-alert>
        <div class="kwic" role="table" :aria-label="$t('search.tabConcordance')">
          <div v-for="(row, i) in rows" :key="`${row.collection}-${row.ref}-${i}`" class="kwic-row" role="row">
            <span class="kwic-ref" role="cell">
              <RouterLink :to="toDoc(row)" :title="row.manuscript">{{ row.ref }}</RouterLink>
              <small>{{ shelfmark(row.manuscript) }}</small>
            </span>
            <span class="kwic-left" role="cell"><span>{{ row.left }}</span></span>
            <span class="kwic-key" role="cell">{{ row.keyword }}</span>
            <span class="kwic-right" role="cell">{{ row.right }}</span>
          </div>
        </div>
        <v-pagination
          v-if="data.pages > 1"
          :model-value="page"
          :length="data.pages"
          :total-visible="7"
          class="mt-4"
          @update:model-value="goTo"
        />
      </template>
    </template>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { concordanceUrl, fetchConcordance } from '../api/dts'
import { shelfmark } from '../lib/catalog'

// params: the search to show ({ q, mode, language }); active: loaded only when the tab is open
const props = defineProps({
  params: { type: Object, default: null },
  active: { type: Boolean, default: false },
})

const { t } = useI18n()
const widths = [20, 40, 80]
const sizes = [25, 50, 100] // matching pages per page: each brings all its occurrences, so rows per page vary
const size = ref(50)
const width = ref(40)
const page = ref(1)
const sortKey = ref('order')
const loading = ref(false)
const error = ref('')
const data = ref(null)
let loadedKey = ''
let controller = null

const csvHref = computed(() => (props.params ? concordanceUrl(props.params) : ''))

const sortItems = computed(() => [
  { title: t('search.concSortOrder'), value: 'order' },
  { title: t('search.concSortLeft'), value: 'left' },
  { title: t('search.concSortRight'), value: 'right' },
])

// accent- and case-insensitive, so "ꝑ" and "p" don't scatter the alphabetical order
const fold = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
const reverse = (s) => [...fold(s)].reverse().join('')

// Sorting reorders the rows of the page on screen; the concordance itself stays in reading order
const rows = computed(() => {
  const list = [...(data.value?.rows || [])]
  if (sortKey.value === 'right') list.sort((a, b) => fold(a.right).localeCompare(fold(b.right)))
  // left context is read backwards from the keyword, so sort on it reversed
  else if (sortKey.value === 'left') list.sort((a, b) => reverse(a.left).localeCompare(reverse(b.left)))
  return list
})

function toDoc(row) {
  return {
    name: 'documentRef',
    params: { resource: encodeURIComponent(row.collection), ref: row.ref },
    query: { highlight: props.params?.q },
  }
}

async function load() {
  if (!props.params) return
  controller?.abort()
  controller = new AbortController()
  loading.value = true
  error.value = ''
  try {
    data.value = await fetchConcordance({ ...props.params, width: width.value }, { page: page.value, size: size.value, signal: controller.signal })
    loadedKey = key()
  } catch (e) {
    if (e.name !== 'AbortError') error.value = e?.message || String(e)
  } finally {
    loading.value = false
  }
}

const key = () => JSON.stringify([props.params, width.value, size.value, page.value])

function goTo(p) {
  page.value = p
}

// A new search, or a new context width, starts from the first page. Registered before the loader
// below so that, in the same tick, the loader already sees page 1.
watch([() => props.params, width, size], () => { page.value = 1 })

// Load when the tab opens, and again if the search, the context width or the page changed
watch([() => props.active, () => props.params, width, size, page], () => {
  if (props.active && key() !== loadedKey) load()
}, { immediate: true })

onBeforeUnmount(() => controller?.abort())
</script>

<style scoped>
.conc-controls { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 12px; max-width: 1100px; }
.conc-hint { font-size: 0.85rem; opacity: 0.65; }
.conc-sort { max-width: 220px; }
.conc-size { max-width: 190px; }
.summary { font-size: 0.9rem; opacity: 0.7; margin-bottom: 8px; }
.empty { text-align: center; padding: 48px 0; opacity: 0.7; }

.kwic { max-width: 1100px; font-family: 'Junicode', ui-serif, serif; font-feature-settings: 'liga' 0, 'clig' 0, 'hlig' 0, 'calt' 0; }
.kwic-row {
  display: grid;
  grid-template-columns: 10em minmax(0, 1fr) auto minmax(0, 1fr);
  gap: 0 0.6em;
  align-items: center;
  padding: 5px 4px;
  border-bottom: 1px solid rgba(var(--v-border-color), 0.12);
  line-height: 1.5;
}
.kwic-row:hover { background: rgba(var(--v-theme-primary), 0.05); }
.kwic-ref { font-family: system-ui, sans-serif; font-size: 0.8rem; line-height: 1.25; overflow: hidden; display: flex; flex-direction: column; }
.kwic-ref a, .kwic-ref small { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.kwic-ref small { font-size: 0.68rem; opacity: 0.6; }
.kwic-ref a { color: rgb(var(--v-theme-primary)); text-decoration: none; }
.kwic-ref a:hover { text-decoration: underline; }
/* right-aligned against the keyword; when too long, the far (left) end is the one that gets cut */
.kwic-left { display: flex; justify-content: flex-end; overflow: hidden; }
.kwic-left > span { white-space: nowrap; }
.kwic-key { font-weight: 700; background: #ffe9a8; color: #1b1b1a; padding: 0 0.25em; border-radius: 2px; white-space: nowrap; }
.kwic-right { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

@media (max-width: 700px) {
  .kwic-row { grid-template-columns: 1fr; }
  .kwic-left { justify-content: flex-start; }
  .kwic-left > span, .kwic-right { white-space: normal; }
  .kwic-right { text-align: left; }
  .kwic-key { justify-self: start; }
}
</style>
