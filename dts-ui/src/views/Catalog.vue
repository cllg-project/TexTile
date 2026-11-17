<template>
  <div>
    <v-sheet color="primary" class="py-6">
      <v-container>
        <h1 class="text-h4 font-weight-bold text-white mb-1">{{ $t('browse.title') }}</h1>
        <p class="text-white opacity-90 mb-4">{{ $t('browse.subtitle') }}</p>

        <form class="search-form" role="search" @submit.prevent="submit">
          <v-text-field
            v-model="form.q"
            :label="$t('browse.searchLabel')"
            :placeholder="$t('browse.searchPlaceholder')"
            prepend-inner-icon="mdi-magnify"
            variant="solo"
            density="comfortable"
            hide-details
            clearable
            class="search-input"
          />
          <v-btn type="submit" color="secondary" size="large" class="search-btn" :loading="loading">
            {{ $t('browse.searchButton') }}
          </v-btn>
        </form>

        <div class="filters mt-3">
          <v-select
            v-model="form.language"
            :items="languageItems"
            :label="$t('browse.language')"
            variant="solo"
            density="compact"
            hide-details
            clearable
            class="filter"
          />
          <v-text-field
            v-model="form.from"
            :label="$t('browse.yearFrom')"
            :placeholder="facets.min_year ? String(Math.floor(facets.min_year)) : ''"
            type="number"
            variant="solo"
            density="compact"
            hide-details
            class="filter filter-year"
          />
          <v-text-field
            v-model="form.to"
            :label="$t('browse.yearTo')"
            :placeholder="facets.max_year ? String(Math.floor(facets.max_year)) : ''"
            type="number"
            variant="solo"
            density="compact"
            hide-details
            class="filter filter-year"
          />
          <v-btn v-if="hasCriteria" variant="text" class="text-white" @click="reset">
            <v-icon start>mdi-close</v-icon>{{ $t('browse.reset') }}
          </v-btn>
        </div>
      </v-container>
    </v-sheet>

    <v-container class="py-6">
      <v-alert v-if="error" type="error" variant="tonal" closable class="mb-4" @click:close="error = ''">{{ error }}</v-alert>

      <!-- SEARCH MODE -->
      <template v-if="hasCriteria">
        <v-tabs :model-value="tab" color="primary" class="mb-2" @update:model-value="onTab">
          <v-tab value="manuscripts">
            {{ $t('browse.tabManuscripts') }}
            <v-chip size="x-small" class="ml-2" label>{{ $n(manuscripts.total) }}</v-chip>
          </v-tab>
          <v-tab value="collections" :disabled="!criteria.q.trim()">
            {{ $t('browse.tabCollections') }}
            <v-chip size="x-small" class="ml-2" label>{{ $n(collections.total) }}</v-chip>
          </v-tab>
        </v-tabs>

        <div v-if="loading" class="text-center py-10"><v-progress-circular indeterminate color="primary" /></div>

        <template v-else-if="tab === 'manuscripts'">
          <p v-if="!manuscripts.total" class="empty">{{ $t('browse.noResults') }}</p>
          <template v-else>
            <p class="result-count" role="status">{{ $t('browse.resultsCount', { count: $n(manuscripts.total) }, manuscripts.total) }}</p>
            <ManuscriptRow v-for="m in manuscripts.items" :key="m.id" :item="m" />
            <v-pagination
              v-if="manuscripts.pages > 1"
              :model-value="mPage"
              :length="manuscripts.pages"
              :total-visible="7"
              class="mt-6"
              @update:model-value="goPage('mp', $event)"
            />
          </template>
        </template>

        <template v-else>
          <p v-if="!collections.total" class="empty">{{ $t('browse.noResults') }}</p>
          <template v-else>
            <p class="result-count" role="status">{{ $t('browse.resultsCount', { count: $n(collections.total) }, collections.total) }}</p>
            <div class="card-grid">
              <CollectionCard v-for="c in collections.items" :key="c.id" :collection="c" />
            </div>
            <v-pagination
              v-if="collections.pages > 1"
              :model-value="cPage"
              :length="collections.pages"
              :total-visible="7"
              class="mt-6"
              @update:model-value="goPage('cp', $event)"
            />
          </template>
        </template>
      </template>

      <!-- BROWSE MODE: top-level collections -->
      <template v-else>
        <div class="d-flex align-center justify-space-between mb-3">
          <h2 class="text-h6">{{ $t('browse.topLevel') }}</h2>
          <v-select
            v-model="sortKey"
            :items="sortItems"
            density="compact"
            variant="outlined"
            hide-details
            style="max-width: 220px"
            @update:model-value="goPage('bp', 1)"
          />
        </div>
        <div v-if="loading" class="text-center py-10"><v-progress-circular indeterminate color="primary" /></div>
        <template v-else>
          <p v-if="!browse.items.length" class="empty">{{ $t('browse.emptyLibrary') }}</p>
          <div class="card-grid">
            <CollectionCard v-for="c in browse.items" :key="c.id" :collection="c" />
          </div>
          <v-pagination
            v-if="browse.pages > 1"
            :model-value="bPage"
            :length="browse.pages"
            :total-visible="7"
            class="mt-6"
            @update:model-value="goPage('bp', $event)"
          />
        </template>
      </template>
    </v-container>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  fetchCatalogFacets,
  fetchRootCollection,
  lastPageOf,
  parseMembers,
  searchCatalogCollections,
  searchCatalogManuscripts,
} from '../api/dts'
import { DEFAULT_SORT, fromSearchHit } from '../lib/catalog'
import { formatLanguage } from '../lib/language-utils'
import ManuscriptRow from '../components/ManuscriptRow.vue'
import CollectionCard from '../components/CollectionCard.vue'

