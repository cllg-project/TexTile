<template>
  <div>
    <v-container class="pt-4 pb-0">
      <v-breadcrumbs :items="crumbs" density="compact" class="px-0">
        <template #divider><v-icon size="small">mdi-chevron-right</v-icon></template>
      </v-breadcrumbs>
    </v-container>

    <v-container class="pb-8">
      <v-alert v-if="error" type="error" variant="tonal" class="mb-4">{{ error }}</v-alert>

      <div v-if="loading && !header.title" class="text-center py-10"><v-progress-circular indeterminate color="primary" /></div>

      <template v-else-if="header.title">
        <header class="coll-header">
          <div class="coll-label">
            <v-icon size="14" class="mr-1">{{ header.isResource ? 'mdi-book-open-page-variant-outline' : 'mdi-folder-outline' }}</v-icon>
            {{ header.isResource ? $t('browse.manuscript') : $t('browse.collection') }}
          </div>
          <h1 class="text-h4 font-weight-bold my-2">{{ header.title }}</h1>
          <p v-if="header.description" class="coll-lead">{{ header.description }}</p>

          <div class="d-flex flex-wrap align-end justify-space-between ga-4 mt-4">
            <dl class="meta">
              <template v-if="!header.isResource">
                <dt>{{ $t('browse.contents') }}</dt>
                <dd>{{ $t('browse.items', { count: $n(header.total) }, header.total) }}</dd>
              </template>
              <dt>{{ $t('browse.identifier') }}</dt>
              <dd class="code">{{ id }}</dd>
            </dl>
            <div class="d-flex ga-2">
              <v-btn
                v-if="header.isResource"
                color="primary"
                :to="{ name: 'document', params: { resource: encodeURIComponent(id) } }"
              >{{ $t('browse.read') }}</v-btn>
              <v-btn variant="outlined" :to="{ name: 'catalog' }">{{ $t('browse.backToLibrary') }}</v-btn>
            </div>
          </div>
        </header>

        <form v-if="!header.isResource" class="in-search" role="search" @submit.prevent="submitSearch">
          <v-text-field
            v-model="searchText"
            :label="$t('browse.searchIn', { title: header.title })"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="comfortable"
            hide-details
            clearable
            @click:clear="clearSearch"
          />
          <v-btn type="submit" color="primary" size="large" class="in-search-btn" :loading="loading">{{ $t('browse.searchButton') }}</v-btn>
        </form>

        <!-- SEARCH WITHIN THIS COLLECTION -->
        <template v-if="!header.isResource && q">
          <div class="d-flex align-center flex-wrap ga-3 mt-4">
            <v-chip closable label color="primary" variant="tonal" @click:close="clearSearch">
              {{ $t('browse.searchingIn', { title: header.title }) }}
            </v-chip>
            <RouterLink :to="{ name: 'catalog', query: { q } }" class="text-body-2 whole-link">{{ $t('browse.searchWholeLibrary') }}</RouterLink>
          </div>

          <v-tabs :model-value="tab" color="primary" class="mt-2 mb-2" @update:model-value="setTab">
            <v-tab value="manuscripts">
              {{ $t('browse.tabManuscripts') }}
              <v-chip size="x-small" class="ml-2" label>{{ $n(found.manuscripts.total) }}</v-chip>
            </v-tab>
            <v-tab value="collections">
              {{ $t('browse.tabCollections') }}
              <v-chip size="x-small" class="ml-2" label>{{ $n(found.collections.total) }}</v-chip>
            </v-tab>
          </v-tabs>

          <div v-if="loading" class="text-center py-8"><v-progress-circular indeterminate color="primary" /></div>
          <template v-else>
            <template v-if="tab === 'manuscripts'">
              <p v-if="!found.manuscripts.total" class="empty">{{ $t('browse.noResults') }}</p>
              <template v-else>
                <p class="result-count" role="status">{{ $t('browse.resultsCount', { count: $n(found.manuscripts.total) }, found.manuscripts.total) }}</p>
                <ManuscriptRow v-for="m in found.manuscripts.items" :key="m.id" :item="m" />
              </template>
              <v-pagination v-if="found.manuscripts.pages > 1" :model-value="page" :length="found.manuscripts.pages" :total-visible="7" class="mt-6" @update:model-value="setPage" />
            </template>
            <template v-else>
              <p v-if="!found.collections.total" class="empty">{{ $t('browse.noResults') }}</p>
              <template v-else>
                <p class="result-count" role="status">{{ $t('browse.resultsCount', { count: $n(found.collections.total) }, found.collections.total) }}</p>
                <div class="card-grid">
                  <CollectionCard v-for="c in found.collections.items" :key="c.id" :collection="c" />
                </div>
              </template>
              <v-pagination v-if="found.collections.pages > 1" :model-value="page" :length="found.collections.pages" :total-visible="7" class="mt-6" @update:model-value="setPage" />
            </template>
          </template>
        </template>

        <template v-else-if="!header.isResource">
          <div class="d-flex align-center justify-space-between flex-wrap ga-3 mt-6 mb-2">
            <h2 class="text-h6">{{ $t('browse.contents') }}</h2>
            <v-select
              :model-value="sortKey"
              :items="sortItems"
              density="compact"
              variant="outlined"
              hide-details
              style="max-width: 220px"
              @update:model-value="setSort"
            />
          </div>

          <div v-if="loading" class="text-center py-8"><v-progress-circular indeterminate color="primary" /></div>
          <template v-else>
            <p v-if="!subCollections.length && !manuscripts.length" class="empty">{{ $t('browse.emptyCollection') }}</p>

            <section v-if="subCollections.length" class="mb-6">
              <h3 class="section-head">{{ $t('browse.subCollections') }}</h3>
              <div class="card-grid">
                <CollectionCard v-for="c in subCollections" :key="c.id" :collection="c" />
              </div>
            </section>

            <section v-if="manuscripts.length">
              <h3 class="section-head">{{ $t('browse.manuscripts') }}</h3>
              <ManuscriptRow v-for="m in manuscripts" :key="m.id" :item="m" />
            </section>

            <v-pagination
              v-if="pages > 1"
              :model-value="page"
              :length="pages"
              :total-visible="7"
              class="mt-6"
              @update:model-value="setPage"
            />
          </template>
        </template>
      </template>
    </v-container>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { fetchCollectionRaw, lastPageOf, parseMembers, searchCatalogCollections, searchCatalogManuscripts } from '../api/dts'
