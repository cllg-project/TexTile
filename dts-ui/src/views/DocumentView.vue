<template>
  <v-container fluid>
    <v-container class="py-4">
      <v-row>
        <!-- LEFT: tools -->
        <v-col cols="12" md="3">
          <v-expansion-panels v-model="openPanels" multiple>
            <!-- TEXT SEARCH PANEL -->
            <v-expansion-panel>
              <v-expansion-panel-title>
                <div class="d-flex align-center justify-space-between w-100">
                  <span>Text Search</span>
                  <span class="text-caption">({{ matches.length }})</span>
                </div>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div class="d-flex align-center mb-2 suppress-page-arrows" style="gap:8px">
                  <v-text-field
                    v-model="searchQ"
                    label="Enter a word or phrase"
                    clearable
                    hide-details
                    density="comfortable"
                    prepend-inner-icon="mdi-magnify"
                    @keydown.enter="doSearch"
                  />
                  <v-btn @click="doSearch" variant="elevated">Search</v-btn>
                  <v-btn variant="text" @click="clearHits">Clear</v-btn>
                </div>

                <!-- <v-radio-group v-model="searchMode" inline class="mb-2" density="compact">
                  <v-radio label="Form" value="form" />
                  <v-radio label="Lemma (coming soon)" value="lemma" disabled />
                </v-radio-group> -->

                <div v-if="searching" class="mt-4"><v-progress-linear indeterminate /></div>
                <v-alert v-else-if="matches.length === 0" type="info" variant="tonal">No results yet.</v-alert>

                <v-list v-else class="mt-2 result-list">
                  <v-list-item
                    v-for="(m, i) in matches"
                    :key="i"
                    @click="openResult(m)"
                    class="result-item"
                    :title="m.ref"
                  >
                    <template #title>
                      <a href="#" @click.prevent="openResult(m)">{{ m.ref }}</a>
                    </template>
                    <v-list-item-subtitle v-if="m.snippet"><span v-html="m.snippet" /></v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <!-- CITE PANEL -->
            <v-expansion-panel>
              <v-expansion-panel-title>Cite this document</v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-textarea :model-value="citation" auto-grow readonly class="mb-2" />
                <v-btn size="small" variant="tonal" @click="copyCitation" prepend-icon="mdi-content-copy">
                  Copy
                </v-btn>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>

        <!-- MIDDLE: reader -->
        <v-col cols="12" md="6">
          <!-- Top controls -->
          <div class="d-flex align-center justify-space-between mb-2" @keydown.enter="onGotoEnter">
            <div class="d-flex align-center suppress-page-arrows" style="gap:8px">
              <v-autocomplete
                v-model="goto"
                :items="refs"
                label="Go to passage"
                clearable
                hide-details
                density="comfortable"
                style="max-width:380px; min-width:300px"
                @update:modelValue="onGoto"
              />
            </div>

            <div class="d-flex align-center">
              <v-btn
                variant="tonal"
                class="square-btn mr-2"
                :disabled="index <= 0"
                @click="goPrev"
              >
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
              <span class="text-caption text-no-wrap">{{ index + 1 }} / {{ refs.length }}</span>
              <v-btn
                variant="tonal"
                class="square-btn ml-2"
                :disabled="index >= refs.length - 1"
                @click="goNext"
              >
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </div>
          </div>

          <!-- Reader card -->
          <v-card class="pa-1">
            <v-card-text class="reader-scroller">
              <!-- bind CSS var for font size -->
              <div
                ref="readerEl"
                v-if="html"
                v-html="html"
                class="reader-html"
                :style="{ '--reader-font-size': textPx + 'px' }"
              ></div>
              <v-skeleton-loader v-else type="paragraph, paragraph, paragraph" />
            </v-card-text>
          </v-card>
        </v-col>

        <!-- RIGHT: display controls -->
        <v-col cols="12" md="3">
          <!-- Transcription Quality Disclaimer -->
          <v-alert
            type="warning"
            variant="tonal"
            density="compact"
            class="mb-3"
            closable
            v-model="showDisclaimer"
          >
            <template #prepend>
              <v-icon>mdi-information-outline</v-icon>
            </template>
            <div class="text-body-2">
              <strong>Automatic Transcription Notice:</strong>
              This text is the result of automatic transcription. A sampled evaluation has shown an error rate varying between 6 and 20% on 600 random different manuscripts.
            </div>
          </v-alert>

          <v-expansion-panels multiple>
            <v-expansion-panel>
              <v-expansion-panel-title>Display</v-expansion-panel-title>
              <v-expansion-panel-text>
                <div class="text-subtitle-2 mb-2">Text size</div>
                <div class="d-flex align-center" style="gap:8px">
                  <v-btn
                    variant="tonal"
                    class="size-btn"
                    :disabled="textPx <= minPx"
                    @click="decSize"
                  >
                    −
                  </v-btn>
                  <div class="size-readout">{{ textPx }} px</div>
                  <v-btn
                    variant="tonal"
                    class="size-btn"
                    :disabled="textPx >= maxPx"
                    @click="incSize"
                  >
                    +
                  </v-btn>
                </div>
                <div class="mt-2">
                  <v-btn size="x-small" variant="text" @click="resetSize">Reset</v-btn>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchNavigation, extractRefsFromNavigation, fetchPage } from '../api/dts'