const MS_SIZE = 25
const COLL_SIZE = 20

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

// The URL is the source of truth: ?q=&lang=&from=&to=&tab=&mp=&cp=&bp=&sort=
const criteria = computed(() => ({
  q: String(route.query.q ?? ''),
  language: String(route.query.lang ?? ''),
  from: String(route.query.from ?? ''),
  to: String(route.query.to ?? ''),
}))
const hasCriteria = computed(() => Object.values(criteria.value).some((v) => v.trim() !== ''))
const mPage = computed(() => Math.max(1, parseInt(route.query.mp, 10) || 1))
const cPage = computed(() => Math.max(1, parseInt(route.query.cp, 10) || 1))
const bPage = computed(() => Math.max(1, parseInt(route.query.bp, 10) || 1))

// Form fields: edited freely, applied on submit
const form = reactive({ q: '', language: null, from: '', to: '' })
const tab = ref('manuscripts')
const sortKey = ref(String(route.query.sort || DEFAULT_SORT))

const loading = ref(false)
const error = ref('')
const facets = ref({ languages: [], min_year: null, max_year: null })
const manuscripts = ref({ total: 0, pages: 1, items: [] })
const collections = ref({ total: 0, pages: 1, items: [] })
const browse = ref({ pages: 1, items: [] })

const languageItems = computed(() =>
  facets.value.languages.map((l) => ({ title: `${formatLanguage(l.code, t)} (${l.count})`, value: l.code })),
)
const sortItems = computed(() => [
  { title: t('browse.sortSize'), value: 'nb_children' },
  { title: t('browse.sortTitle'), value: 'title' },
])

function syncForm() {
  form.q = criteria.value.q
  form.language = criteria.value.language || null
  form.from = criteria.value.from
  form.to = criteria.value.to
}

function pushQuery(next) {
  const query = {}
  for (const [k, v] of Object.entries(next)) {
    if (v === '' || v == null) continue
    if (['mp', 'cp', 'bp'].includes(k) && Number(v) === 1) continue
    query[k] = String(v)
  }
  router.push({ name: 'catalog', query })
}

function submit() {
  pushQuery({
    q: (form.q ?? '').trim(),
    lang: form.language ?? '',
    from: form.from ?? '',
    to: form.to ?? '',
  })
}

function reset() {
  form.q = ''
  form.language = null
  form.from = ''
  form.to = ''
  pushQuery({})
}

function goPage(key, page) {
  const sort = sortKey.value === DEFAULT_SORT ? '' : sortKey.value
  pushQuery({ ...route.query, sort, [key]: page })
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function onTab(value) {
  pushQuery({ ...route.query, tab: value })
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    if (hasCriteria.value) {
      const c = criteria.value
      const [ms, cs] = await Promise.all([
        searchCatalogManuscripts({ q: c.q, language: c.language, startYear: c.from, stopYear: c.to, page: mPage.value, size: MS_SIZE }),
        // Collections only have a title/description, so they are only searched by text
        c.q.trim()
          ? searchCatalogCollections({ q: c.q, page: cPage.value, size: COLL_SIZE })
          : Promise.resolve({ total: 0, items: [] }),
      ])
      manuscripts.value = {
        total: ms.total ?? 0,
        pages: Math.max(1, Math.ceil((ms.total ?? 0) / MS_SIZE)),
        items: (ms.items || []).map(fromSearchHit),
      }
      collections.value = {
        total: cs.total ?? 0,
        pages: Math.max(1, Math.ceil((cs.total ?? 0) / COLL_SIZE)),
        items: (cs.items || []).map((x) => ({ id: x.identifier, title: x.title, description: x.description, count: x.total_children })),
      }
      const wanted = route.query.tab
      tab.value = wanted === 'collections' || wanted === 'manuscripts'
        ? wanted
        : (!manuscripts.value.total && collections.value.total ? 'collections' : 'manuscripts')
    } else {
      const sort = sortKey.value
      const resp = await fetchRootCollection(bPage.value, sort, sort === 'nb_children' ? 'desc' : 'asc')
      const { members, pagination } = parseMembers(resp)
      browse.value = {
        pages: lastPageOf(pagination),
        items: members
          .filter((m) => m.kind === 'collection')
          .map((m) => ({ id: m.id, title: m.title, count: m.nb_children })),
      }
    }
  } catch (e) {
    error.value = e?.message || String(e)
  } finally {
    loading.value = false
  }
}

watch(() => route.fullPath, () => {
  if (route.name !== 'catalog') return
  syncForm()
  sortKey.value = String(route.query.sort || DEFAULT_SORT)
  load()
})

onMounted(async () => {
  syncForm()
  load()
  try { facets.value = await fetchCatalogFacets() } catch { /* filters just stay empty */ }
})
</script>

<style scoped>
.search-form { display: flex; gap: 12px; max-width: 880px; }
.search-input { flex: 1; }
.search-btn { align-self: stretch; height: auto !important; }
.filters { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; max-width: 880px; }
.filter { min-width: 180px; max-width: 220px; flex: 1; }
.filter-year { max-width: 130px; min-width: 110px; }
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(260px, 100%), 1fr));
  gap: 16px;
}
.result-count { font-size: 0.9rem; opacity: 0.7; margin-bottom: 4px; }
.empty { text-align: center; padding: 48px 0; opacity: 0.7; }
@media (max-width: 600px) {
  .search-form { flex-direction: column; }
  .search-btn { height: 44px !important; }
}
</style>
