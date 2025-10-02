<template>
  <v-container class="py-6">
    <!-- Search guide -->
    <v-alert variant="tonal" type="info" class="mb-6">
      <div class="text-subtitle-1 mb-2">SEARCH GUIDE</div>
      
      <!-- Traditional Search Operators (shown only for traditional search) -->
      <div v-if="searchType === 'traditional'">
        <div class="text-subtitle-2 mb-2">Traditional Search Operators</div>
        <v-row>
          <v-col cols="12" md="6">
            <div class="rule"><v-chip size="x-small" label>+</v-chip>&nbsp;signifies AND operation</div>
            <div class="rule"><v-chip size="x-small" label>|</v-chip>&nbsp;signifies OR operation</div>
            <div class="rule"><v-chip size="x-small" label>-</v-chip>&nbsp;negates a single token</div>
            <div class="rule"><v-chip size="x-small" label>"&nbsp;&nbsp;"</v-chip>&nbsp;wraps tokens to make a phrase</div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="rule"><v-chip size="x-small" label>*</v-chip>&nbsp;at the end of a term is a prefix query</div>
            <div class="rule"><v-chip size="x-small" label>( )</v-chip>&nbsp;signify precedence</div>
            <div class="rule"><v-chip size="x-small" label>~num</v-chip>&nbsp;after a word = fuzziness</div>
            <div class="rule"><v-chip size="x-small" label>~num</v-chip>&nbsp;after a phrase = slop</div>
          </v-col>
        </v-row>
      </div>

      <!-- Semantic Search Guide -->
      <div v-if="searchType === 'vector'">
        <div class="text-subtitle-2 mb-2">Semantic Search Tips</div>
        <v-row>
          <v-col cols="12" md="6">
            <div class="rule">• Use natural language queries</div>
            <div class="rule">• Searches for conceptual similarity</div>
            <div class="rule">• Finds spelling variations automatically</div>
            <div class="rule">• Works with medieval abbreviations</div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="rule">• Try: <v-chip size="x-small" label>"homme pauvre"</v-chip></div>
            <div class="rule">• Try: <v-chip size="x-small" label>"cheval"</v-chip></div>
            <div class="rule">• Try: <v-chip size="x-small" label>"amour courtois"</v-chip></div>
            <div class="rule">• Results ranked by similarity</div>
          </v-col>
        </v-row>
      </div>

      <!-- Hybrid Search Guide -->
      <div v-if="searchType === 'hybrid'">
        <div class="text-subtitle-2 mb-2">Hybrid Search</div>
        <div class="rule">Combines traditional exact matching with semantic similarity for comprehensive results.</div>
        <div class="rule">Use any query type - the system will find both exact matches and conceptually similar content.</div>
      </div>
    </v-alert>

    <!-- Search Type Selector -->
    <v-card class="mb-4" variant="outlined">
      <v-card-text class="py-3">
        <div class="text-subtitle-2 mb-3">Search Method</div>
        <v-btn-toggle
          v-model="searchType"
          mandatory
          variant="outlined"
          density="compact"
          class="mb-3"
        >
          <v-btn value="traditional" size="small">
            <v-icon start>mdi-text-search</v-icon>
            Traditional
          </v-btn>
          <v-btn value="vector" size="small">
            <v-icon start>mdi-brain</v-icon>
            Semantic
          </v-btn>
          <v-btn value="hybrid" size="small">
            <v-icon start>mdi-merge</v-icon>
            Hybrid
          </v-btn>
        </v-btn-toggle>
        
        <div class="text-caption text-grey">
          <div v-if="searchType === 'traditional'">
            <v-icon size="x-small" class="mr-1">mdi-information-outline</v-icon>
            Fast exact matching with Boolean operators and wildcards
          </div>
          <div v-if="searchType === 'vector'">
            <v-icon size="x-small" class="mr-1">mdi-information-outline</v-icon>
            Semantic similarity search - finds conceptually similar content and spelling variants
          </div>
          <div v-if="searchType === 'hybrid'">
            <v-icon size="x-small" class="mr-1">mdi-information-outline</v-icon>
            Combines traditional and semantic search for comprehensive results
          </div>
        </div>
      </v-card-text>
    </v-card>

    <!-- Query bar + keyboard toggle -->
    <div class="d-flex align-center" style="gap:12px">
      <v-text-field
        ref="inputRef"
        v-model="q"
        :placeholder="searchPlaceholder"
        clearable
        hide-details
        density="comfortable"
        class="flex-grow-1 junicode-input"
        append-inner-icon="mdi-keyboard-outline"
        @click:append-inner="showKeyboard = !showKeyboard"
        @keydown.enter="run(1)"
      />
      <v-btn 
        color="primary" 
        @click="run(1)"
        :loading="loading"
      >
        <v-icon start>{{ searchTypeIcon }}</v-icon>
        Search
      </v-btn>
    </div>

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
        Showing {{ start }}–{{ end }} of {{ total }}
      </div>
      <div class="d-flex align-center" style="gap:8px">
        <v-btn size="small" variant="text" :disabled="page<=1" @click="run(1)">
          <v-icon start>mdi-page-first</v-icon> first
        </v-btn>
        <v-btn size="small" variant="text" :disabled="page<=1" @click="run(page-1)">
          <v-icon start>mdi-chevron-left</v-icon> prev
        </v-btn>
        <span class="text-caption">page {{ page }} of {{ pages }}</span>
        <v-btn size="small" variant="text" :disabled="page>=pages" @click="run(page+1)">
          next <v-icon end>mdi-chevron-right</v-icon>
        </v-btn>
        <v-btn size="small" variant="text" :disabled="page>=pages" @click="run(pages)">
          last <v-icon end>mdi-page-last</v-icon>
        </v-btn>
      </div>
    </div>

    <v-progress-linear v-if="loading" indeterminate class="mt-6" />
    <v-alert v-else-if="loaded && items.length===0" type="info" variant="tonal" class="mt-6">
      No results.
    </v-alert>

    <!-- Hybrid Results Display -->
    <div v-else-if="searchType === 'hybrid' && hybridResults" class="mt-2">
      <!-- Traditional Results Section -->
      <div v-if="hybridResults.traditional && hybridResults.traditional.items.length > 0" class="mb-6">
        <div class="d-flex align-center mb-3">
          <v-icon class="mr-2" color="primary">mdi-text-search</v-icon>
          <h3 class="text-h6">Traditional Search Results</h3>
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
                  <v-chip size="x-small" label variant="tonal" color="primary">text match</v-chip>
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
          <h3 class="text-h6">Semantic Search Results</h3>
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
                  <v-chip size="x-small" label variant="tonal" color="success">semantic</v-chip>
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
                <div class="text-caption text-grey mb-1">Semantic matches:</div>
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
                Language: {{ hit.language }}
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
                {{ searchType === 'vector' ? 'semantic' : 'text match' }}
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
            <div class="text-caption text-grey mb-1">Semantic matches:</div>
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
            Language: {{ hit.language }}
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
import { searchAll } from '../api/dts'
import CatmusKeyboard from '../components/CatmusKeyboard.vue'

