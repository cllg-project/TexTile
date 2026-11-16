<template>
  <div>
    <v-sheet color="primary" class="py-6">
      <v-container>
        <h1 class="text-h4 font-weight-bold text-white mb-1">{{ $t('search.title') }}</h1>
        <p class="text-white opacity-90 mb-4">{{ $t('search.subtitle') }}</p>

        <form class="search-form" role="search" @submit.prevent="run(1)">
          <v-text-field
            ref="inputRef"
            v-model="q"
            :placeholder="$t('search.placeholders.traditional')"
            variant="solo"
            density="comfortable"
            hide-details
            clearable
            autofocus
            class="junicode-input search-input"
          >
            <template #append-inner>
              <v-btn
                icon="mdi-keyboard-variant"
                variant="text"
                size="small"
                :color="showKeyboard ? 'primary' : undefined"
                :title="$t('search.specialKeyboard')"
                :aria-pressed="showKeyboard"
                @click.stop="showKeyboard = !showKeyboard"
              />
            </template>
          </v-text-field>
          <v-btn type="submit" color="secondary" size="large" class="search-btn" :loading="loading">
            {{ $t('search.searchButton') }}
          </v-btn>
        </form>

        <div class="options">
          <v-select
            v-model="selectedLanguage"
            :items="languageOptions"
            item-title="name"
            item-value="code"
            variant="solo"
            density="compact"
            hide-details
            class="language-select"
            :aria-label="$t('search.languageFilter')"
          />

          <div class="mode" role="group" :aria-label="$t('search.modeLabel')">
            <span class="mode-label">{{ $t('search.modeLabel') }}</span>
            <v-btn-toggle v-model="searchMode" mandatory density="compact" variant="outlined" class="mode-toggle">
              <v-btn value="exact" size="small" :title="$t('search.mode.descriptions.exact')">{{ $t('search.mode.exact') }}</v-btn>
              <v-btn value="partial" size="small" :title="$t('search.mode.descriptions.partial')">{{ $t('search.mode.partial') }}</v-btn>
              <v-btn value="fuzzy" size="small" :title="$t('search.mode.descriptions.fuzzy')">{{ $t('search.mode.fuzzy') }}</v-btn>
            </v-btn-toggle>
          </div>

          <v-btn
            variant="text"
            size="small"
            class="text-white"
            prepend-icon="mdi-help-circle-outline"
            :aria-expanded="showTips"
            @click="showTips = !showTips"
          >{{ $t('search.tipsButton') }}</v-btn>
        </div>

        <v-expand-transition>
          <ul v-if="showTips" class="tips">
            <li>{{ $t('search.guides.traditional.tips.multiWord') }}</li>
            <li>{{ $t('search.guides.traditional.tips.phrase') }}</li>
            <li>{{ $t('search.guides.traditional.tips.wildcard') }}</li>
            <li class="tips-mode">{{ $t(`search.mode.descriptions.${searchMode}`) }}</li>
          </ul>
        </v-expand-transition>

        <v-expand-transition>
          <v-sheet v-if="showKeyboard" rounded class="mt-3 pa-2">
            <CatmusKeyboard
              @insert="insertAtCaret"
              @backspace="backspaceAtCaret"
              @space="() => insertAtCaret(' ')"
            />
          </v-sheet>
        </v-expand-transition>
      </v-container>
    </v-sheet>

    <v-container class="py-6 results">
      <v-tabs v-if="lastRun" :model-value="view" color="primary" class="view-tabs" @update:model-value="setView">
        <v-tab value="results">{{ $t('search.tabResults') }}</v-tab>
        <v-tab value="concordance">{{ $t('search.tabConcordance') }}</v-tab>
        <v-tab value="stats">{{ $t('search.tabStats') }}</v-tab>
      </v-tabs>

      <!-- Both are kept mounted once a search exists: they only load while their tab is open -->
      <ConcordanceTable v-if="lastRun" v-show="view === 'concordance'" :params="lastRun" :active="view === 'concordance'" />
      <TermStats v-if="lastRun" v-show="view === 'stats'" :params="lastRun" :active="view === 'stats'" />

      <v-progress-linear v-if="view === 'results' && loading" indeterminate color="primary" />

      <template v-else-if="view === 'results' && loaded && q.trim()">
        <p v-if="!items.length" class="empty">{{ $t('search.noResults') }}</p>
        <template v-else>
          <div class="result-bar">
            <p class="result-count" role="status">
              {{ $t('search.resultsCount', { count: $n(total) }, total) }}
              <span v-if="pages > 1"> · {{ $t('search.pagination.page', { current: page, total: pages }) }}</span>
            </p>
            <v-btn
              v-if="exportHref"
              :href="exportHref"
              download
              size="small"
              variant="text"
              color="primary"
              prepend-icon="mdi-file-delimited-outline"
              :title="$t('search.exportConcordanceHint')"
            >{{ $t('search.exportConcordance') }}</v-btn>
          </div>

          <article v-for="(hit, i) in items" :key="`${hit.collection}-${hit.ref}-${i}`" class="hit">
            <div class="hit-head">
              <RouterLink :to="toDoc(hit)" class="hit-ref">{{ hit.ref }}</RouterLink>
              <span class="hit-ms">{{ manuscriptTitle(hit.title || hit.manuscript_title || hit.name, hit.ref) }}</span>
            </div>
            <p class="hit-snippet" v-html="safeSnippet(hit.highlighted_content || hit.snippet)" />
          </article>

          <v-pagination
            v-if="pages > 1"
            :model-value="page"
            :length="pages"
            :total-visible="7"
            class="mt-6"
            @update:model-value="goToPage"
          />
        </template>
      </template>

      <div v-else-if="!q.trim() && !lastRun" class="intro">
        <span class="intro-label">{{ $t('search.tryExamples') }}</span>
        <v-btn
          v-for="ex in examples"
          :key="ex.q"
          size="small"
          variant="outlined"
          class="junicode-input text-none"
          @click="useExample(ex)"
        >{{ ex.q }}</v-btn>
      </div>
    </v-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { concordanceUrl, searchAll } from '../api/dts'
