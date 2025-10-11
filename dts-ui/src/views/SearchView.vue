<template>
  <v-container class="py-6">
    <!-- Search guide -->
    <v-alert variant="tonal" type="info" class="mb-6">
      <div class="text-subtitle-1 mb-2">{{ $t('search.searchGuide') }}</div>
      
      <!-- Traditional Search Operators (shown only for traditional search) -->
      <div v-if="searchType === 'traditional'">
        <div class="text-subtitle-2 mb-2">{{ $t('search.guides.traditional.title') }}</div>
        <v-row>
          <v-col cols="12" md="6">
            <div class="rule"><v-chip size="x-small" label>,</v-chip>&nbsp;{{ $t('search.guides.traditional.tips.multiWord') }}</div>
            <div class="rule"><v-chip size="x-small" label>"&nbsp;&nbsp;"</v-chip>&nbsp;{{ $t('search.guides.traditional.tips.phrase') }}</div>
          </v-col>
        </v-row>
      </div>

      <!-- Semantic Search Guide -->
      <div v-if="searchType === 'vector'">
        <div class="text-subtitle-2 mb-2">{{ $t('search.guides.vector.title') }}</div>
        <v-row>
          <v-col cols="12" md="6">
            <div class="rule">• {{ $t('search.guides.vector.tips.natural') }}</div>
            <div class="rule">• {{ $t('search.guides.vector.tips.conceptual') }}</div>
            <div class="rule">• {{ $t('search.guides.vector.tips.variations') }}</div>
            <div class="rule">• {{ $t('search.guides.vector.tips.abbreviations') }}</div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="rule">• {{ $t('search.guides.vector.tips.try1') }} <v-chip size="x-small" label>{{ $t('search.guides.vector.examples.poor') }}</v-chip></div>
            <div class="rule">• {{ $t('search.guides.vector.tips.try2') }} <v-chip size="x-small" label>{{ $t('search.guides.vector.examples.horse') }}</v-chip></div>
            <div class="rule">• {{ $t('search.guides.vector.tips.try3') }} <v-chip size="x-small" label>{{ $t('search.guides.vector.examples.love') }}</v-chip></div>
            <div class="rule">• {{ $t('search.guides.vector.tips.ranking') }}</div>
          </v-col>
        </v-row>
      </div>

      <!-- Hybrid Search Guide -->
      <div v-if="searchType === 'hybrid'">
        <div class="text-subtitle-2 mb-2">{{ $t('search.guides.hybrid.title') }}</div>
        <div class="rule">{{ $t('search.guides.hybrid.description') }}</div>
        <div class="rule">{{ $t('search.guides.hybrid.usage') }}</div>
      </div>
    </v-alert>

    <!-- Search Type Selector -->
    <!-- <v-card class="mb-4" variant="outlined">
      <v-card-text class="py-3">
        <div class="text-subtitle-2 mb-3">{{ $t('search.searchMethod') }}</div>
        <v-btn-toggle
          v-model="searchType"
          mandatory
          variant="outlined"
          density="compact"
          class="mb-3"
        >
          <v-btn value="traditional" size="small">
            <v-icon start>mdi-text-search</v-icon>
            {{ $t('search.traditional') }}
          </v-btn>
          <v-btn value="vector" size="small" disabled>
            <v-icon start>mdi-brain</v-icon>
            {{ $t('search.vector') }}
            <v-chip size="x-small" class="ml-1" variant="tonal" color="grey">{{ $t('search.comingSoon') }}</v-chip>
          </v-btn>
          <v-btn value="hybrid" size="small" disabled>
            <v-icon start>mdi-merge</v-icon>
            {{ $t('search.hybrid') }}
            <v-chip size="x-small" class="ml-1" variant="tonal" color="grey">{{ $t('search.comingSoon') }}</v-chip>
          </v-btn>
        </v-btn-toggle>
        
        <div class="text-caption text-grey">
          <div v-if="searchType === 'traditional'">
            <v-icon size="x-small" class="mr-1">mdi-information-outline</v-icon>
            {{ $t('search.descriptions.traditional') }}
          </div>
          <div v-if="searchType === 'vector'">
            <v-icon size="x-small" class="mr-1">mdi-information-outline</v-icon>
            {{ $t('search.descriptions.vector') }}
          </div>
          <div v-if="searchType === 'hybrid'">
            <v-icon size="x-small" class="mr-1">mdi-information-outline</v-icon>
            {{ $t('search.descriptions.hybrid') }}
          </div>
        </div>
      </v-card-text>
    </v-card> -->

    <!-- Query bar + search button + keyboard toggle -->
    <div class="d-flex align-center" style="gap:12px">
      <v-text-field
        ref="inputRef"
        v-model="q"
        :placeholder="searchPlaceholder"
        variant="outlined"
        density="comfortable"
        hide-details
        class="junicode-input search-input"
        @keydown.enter="run(1)"
      />
      <v-btn 
        color="primary"
        @click="run(1)"
        :loading="loading"
        variant="elevated"
        size="large"
      >
        <v-icon>mdi-magnify</v-icon>
        <span class="ml-2 d-none d-sm-inline">{{ $t('search.searchButton') }}</span>
      </v-btn>
      <v-btn 
        @click="showKeyboard = !showKeyboard"
        :color="showKeyboard ? 'primary' : 'default'"
        variant="outlined"
        size="large"
      >
        <v-icon>mdi-keyboard-variant</v-icon>
        <span class="ml-2 d-none d-sm-inline">{{ $t('search.specialKeyboard') }}</span>
      </v-btn>
    </div>

    <!-- Search Mode Options (only for traditional search) -->
    <v-card v-if="searchType === 'traditional'" class="mt-4" variant="outlined">
      <v-card-text class="py-3">
        <div class="text-subtitle-2 mb-3">{{ $t('search.mode.title') }}</div>
        
        <div class="d-flex align-center gap-4 mb-3">
          <v-btn-toggle
            v-model="searchMode"
            mandatory
            variant="outlined"
            density="compact"
            class="flex-shrink-0"
          >
            <v-btn 
              value="exact" 
              size="small"
              :color="searchMode === 'exact' ? 'primary' : undefined"
            >
              {{ $t('search.mode.exact') }}
            </v-btn>
            <v-btn 
              value="partial" 
              size="small"
              :color="searchMode === 'partial' ? 'success' : undefined"
            >
              {{ $t('search.mode.partial') }}
            </v-btn>
            <v-btn 
              value="fuzzy" 
              size="small"
              :color="searchMode === 'fuzzy' ? 'warning' : undefined"
            >
              {{ $t('search.mode.fuzzy') }}
            </v-btn>
          </v-btn-toggle>
        </div>

        <!-- Mode descriptions -->
        <div class="mt-2 text-caption text-grey">
          <div v-if="searchMode === 'exact'">
            <v-icon size="x-small" class="mr-1">mdi-information-outline</v-icon>
            {{ $t('search.mode.descriptions.exact') }}
          </div>
          <div v-if="searchMode === 'partial'">
            <v-icon size="x-small" class="mr-1">mdi-information-outline</v-icon>
            {{ $t('search.mode.descriptions.partial') }}
          </div>
          <div v-if="searchMode === 'fuzzy'">
            <v-icon size="x-small" class="mr-1">mdi-information-outline</v-icon>
            {{ $t('search.mode.descriptions.fuzzy') }}
          </div>
        </div>
      </v-card-text>
    </v-card>

    <!-- Virtual keyboard -->
    <v-expand-transition>
      <div v-if="showKeyboard" class="mt-2">
        <CatmusKeyboard
          @insert="insertAtCaret"
          @backspace="backspaceAtCaret"
          @space="() => insertAtCaret(' ')"
        />
      </div>
    </v-expand-transition>

    <!-- Results header -->
    <div v-if="loaded" class="d-flex align-center justify-space-between mt-4 mb-2">
      <div class="text-body-2">
        {{ $t('search.showingResults', { start, end, total }) }}
      </div>
      <div class="d-flex align-center" style="gap:8px">
        <v-btn size="small" variant="text" :disabled="page<=1" @click="run(1)">
          <v-icon start>mdi-page-first</v-icon> {{ $t('search.pagination.first') }}
        </v-btn>
        <v-btn size="small" variant="text" :disabled="page<=1" @click="run(page-1)">
          <v-icon start>mdi-chevron-left</v-icon> {{ $t('search.pagination.prev') }}
        </v-btn>
        <span class="text-caption">{{ $t('search.pagination.page', { current: page, total: pages }) }}</span>
        <v-btn size="small" variant="text" :disabled="page>=pages" @click="run(page+1)">
          {{ $t('search.pagination.next') }} <v-icon end>mdi-chevron-right</v-icon>
        </v-btn>
        <v-btn size="small" variant="text" :disabled="page>=pages" @click="run(pages)">
          {{ $t('search.pagination.last') }} <v-icon end>mdi-page-last</v-icon>
        </v-btn>
      </div>
    </div>

    <v-progress-linear v-if="loading" indeterminate class="mt-6" />
    <v-alert v-else-if="loaded && items.length===0" type="info" variant="tonal" class="mt-6">
      {{ $t('search.noResults') }}
    </v-alert>

    <!-- Hybrid Results Display -->
    <div v-else-if="searchType === 'hybrid' && hybridResults" class="mt-2">
      <!-- Traditional Results Section -->
      <div v-if="hybridResults.traditional && hybridResults.traditional.items.length > 0" class="mb-6">
        <div class="d-flex align-center mb-3">
          <v-icon class="mr-2" color="primary">mdi-text-search</v-icon>
          <h3 class="text-h6">{{ $t('search.sections.traditional') }}</h3>
          <v-chip class="ml-2" size="small" variant="outlined" color="primary">
            {{ hybridResults.traditional.total }}
          </v-chip>
        </div>
        <v-list density="compact">
          <v-list-item
            v-for="(hit, i) in hybridResults.traditional.items"
            :key="`trad-${i}`"
            class="py-2 mb-1"
            rounded
            @click="open(hit)"
          >
            <template #title>
              <div class="d-flex align-center justify-space-between">
                <RouterLink
                  :to="toDoc(hit)"
                  class="font-weight-medium text-decoration-none"
                  @click.stop
                >
                  {{ hit.title || hit.manuscript_title || hit.name || `Document ${hit.collection}` }} • {{ hit.ref }}
                </RouterLink>
                <div class="d-flex align-center gap-1">
                  <v-chip size="x-small" label variant="tonal" color="primary">{{ $t('search.results.textMatch') }}</v-chip>
                  <v-chip v-if="hit.score" size="x-small" label variant="outlined">
                    {{ hit.score.toFixed(1) }}
                  </v-chip>
                </div>
              </div>
            </template>
            <v-list-item-subtitle>
              <span v-html="hit.snippet || hit.content"></span>
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </div>

      <!-- Vector Results Section -->
      <div v-if="hybridResults.vector && hybridResults.vector.items.length > 0">
        <div class="d-flex align-center mb-3">
          <v-icon class="mr-2" color="success">mdi-brain</v-icon>
          <h3 class="text-h6">{{ $t('search.sections.semantic') }}</h3>
          <v-chip class="ml-2" size="small" variant="outlined" color="success">
            {{ hybridResults.vector.total }}
          </v-chip>
        </div>
        <v-list density="compact">
          <v-list-item
            v-for="(hit, i) in hybridResults.vector.items"
            :key="`vec-${i}`"
            class="py-2 mb-1"
            rounded
            @click="open(hit)"
          >
            <template #title>
              <div class="d-flex align-center justify-space-between">
                <RouterLink
                  :to="toDoc(hit)"
                  class="font-weight-medium text-decoration-none"
                  @click.stop
                >
                  {{ hit.title || hit.manuscript_title || hit.name || `Document ${hit.collection}` }} • {{ hit.ref }}
                </RouterLink>
                <div class="d-flex align-center gap-1">
                  <v-chip size="x-small" label variant="tonal" color="success">{{ $t('search.results.semantic') }}</v-chip>
                  <v-chip v-if="hit.score" size="x-small" label variant="outlined" color="success">
                    {{ (hit.score * 100).toFixed(0) }}%
                  </v-chip>
                </div>
              </div>
            </template>
            <v-list-item-subtitle>
              <span v-html="hit.highlighted_content || hit.snippet"></span>
              
              <!-- Show matched phrases for vector search -->
              <div v-if="hit.matched_phrases && hit.matched_phrases.length > 0" class="matched-phrases mt-2">
                <div class="text-caption text-grey mb-1">{{ $t('search.results.semanticMatches') }}</div>
                <div class="phrase-tags">
                  <v-chip
                    v-for="phrase in hit.matched_phrases"
                    :key="phrase"
                    size="x-small"
                    variant="tonal"
                    color="success"
                    class="mr-1 mb-1"
                  >
                    {{ phrase }}
                  </v-chip>
                </div>
              </div>
              
              <div v-if="hit.language" class="text-caption text-grey mt-1">
                {{ $t('search.results.language') }} {{ hit.language }}
              </div>
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </div>
    </div>

    <!-- Regular Results Display (Traditional or Vector) -->
    <v-list v-else class="mt-2">
      <v-list-item
        v-for="(hit, i) in items"
        :key="i"
        class="py-3"
        @click="open(hit)"
      >
        <template #title>
          <div class="d-flex align-center justify-space-between">
            <RouterLink
              :to="toDoc(hit)"
              class="font-weight-medium text-decoration-none"
              @click.stop
            >
              {{ hit.title || hit.manuscript_title || hit.name || `Document ${hit.collection}` }} • {{ hit.ref }}
            </RouterLink>
            <div class="d-flex align-center gap-1">
              <v-chip 
                size="x-small" 
                label 
                variant="tonal"
                :color="searchType === 'vector' ? 'success' : 'primary'"
              >
                {{ searchType === 'vector' ? $t('search.results.semantic') : $t('search.results.textMatch') }}
              </v-chip>
              <v-chip 
                v-if="hit.score" 
                size="x-small" 
                label 
                variant="outlined"
                :color="searchType === 'vector' ? 'success' : 'primary'"
              >
                {{ searchType === 'vector' ? (hit.score * 100).toFixed(0) + '%' : hit.score.toFixed(1) }}
              </v-chip>
            </div>
          </div>
        </template>
        <v-list-item-subtitle>
          <span v-html="hit.highlighted_content || hit.snippet"></span>
          
          <!-- Show matched phrases for vector search -->
          <div v-if="hit.matched_phrases && hit.matched_phrases.length > 0" class="matched-phrases mt-2">
            <div class="text-caption text-grey mb-1">{{ $t('search.results.semanticMatches') }}</div>
            <div class="phrase-tags">
              <v-chip
                v-for="phrase in hit.matched_phrases"
                :key="phrase"
                size="x-small"
                variant="tonal"
                color="success"
                class="mr-1 mb-1"
              >
                {{ phrase }}
              </v-chip>
            </div>
          </div>
          
          <div v-if="hit.language && searchType === 'vector'" class="text-caption text-grey mt-1">
            {{ $t('search.results.language') }} {{ hit.language }}
          </div>
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>

    <!-- Bottom pager -->
    <div v-if="loaded && pages>1" class="d-flex justify-center mt-6">
      <v-pagination v-model="page" :length="pages" @update:modelValue="run" />
    </div>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { searchAll } from '../api/dts'