const router = useRouter()
const route = useRoute()

const q = ref(route.query.q?.toString() || '')
const page = ref(Number(route.query.page || 1))
const size = ref(25)
const searchType = ref(route.query.type || 'traditional')

const loading = ref(false)
const loaded  = ref(false)
const total   = ref(0)
const items   = ref([])
const mode    = ref('form') // placeholder

// Hybrid search results
const hybridResults = ref(null)

const showKeyboard = ref(false)
const inputRef = ref()

// Computed properties for dynamic UI
const searchPlaceholder = computed(() => {
  switch (searchType.value) {
    case 'vector':
      return 'Search semantically (e.g., "homme pauvre", "cheval")…'
    case 'hybrid':
      return 'Search with both traditional and semantic methods…'
    default:
      return 'Search with Boolean operators (+, -, |, *, "phrases")…'
  }
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
    const res = await searchAll(q.value, page.value, size.value, searchType.value)
    
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
      type: searchType.value !== 'traditional' ? searchType.value : undefined
    } 
  })
}

function toDoc(hit){
  return {
    name: 'documentRef',
    params: { resource: encodeURIComponent(hit.collection), ref: hit.ref },
    query: { highlight: q.value }
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

watch(() => route.query, () => {
  q.value = route.query.q?.toString() || ''
  page.value = Number(route.query.page || 1)
  searchType.value = route.query.type || 'traditional'
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
  font-feature-settings: 'liga' 1, 'hlig' 1, 'calt' 0;
  font-size: 1.05rem;
  line-height: 1.2;
}
</style>