import CatmusKeyboard from '../components/CatmusKeyboard.vue'
import ConcordanceTable from '../components/ConcordanceTable.vue'
import TermStats from '../components/TermStats.vue'
import { getLanguageOptions } from '../lib/language-utils'
import { manuscriptTitle, safeSnippet } from '../lib/catalog'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const size = 25
const q = ref(route.query.q?.toString() || '')
const page = ref(Number(route.query.page || 1))
const searchMode = ref(route.query.mode || 'exact') // exact | partial | fuzzy
const selectedLanguage = ref(route.query.language || 'all')

const loading = ref(false)
const loaded = ref(false)
const total = ref(0)
const items = ref([])

// The search that produced the results on screen (the input may have been edited since)
const lastRun = ref(null)
const exportHref = computed(() => (lastRun.value ? concordanceUrl(lastRun.value) : ''))

const VIEWS = ['results', 'concordance', 'stats']
const view = ref(VIEWS.includes(route.query.view) ? route.query.view : 'results')

const showKeyboard = ref(false)
const showTips = ref(false)
const inputRef = ref()

const languageOptions = computed(() => getLanguageOptions(t))
const examples = [
  { q: 'deus,deum', mode: 'exact' },
  { q: '"la bouche"', mode: 'exact' },
  { q: 'reg*', mode: 'exact' },
]

const pages = computed(() => Math.max(1, Math.ceil(total.value / size)))

function getNativeInput() {
  return inputRef.value?.$el?.querySelector('input, textarea')
}

async function insertAtCaret(text) {
  const el = getNativeInput()
  if (!el) { q.value = (q.value || '') + text; return }
  const startPos = el.selectionStart ?? q.value.length
  const endPos = el.selectionEnd ?? q.value.length
  q.value = q.value.slice(0, startPos) + text + q.value.slice(endPos)
  await nextTick()
  el.focus()
  const pos = startPos + text.length
  el.setSelectionRange(pos, pos)
}

async function backspaceAtCaret() {
  const el = getNativeInput()
  if (!el) { q.value = (q.value || '').slice(0, -1); return }
  const startPos = el.selectionStart ?? q.value.length
  const endPos = el.selectionEnd ?? q.value.length
  if (startPos !== endPos) {
    q.value = q.value.slice(0, startPos) + q.value.slice(endPos)
    await nextTick()
    el.focus()
    el.setSelectionRange(startPos, startPos)
  } else if (startPos > 0) {
    q.value = q.value.slice(0, startPos - 1) + q.value.slice(endPos)
    await nextTick()
    el.focus()
    el.setSelectionRange(startPos - 1, startPos - 1)
  }
}

// v to u and j to i outside quoted phrases
function normalizeQueryForBackend(query) {
  if (!query) return ''
  const parts = query.normalize('NFD').split(',').map((part) => part.trim())
  return parts.map((part) => {
    if (part.startsWith('"') && part.endsWith('"')) return part
    return part.replace(/V/g, 'U').replace(/v/g, 'u').replace(/J/g, 'I').replace(/j/g, 'i')
  }).join(',')
}

function setView(value) {
  view.value = value
  pushState()
}

function pushState() {
  router.replace({
    name: 'search',
    query: {
      view: view.value !== 'results' ? view.value : undefined,
      q: q.value || undefined,
      page: page.value > 1 ? page.value : undefined,
      mode: searchMode.value !== 'exact' ? searchMode.value : undefined,
      language: selectedLanguage.value !== 'all' ? selectedLanguage.value : undefined,
    },
  })
}

async function run(p = 1) {
  page.value = p
  pushState()

  if (!(q.value || '').trim()) {
    total.value = 0
    items.value = []
    loaded.value = false
    return
  }

  loading.value = true
  try {
    const languageParam = selectedLanguage.value === 'all' ? null : selectedLanguage.value
    const normalized = normalizeQueryForBackend(q.value)
    const res = await searchAll(normalized, page.value, size, 'traditional', searchMode.value, null, languageParam)
    lastRun.value = { q: normalized, mode: searchMode.value, language: languageParam || '' }
    total.value = res.total || 0
    items.value = res.items || []
  } catch (error) {
    console.error('Search failed:', error)
    total.value = 0
    items.value = []
  } finally {
    loading.value = false
    loaded.value = true
  }
}