import CatmusKeyboard from '../components/CatmusKeyboard.vue'

const router = useRouter()
const route = useRoute()

const q = ref(route.query.q?.toString() || '')
const page = ref(Number(route.query.page || 1))
const size = ref(25)
const searchType = ref(route.query.type || 'traditional')

// Search mode options for traditional search
const searchMode = ref(route.query.mode || 'exact')

const loading = ref(false)
const loaded  = ref(false)
const total   = ref(0)
const items   = ref([])

// Hybrid search results
const hybridResults = ref(null)

const showKeyboard = ref(false)
const inputRef = ref()

// Import for translations
const { t } = useI18n()

// Computed properties for dynamic UI
const searchPlaceholder = computed(() => {
  console.log('Search placeholder:', t(`search.placeholders.${searchType.value}`))
  return t(`search.placeholders.${searchType.value}`)
})

const searchTypeIcon = computed(() => {
  switch (searchType.value) {
    case 'vector':
      return 'mdi-brain'
    case 'hybrid':
      return 'mdi-merge'
    default:
      return 'mdi-text-search'
  }
})

const pages = computed(() => Math.max(1, Math.ceil(total.value / size.value)))
const start = computed(() => total.value ? (page.value - 1) * size.value + 1 : 0)
const end   = computed(() => Math.min(total.value, start.value + items.value.length - 1))