import { DEFAULT_SORT, fromMember, fromSearchHit } from '../lib/catalog'
import ManuscriptRow from '../components/ManuscriptRow.vue'
import CollectionCard from '../components/CollectionCard.vue'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const id = computed(() => String(route.params.id))
const page = computed(() => Math.max(1, parseInt(route.query.page, 10) || 1))
const sortKey = computed(() => String(route.query.sort || DEFAULT_SORT))
const q = computed(() => String(route.query.q ?? '').trim())
const tab = computed(() => (route.query.tab === 'collections' ? 'collections' : 'manuscripts'))
const searchText = ref(q.value)
const found = ref({ manuscripts: { total: 0, pages: 1, items: [] }, collections: { total: 0, pages: 1, items: [] } })
const MS_SIZE = 25
const COLL_SIZE = 20

const loading = ref(false)
const error = ref('')
const header = reactive({ title: '', description: '', isResource: false, total: 0 })
const subCollections = ref([])
const manuscripts = ref([])
const pages = ref(1)
const ancestors = ref([]) // [{ id, title }] from the top, excluding the root and the current collection

const sortItems = computed(() => [
  { title: t('browse.sortSize'), value: 'nb_children' },
  { title: t('browse.sortTitle'), value: 'title' },
])

const crumbs = computed(() => [
  { title: t('browse.title'), to: { name: 'catalog' }, exact: true },
  ...ancestors.value.map((a) => ({ title: a.title, to: { name: 'collection', params: { id: a.id } } })),
  { title: header.title || '…', disabled: true },
])