function goToPage(p) {
  run(p)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function useExample(ex) {
  q.value = ex.q
  searchMode.value = ex.mode
  run(1)
}

function toDoc(hit) {
  return {
    name: 'documentRef',
    params: { resource: encodeURIComponent(hit.collection), ref: hit.ref },
    // the same normalization as the search, so the reader highlights the same hits
    query: { highlight: normalizeQueryForBackend(q.value) },
  }
}

onMounted(() => { if (q.value.trim()) run(page.value) })

// Changing a filter re-runs the current search from the first page
watch([searchMode, selectedLanguage], () => {
  if (q.value.trim()) run(1)
  else pushState()
})

// Follow external navigation (links, back/forward), ignoring our own URL updates
watch(() => route.query, (query) => {
  const next = {
    view: VIEWS.includes(query.view) ? query.view : 'results',
    q: query.q?.toString() || '',
    page: Number(query.page || 1),
    mode: query.mode || 'exact',
    language: query.language || 'all',
  }
  view.value = next.view
  if (next.q === q.value && next.page === page.value && next.mode === searchMode.value && next.language === selectedLanguage.value) return
  q.value = next.q
  page.value = next.page
  searchMode.value = next.mode
  selectedLanguage.value = next.language
  run(next.page)
})
</script>

<style scoped>
.search-form { display: flex; gap: 12px; max-width: 880px; }
.search-input { flex: 1; min-width: 0; }
.search-btn { align-self: stretch; height: auto !important; }

.options {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 20px;
  margin-top: 12px;
  max-width: 880px;
}
.language-select { min-width: 190px; max-width: 240px; flex: 0 1 220px; }
.mode { display: flex; align-items: center; gap: 8px; }
.mode-label { color: rgba(255, 255, 255, 0.85); font-size: 0.85rem; }
.mode-toggle { border-color: rgba(255, 255, 255, 0.6); }
.mode-toggle :deep(.v-btn) { color: #fff; border-color: rgba(255, 255, 255, 0.6); }
.mode-toggle :deep(.v-btn--active) { background: #fff; color: rgb(var(--v-theme-primary)); }

.tips {
  list-style: none;
  margin: 12px 0 0;
  padding: 10px 14px;
  max-width: 880px;
  font-size: 0.9rem;
  color: #fff;
  background: rgba(255, 255, 255, 0.14);
  border-radius: 3px;
}
.tips li + li { margin-top: 4px; }
.tips-mode { opacity: 0.85; font-style: italic; }

/* Results */
.result-bar { display: flex; align-items: center; justify-content: space-between; gap: 12px; max-width: 880px; margin-bottom: 4px; }
.result-count { font-size: 0.9rem; opacity: 0.7; margin: 0; }
.hit, .intro { max-width: 880px; }
.view-tabs { margin-bottom: 16px; }
.empty { text-align: center; padding: 48px 0; opacity: 0.7; }
.hit {
  padding: 14px 4px;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.hit-head { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 12px; }
.hit-ref { font-weight: 600; font-size: 1.02rem; text-decoration: none; color: rgb(var(--v-theme-primary)); }
.hit-ref:hover { text-decoration: underline; }
.hit-ms { font-size: 0.85rem; opacity: 0.65; }
.hit-snippet {
  margin: 6px 0 0;
  line-height: 1.55;
  font-family: 'Junicode', ui-serif, serif;
  font-feature-settings: 'liga' 0, 'clig' 0, 'hlig' 0, 'calt' 0;
}
.hit-snippet :deep(mark.dts-hit) {
  background: #ffe9a8;
  color: inherit;
  padding: 0 0.1em;
  border-radius: 2px;
  font-weight: 600;
}
.hit-snippet :deep(.snip-gap) { opacity: 0.45; padding: 0 0.25em; }

.intro { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 10px; padding: 24px 0; }
.intro-label { opacity: 0.65; font-size: 0.9rem; }

/* Junicode in the text field for MUFI/combining marks; ligatures off (important for medieval text) */
:deep(.junicode-input .v-field__input),
:deep(.junicode-input input),
:deep(.junicode-input textarea) {
  font-family: 'Junicode', ui-serif, serif !important;
  font-feature-settings: 'liga' 0, 'clig' 0, 'hlig' 0, 'calt' 0 !important;
  font-size: 1.05rem;
  line-height: 1.2;
}
:deep(.search-input input::placeholder) {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

@media (max-width: 600px) {
  .search-form { flex-direction: column; }
  .search-btn { height: 44px !important; }
  .language-select { flex: 1 1 100%; max-width: none; }
  .mode { flex: 1 1 100%; flex-wrap: wrap; }
  .mode-toggle { flex: 1 1 100%; }
  .mode-toggle :deep(.v-btn) { flex: 1 1 0; min-width: 0; padding: 0 6px; font-size: 0.7rem; }
}
</style>