const BASE = import.meta.env.VITE_DTS_BASE_URL || 'http://localhost:5000'

const route = useRoute()
const router = useRouter()
const resource = decodeURIComponent(route.params.resource)
const currentRef = ref(route.params.ref || '')
const refs = ref([])
const html = ref('')
const readerEl = ref(null)
const goto = ref('')
const index = computed(() => Math.max(0, refs.value.findIndex(x => x === currentRef.value)))
const navigateTo = (ref) => {
  if (!ref) return
  if (route.params.ref === ref) return // skip redundant replace
  router.replace({
    name: 'documentRef',
    params: { resource: encodeURIComponent(resource), ref }
  })
}
/* Left panels */
const openPanels = ref([0])
const searchQ = ref('')
const searchMode = ref('form')
const matches = ref([])
const searching = ref(false)
const highlightTerm = ref('')
let keyListenerBound = false
const pageCtrl = ref(null)
const searchCtrl = ref(null)

/* Disclaimer state */
const showDisclaimer = ref(true)
/* Text size state */
const LS_KEY = 'readerTextPx'
const minPx = 14
const maxPx = 30
const stepPx = 2
const defaultPx = 18
const textPx = ref(Number(localStorage.getItem(LS_KEY)) || defaultPx)
watch(textPx, v => localStorage.setItem(LS_KEY, String(v)))
function clamp(n){ return Math.min(maxPx, Math.max(minPx, n)) }
function incSize(){ textPx.value = clamp(textPx.value + stepPx) }
function decSize(){ textPx.value = clamp(textPx.value - stepPx) }
function resetSize(){ textPx.value = defaultPx }

const citation = computed(() =>
  `Resource: ${resource}\nPassage: ${currentRef.value}\nURL: ${location.origin}/doc/${encodeURIComponent(resource)}/p/${currentRef.value}`
)

function goPrev(){
  if (index.value > 0) {
    const prevRef = refs.value[index.value - 1]
    navigateTo(prevRef)
  }
}
function goNext(){
  if (index.value < refs.value.length - 1) {
    const nextRef = refs.value[index.value + 1]
    navigateTo(nextRef)
  }
}

function onGoto(val){ if (val) navigateTo(val) }
function onGotoEnter(){ if (goto.value) navigateTo(goto.value) }


async function loadNav(){
  const nav = await fetchNavigation(resource)
  refs.value = extractRefsFromNavigation(nav)
  if (!currentRef.value && refs.value.length) {
    navigateTo(refs.value[0])
  }
}

async function loadPage(){
  // cancel any older page load
  pageCtrl.value?.abort()
  const ctrl = new AbortController()
  pageCtrl.value = ctrl

  const htmlStr = await fetchPage(resource, currentRef.value, 'html', ctrl.signal)
  if (ctrl.signal.aborted) return

  html.value = htmlStr
  await nextTick()
  readerEl.value?.removeAttribute('data-enhanced')
  enhanceTeiHtml()
  
  // Ensure we apply highlighting with the current highlight term
  await nextTick()
  applyHighlight()
}
function enhanceTeiHtml(){
  const root = readerEl.value
  if (!root || root.dataset.enhanced === '1') return
  if (root.querySelector('.tei-p')) return

  const frag = document.createDocumentFragment()
  let p = document.createElement('p')
  p.className = 'tei-p'
  let prevWasBr = false
  let pCount = 0

  function flushP(){
    if (p && p.childNodes.length) {
      frag.appendChild(p)
      pCount++
    }
    p = document.createElement('p')
    p.className = 'tei-p'
    prevWasBr = false
  }

  const nodes = Array.from(root.childNodes)
  for (const node of nodes){
    if (node.nodeType === Node.ELEMENT_NODE){
      const el = /** @type {HTMLElement} */(node)

      if (el.tagName === 'BR'){
        if (prevWasBr){ prevWasBr = false; flushP(); continue }
        p.appendChild(el); prevWasBr = true; continue
      }

      const isBlocky =
        el.classList.contains('pb') ||
        el.classList.contains('rubric') ||
        el.classList.contains('marginal')

      if (isBlocky){
        flushP()
        frag.appendChild(el)
        flushP()
        continue
      }

      prevWasBr = false
      p.appendChild(el)
    } else if (node.nodeType === Node.TEXT_NODE){
      prevWasBr = false
      p.appendChild(node)
    }
  }
  flushP()

  if (pCount === 0) {
    const wrapper = document.createElement('p')
    wrapper.className = 'tei-p'
    while (frag.firstChild) wrapper.appendChild(frag.firstChild)
    frag.appendChild(wrapper)
  }

  root.innerHTML = ''
  root.appendChild(frag)
  root.dataset.enhanced = '1'
}