function setQuery(patch) {
  const query = { ...route.query, ...patch }
  for (const k of Object.keys(query)) {
    if (query[k] === '' || query[k] == null || (k === 'page' && Number(query[k]) === 1) || (k === 'sort' && query[k] === DEFAULT_SORT) || (k === 'tab' && query[k] === 'manuscripts')) delete query[k]
  }
  router.push({ name: 'collection', params: { id: id.value }, query })
}
function setPage(p) {
  setQuery({ page: p })
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
function setSort(s) {
  setQuery({ sort: s, page: 1 })
}
function submitSearch() {
  const text = (searchText.value ?? '').trim()
  setQuery({ q: text, page: 1, tab: 'manuscripts' })
}
function clearSearch() {
  searchText.value = ''
  setQuery({ q: '', page: 1, tab: '' })
}
function setTab(value) {
  setQuery({ tab: value, page: 1 })
}

// Walk up through the first parent until the root (which is not shown: "Library" stands for it).
// One request per level: asking for a collection's parents also tells us whether it is the root
// (no parents), and the answer is reused as the next level instead of being fetched again.
async function loadAncestors(startId) {
  const chain = []
  let parents = parseMembers(await fetchCollectionRaw(startId, 'parents')).members
  for (let depth = 0; depth < 12; depth++) {
    const parent = parents[0]
    if (!parent) break
    const above = parseMembers(await fetchCollectionRaw(parent.id, 'parents')).members
    if (!above.length) break // the parent is the root
    chain.unshift({ id: parent.id, title: parent.title })
    parents = above
  }
  return chain
}

let token = 0
async function load() {
  const mine = ++token
  loading.value = true
  error.value = ''
  try {
    const sort = sortKey.value
    const searching = q.value !== ''
    // In search mode the listing below is replaced by results; page 1 is only fetched for the header
    const resp = await fetchCollectionRaw(id.value, 'children', searching ? 1 : page.value, sort, sort === 'nb_children' ? 'desc' : 'asc')
    if (mine !== token) return
    if (typeof resp === 'string') throw new Error(t('browse.notFound'))

    const { members, pagination } = parseMembers(resp)
    header.title = resp.title || id.value
    header.description = resp.description || ''
    header.isResource = String(resp['@type'] || '').toLowerCase() === 'resource'
    header.total = resp.totalChildren ?? members.length
    subCollections.value = members
      .filter((m) => m.kind === 'collection')
      .map((m) => ({ id: m.id, title: m.title, count: m.nb_children }))
    manuscripts.value = members.filter((m) => m.kind === 'resource').map(fromMember)
    pages.value = lastPageOf(pagination)

    if (searching && !header.isResource) {
      const [ms, cs] = await Promise.all([
        searchCatalogManuscripts({ q: q.value, within: id.value, page: tab.value === 'manuscripts' ? page.value : 1, size: MS_SIZE }),
        searchCatalogCollections({ q: q.value, within: id.value, page: tab.value === 'collections' ? page.value : 1, size: COLL_SIZE }),
      ])
      if (mine !== token) return
      found.value = {
        manuscripts: { total: ms.total ?? 0, pages: Math.max(1, Math.ceil((ms.total ?? 0) / MS_SIZE)), items: (ms.items || []).map(fromSearchHit) },
        collections: {
          total: cs.total ?? 0,
          pages: Math.max(1, Math.ceil((cs.total ?? 0) / COLL_SIZE)),
          items: (cs.items || []).map((x) => ({ id: x.identifier, title: x.title, description: x.description, count: x.total_children })),
        },
      }
    }
  } catch (e) {
    if (mine !== token) return
    error.value = e?.message || String(e)
    header.title = header.title || id.value
  } finally {
    if (mine === token) loading.value = false
  }
}

watch(id, async (newId) => {
  header.title = ''
  ancestors.value = []
  try { ancestors.value = await loadAncestors(newId) } catch { /* breadcrumb just stays short */ }
}, { immediate: true })

watch(q, (v) => { searchText.value = v })
watch(() => route.fullPath, () => { if (route.name === 'collection') load() }, { immediate: true })
</script>

<style scoped>
.coll-header { padding-bottom: 20px; border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); }
.coll-label {
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgb(var(--v-theme-primary));
  display: flex;
  align-items: center;
}
.coll-lead { max-width: 70ch; font-size: 1.05rem; opacity: 0.85; margin: 0; }
.meta { display: grid; grid-template-columns: auto 1fr; gap: 4px 16px; margin: 0; font-size: 0.9rem; }
.meta dt { opacity: 0.65; }
.meta dd { margin: 0; word-break: break-all; }
.code { font-family: ui-monospace, Menlo, Consolas, monospace; font-size: 0.8rem; }
.section-head {
  font-size: 0.8rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  opacity: 0.7;
  font-weight: 600;
  padding-bottom: 6px;
  margin-bottom: 12px;
  border-bottom: 2px solid rgb(var(--v-theme-primary));
  display: inline-block;
}
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(260px, 100%), 1fr));
  gap: 16px;
}
.whole-link { color: rgb(var(--v-theme-primary)); }
.in-search { display: flex; gap: 12px; margin-top: 20px; max-width: 720px; }
.in-search-btn { align-self: stretch; height: auto !important; }
.result-count { font-size: 0.9rem; opacity: 0.7; margin-bottom: 4px; }
.empty { text-align: center; padding: 48px 0; opacity: 0.7; }
</style>