function getNativeInput(){
  return inputRef.value?.$el?.querySelector('input, textarea')
}

async function insertAtCaret(text){
  const el = getNativeInput()
  if (!el) { q.value += text; return }
  const startPos = el.selectionStart ?? q.value.length
  const endPos   = el.selectionEnd ?? q.value.length
  q.value = q.value.slice(0, startPos) + text + q.value.slice(endPos)
  await nextTick()
  el.focus()
  const pos = startPos + text.length
  el.setSelectionRange(pos, pos)
}

async function backspaceAtCaret(){
  const el = getNativeInput()
  if (!el) { q.value = q.value.slice(0, -1); return }
  const startPos = el.selectionStart ?? q.value.length
  const endPos   = el.selectionEnd ?? q.value.length
  if (startPos !== endPos) {
    q.value = q.value.slice(0, startPos) + q.value.slice(endPos)
    await nextTick()
    el.focus()
    el.setSelectionRange(startPos, startPos)
  } else if (startPos > 0) {
    q.value = q.value.slice(0, startPos - 1) + q.value.slice(endPos)
    await nextTick()
    el.focus()
    const pos = startPos - 1
    el.setSelectionRange(pos, pos)
  }
}

async function run(p = page.value){
  if (!q.value.trim()) { 
    total.value = 0
    items.value = []
    hybridResults.value = null
    loaded.value = true
    page.value = 1
    pushState()
    return 
  }
  
  loading.value = true
  loaded.value = false
  page.value = p
  pushState()
  
  try {
    // Normalize medieval text: v->u, j->i for better search results
    // Also apply NFD (Unicode Normalization Form Decomposed) for proper handling of combining characters
    let normalizedQuery = q.value
      .replace(/V/g, "U")
      .replace(/v/g, "u")
      .replace(/J/g, "I")
      .replace(/j/g, "i")
      .normalize('NFD')
    

    
    let res
    if (searchType.value === 'hybrid') {
      res = await searchAll(normalizedQuery, page.value, size.value, 'hybrid', 'exact')
    } else if (searchType.value === 'traditional') {
      res = await searchAll(normalizedQuery, page.value, size.value, 'traditional', searchMode.value)
    } else {
      // Vector search doesn't use mode
      res = await searchAll(normalizedQuery, page.value, size.value, searchType.value, 'exact')
    }
    
    if (searchType.value === 'hybrid') {
      // Handle hybrid search results
      hybridResults.value = res
      total.value = res.total || 0
      // Combine traditional and vector results for display
      const traditionalItems = res.traditional?.items || []
      const vectorItems = res.vector?.items || []
      items.value = [...traditionalItems, ...vectorItems]
    } else {
      // Handle traditional and vector search results
      hybridResults.value = null
      total.value = res.total || 0
      items.value = res.items || []
    }
  } catch (error) {
    console.error('Search failed:', error)
    total.value = 0
    items.value = []
    hybridResults.value = null
  } finally {
    loading.value = false
    loaded.value = true
  }
}