/* Search */
async function doSearch(){
  matches.value = []
  highlightTerm.value = ''
  if (!searchQ.value) { applyHighlight(); return }

  searchCtrl.value?.abort()
  const ctrl = new AbortController()
  searchCtrl.value = ctrl

  searching.value = true
  try {
    const url = `${BASE}/search/?q=${encodeURIComponent(searchQ.value)}&resource=${encodeURIComponent(resource)}`
    const res = await fetch(url, { signal: ctrl.signal })
    if (!res.ok) throw new Error('Search failed')
    const data = await res.json()
    const items = Array.isArray(data) ? data : (data.items || [])
    matches.value = items.filter(d => d?.ref).map(d => ({ ref: d.ref, snippet: d.snippet || '' }))
    highlightTerm.value = searchQ.value
  } catch (e) {
    if (e.name !== 'AbortError') console.warn('search failed', e)
  } finally {
    if (searchCtrl.value === ctrl) searching.value = false
  }
}

function openResult(m){
  const samePassage = m.ref === currentRef.value
  highlightTerm.value = searchQ.value
  goto.value = m.ref
  if (samePassage) {
    applyHighlight()
  } else {
    navigateTo(m.ref)
  }
}

function clearHits(){ matches.value = []; highlightTerm.value = ''; applyHighlight() }
function copyCitation(){ navigator.clipboard?.writeText(citation.value).catch(()=>{}) }

/* Highlighting */
function applyHighlight(){
  const root = readerEl.value
  if (!root) return
  
  // Clear existing highlights
  root.querySelectorAll('mark.dts-hit').forEach(mark => {
    const parent = mark.parentNode
    if (!parent) return
    parent.replaceChild(document.createTextNode(mark.textContent || ''), mark)
    parent.normalize()
  })

  const term = (highlightTerm.value || '').trim()
  if (!term) return

  const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(esc(term), 'gi')

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node){ return node.nodeValue && node.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT }
  })

  const targets = []
  let n
  while ((n = walker.nextNode())) { if (regex.test(n.nodeValue)) targets.push(n) }

  for (const textNode of targets) {
    const frag = document.createDocumentFragment()
    const text = textNode.nodeValue
    let last = 0
    text.replace(regex, (match, offset) => {
      const pre = text.slice(last, offset)
      if (pre) frag.appendChild(document.createTextNode(pre))
      const mark = document.createElement('mark')
      mark.className = 'dts-hit'
      mark.textContent = match
      frag.appendChild(mark)
      last = offset + match.length
      return match
    })
    const tail = text.slice(last)
    if (tail) frag.appendChild(document.createTextNode(tail))
    textNode.parentNode.replaceChild(frag, textNode)
  }
  
  const first = root.querySelector('mark.dts-hit')
  if (first) {
    first.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }
}

/* Arrow keys only for page nav when not typing/selecting */
function shouldIgnoreArrows(e){
  const el = e.target
  if (!el) return false
  const tag = (el.tagName || '').toLowerCase()
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return true
  if (el.isContentEditable) return true
  if (el.closest && el.closest('.suppress-page-arrows')) return true
  return false
}
function onKey(e){
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    if (shouldIgnoreArrows(e)) return
    e.preventDefault()
    if (e.key === 'ArrowLeft') goPrev(); else goNext()
  }
}

watch(() => route.query.highlight, (h) => {
  const s = typeof h === 'string' ? h : ''
  if (s !== highlightTerm.value) { 
    highlightTerm.value = s
    // Also update the search field to show what we're highlighting
    if (s && !searchQ.value) {
      searchQ.value = s
    }
    // Apply highlight immediately if content is already loaded
    if (html.value) {
      nextTick(() => applyHighlight())
    }
  }
}, { immediate: true })
onMounted(async () => {
  if (!keyListenerBound) {
    window.addEventListener('keydown', onKey)
    keyListenerBound = true
  }
  
  // Initialize highlight term from query parameter
  const highlightQuery = route.query.highlight
  if (highlightQuery && typeof highlightQuery === 'string') {
    highlightTerm.value = highlightQuery
    searchQ.value = highlightQuery
    // Ensure the search panel is expanded if we have a highlight
    if (!openPanels.value.includes(0)) {
      openPanels.value.push(0)
    }
  }
  
  await loadNav()
})

onBeforeUnmount(() => {
  if (keyListenerBound) {
    window.removeEventListener('keydown', onKey)
    keyListenerBound = false
  }
})
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    if (keyListenerBound) {
      window.removeEventListener('keydown', onKey)
      keyListenerBound = false
    }
  })
}
watch(
  () => route.params.ref,
  async (n) => {
    const refParam = n || ''
    if (!refParam) return
    currentRef.value = refParam
    goto.value = refParam
    await loadPage()
  },
  { immediate: true }   // <— THIS makes it run once right away
)
</script>

<style scoped>
.result-list { max-height: 50vh; overflow: auto; }
.result-item a { text-decoration: none; }

/* Square Prev/Next buttons */
.square-btn {
  width: 40px; height: 40px; min-width: 40px;
  border-radius: 6px !important;
}

/* ---------- READER AREA SCROLL ---------- */
.reader-scroller {
  height: calc(100vh - 180px);
  overflow: auto;
  padding-right: 8px;
  scrollbar-gutter: stable;
}

/* clearfix for floats */
:deep(.reader-html)::after { content: ""; display: block; clear: both; }

/* ---------- TEI-FRIENDLY TYPO ---------- */
:deep(.reader-html) {
  font-family: 'Junicode', 'Noto Serif', serif;
  font-variation-settings: "wght" 600;
  font-variant-ligatures: common discretionary contextual;
  font-variant-numeric: oldstyle-nums;
  /* dynamic size from control */
  font-size: var(--reader-font-size, 18px);
  line-height: 1.55;
  letter-spacing: 0.01em;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

/* Visual paragraphs */
:deep(.tei-p) {
  margin: 0.4rem 0 0.6rem;
  padding: 4px 8px;
  border-radius: 8px;
  transition: background-color 120ms ease, box-shadow 120ms ease;
  box-shadow: inset 2px 0 0 0 transparent;
}
:deep(.tei-p:hover) {
  background: rgba(125, 125, 125, 0.08);
  box-shadow: inset 3px 0 0 0 var(--v-theme-primary, #6750A4);
}
:deep(.tei-p br) { content: ""; display: block; margin-bottom: 0.25rem; }

/* Page break chip */
:deep(.pb) {
  display: inline-block;
  position: static;
  margin: 0.5rem 0 0.25rem;
  padding: 2px 8px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.8em;               /* scale with reader size */
  border-radius: 999px;
  background: color-mix(in oklab, var(--v-theme-primary, #6750A4), white 85%);
  color: color-mix(in oklab, var(--v-theme-primary, #6750A4), black 35%);
}
:deep(.reader-html > .pb:not(:first-child)) {
  position: sticky; top: 8px; z-index: 1;
}

/* Rubrics */
:deep(.rubric) {
  display: block;
  margin: 0.6rem 0 0.25rem;
  font-variant-caps: small-caps;
  letter-spacing: 0.02em;
  color: #b10606;
  font-weight: 600;
  font-size: 1em; /* inherit scale */
}

/* Marginal notes */
:deep(.marginal) {
  display: block;
  float: right;
  width: min(38%, 320px);
  margin: 0 0 0.5rem 1rem;
  padding: 0.35rem 0.5rem;
  font-size: 0.9em;  /* scale with reader */
  line-height: 1.4;
  background: color-mix(in oklab, var(--v-theme-surface, #fff), var(--v-theme-on-surface, #000) 6%);
  border-left: 3px solid color-mix(in oklab, var(--v-theme-primary, #6750A4), black 20%);
  border-radius: 6px;
  opacity: 0.97;
}

/* Highlights */
:deep(mark.dts-hit){
  background: rgba(255, 214, 51, 0.65);
  padding: 0 .15em; border-radius: 3px;
}

/* Right sidebar controls */
.size-btn {
  width: 44px; height: 36px; min-width: 44px;
  border-radius: 6px !important;
  font-weight: 600; font-size: 18px;
  line-height: 1;
}
.size-readout {
  min-width: 72px; text-align: center;
  padding: 6px 10px;
  border: 1px solid rgba(0,0,0,.12);
  border-radius: 6px;
  font-variant-numeric: tabular-nums;
}

/* Images */
.reader-html img { max-width: 100%; height: auto; }

/* Emphasize highlights in results */
.result-list :deep(mark.dts-hit) { font-weight: 600; }
</style>