function pushState(){
  router.replace({ 
    name: 'search', 
    query: { 
      q: q.value || undefined, 
      page: page.value > 1 ? page.value : undefined,
      type: searchType.value !== 'traditional' ? searchType.value : undefined,
      mode: searchType.value === 'traditional' && searchMode.value !== 'exact' ? searchMode.value : undefined
    } 
  })
}

function toDoc(hit){
  // Use the same normalization for highlighting as we use for search
  const normalizedQuery = q.value
    .replace(/V/g, "U")
    .replace(/v/g, "u")
    .replace(/J/g, "I")
    .replace(/j/g, "i")
    .normalize('NFD')
    
  return {
    name: 'documentRef',
    params: { resource: encodeURIComponent(hit.collection), ref: hit.ref },
    query: { highlight: normalizedQuery }
  }
}

function open(hit){ router.push(toDoc(hit)) }

onMounted(() => { run(page.value) })
// Watch for search type changes to re-run search
watch(searchType, () => {
  if (q.value.trim()) {
    run(1) // Reset to page 1 when changing search type
  }
})

// Watch for search mode changes
watch(searchMode, () => {
  pushState()
})

watch(() => route.query, () => {
  q.value = route.query.q?.toString() || ''
  page.value = Number(route.query.page || 1)
  searchType.value = route.query.type || 'traditional'
  searchMode.value = route.query.mode || 'exact'
  run(page.value)
})
</script>

<style scoped>
.rule { margin: 4px 0; }

/* Traditional keyword matches */
:deep(mark.dts-hit),
:deep(mark.text-hit) {
  background: rgba(255, 214, 51, 0.65);
  padding: 0 .15em;
  border-radius: 3px;
  font-weight: bold;
}

/* Vector semantic matches */
:deep(mark.vector-match) {
  background-color: #e1f5fe;
  border-bottom: 2px solid #03a9f4;
  font-weight: 500;
  padding: 0 .15em;
  border-radius: 3px;
}

/* Show similarity score on hover */
:deep(mark.vector-match:hover::after) {
  content: " (" attr(data-similarity) ")";
  font-size: 0.8em;
  color: #666;
}

/* Matched phrases styling */
.matched-phrases {
  margin-top: 8px;
}

.phrase-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

/* Use Junicode in the text field input for MUFI/combining marks */
:deep(.junicode-input .v-field__input),
:deep(.junicode-input input),
:deep(.junicode-input textarea) {
  font-family: 'Junicode', ui-serif, serif !important;
  /* Disable ligatures to avoid automatic glyph substitution (important for medieval text) */
  font-feature-settings: 'liga' 0, 'clig' 0, 'hlig' 0, 'calt' 0 !important;
  font-size: 1.05rem;
  line-height: 1.2;
}

/* Fix placeholder text cutoff */
:deep(.search-input) {
  flex: 1 1 auto;
  min-width: 0;
}

:deep(.search-input .v-field) {
  width: 100% !important;
}

:deep(.search-input .v-field__input) {
  width: 100% !important;
  min-width: 0 !important;
}

:deep(.search-input .v-field__field) {
  width: 100% !important;
  min-width: 0 !important;
}

:deep(.search-input input) {
  width: 100% !important;
  min-width: 0 !important;
}

:deep(.search-input input::placeholder) {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
}
</style>