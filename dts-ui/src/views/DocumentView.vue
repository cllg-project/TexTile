<template>
  <v-container fluid>
    <v-container class="py-4">
      <v-row>
        <!-- LEFT: tools -->
        <v-col cols="12" md="3">
          <v-expansion-panels v-model="openPanels" multiple>
            <!-- DOCUMENT INFO PANEL -->
            <v-expansion-panel>
              <v-expansion-panel-title>
                <div class="d-flex align-center justify-space-between w-100">
                  <span>{{ $t('document.info.title') || 'Document Info' }}</span>
                  <div v-if="displayLanguages.length">
                    <v-chip-group>
                      <v-chip 
                        v-for="(lang, i) in displayLanguages" 
                        :key="i" 
                        size="x-small" 
                        :color="getLanguageColor(lang)"
                        variant="tonal"
                        class="language-chip"
                      >
                        {{ lang }}
                      </v-chip>
                    </v-chip-group>
                  </div>
                  <v-chip v-else size="x-small" color="grey" variant="tonal">
                    {{ $t('document.info.unknownLanguage') || 'Unknown' }}
                  </v-chip>
                </div>
              </v-expansion-panel-title>
              <v-expansion-panel-text class="custom-panel">
                <div class="info-panel-wrapper">
                  <!-- Title Section -->
                  <div class="info-section title-section">
                    <h3 class="doc-title" :title="documentTitle">{{ documentTitle }}</h3>
                    <div v-if="documentMetadata.dates && documentMetadata.dates.length" class="dates-row">
                      <v-chip 
                        v-for="(date, i) in documentMetadata.dates" 
                        :key="i" 
                        size="small" 
                        variant="flat"
                        color="primary"
                        class="date-chip"
                      >
                        <v-icon size="12" class="mr-1">mdi-calendar</v-icon>
                        {{ date }}
                      </v-chip>
                    </div>
                  </div>
                  
                  <!-- Description Section -->
                  <div v-if="documentMetadata.description" class="info-section description-section">
                    <div class="section-content">
                      <div class="section-icon">
                        <v-icon size="18">mdi-text-box-outline</v-icon>
                      </div>
                      <div class="section-text">
                        <div class="section-label">Description</div>
                        <p class="description-text">{{ documentMetadata.description }}</p>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Metadata Details -->
                  <div v-if="hasMetadataDetails" class="info-section metadata-section">
                    <div v-if="documentMetadata.author" class="metadata-item">
                      <div class="section-content">
                        <div class="section-icon">
                          <v-icon size="18">mdi-account-outline</v-icon>
                        </div>
                        <div class="section-text">
                          <div class="section-label">{{ $t('document.info.author') }}</div>
                          <div class="section-value">{{ documentMetadata.author }}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div v-if="documentMetadata.origin" class="metadata-item">
                      <div class="section-content">
                        <div class="section-icon">
                          <v-icon size="18">mdi-map-marker-outline</v-icon>
                        </div>
                        <div class="section-text">
                          <div class="section-label">{{ $t('document.info.origin') }}</div>
                          <div class="section-value">{{ documentMetadata.origin }}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div v-if="documentMetadata.type" class="metadata-item">
                      <div class="section-content">
                        <div class="section-icon">
                          <v-icon size="18">mdi-file-document-outline</v-icon>
                        </div>
                        <div class="section-text">
                          <div class="section-label">{{ $t('document.info.type') }}</div>
                          <div class="section-value">{{ documentMetadata.type }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Keywords -->
                  <div v-if="documentMetadata.keywords && documentMetadata.keywords.length" class="info-section keywords-section">
                    <div class="section-content">
                      <div class="section-icon">
                        <v-icon size="18">mdi-tag-multiple-outline</v-icon>
                      </div>
                      <div class="section-text">
                        <div class="section-label">{{ $t('document.info.keywords') }}</div>
                        <div class="keywords-container">
                          <v-chip 
                            v-for="(keyword, i) in documentMetadata.keywords" 
                            :key="i" 
                            size="x-small" 
                            variant="flat"
                            :color="getKeywordColor(i)"
                            class="keyword-chip"
                          >
                            {{ keyword }}
                          </v-chip>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Sources -->
                  <div v-if="documentMetadata.sources && documentMetadata.sources.length" class="info-section sources-section">
                    <div class="section-content">
                      <div class="section-icon">
                        <v-icon size="18">mdi-link-variant</v-icon>
                      </div>
                      <div class="section-text">
                        <div class="section-label">{{ $t('document.info.sources') }}</div>
                        <div class="sources-list">
                          <div v-for="(source, i) in documentMetadata.sources" :key="i" class="source-item">
                            <a v-if="isUrl(source)" :href="source" target="_blank" rel="noopener noreferrer" class="source-link">
                              <v-icon size="12" class="mr-1">mdi-open-in-new</v-icon>
                              {{ formatSourceLink(source) }}
                            </a>
                            <span v-else class="source-text">{{ source }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Identifiers -->
                  <div v-if="documentMetadata.identifiers && documentMetadata.identifiers.length" class="info-section identifiers-section">
                    <div class="section-content">
                      <div class="section-icon">
                        <v-icon size="18">mdi-identifier</v-icon>
                      </div>
                      <div class="section-text">
                        <div class="section-label">{{ $t('document.info.identifiers') }}</div>
                        <div class="identifiers-list">
                          <div
                            v-for="(id, i) in documentMetadata.identifiers" 
                            :key="i"
                            class="identifier-item"
                            :title="id"
                          >
                            <v-icon size="10" class="mr-1">mdi-barcode</v-icon>
                            <code class="identifier-code">{{ id }}</code>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
            
            <!-- TEXT SEARCH PANEL -->
            <v-expansion-panel>
              <v-expansion-panel-title>
                <div class="d-flex align-center justify-space-between w-100">
                  <span>{{ $t('document.search') }}</span>
                  <span class="text-caption">({{ matches.length }})</span>
                </div>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div class="d-flex align-center mb-2 suppress-page-arrows" style="gap:8px">
                  <v-text-field
                    v-model="searchQ"
                    :label="$t('document.searchPlaceholder')"
                    clearable
                    hide-details
                    density="comfortable"
                    prepend-inner-icon="mdi-magnify"
                    @keydown.enter="doSearch"
                  />
                  <v-tooltip location="bottom">
                    <template #activator="{ props }">
                      <v-btn 
                        @click="doSearch" 
                        variant="tonal" 
                        icon="mdi-magnify"
                        class="search-action-btn"
                        v-bind="props"
                      />
                    </template>
                    <span>{{ $t('search.searchButton') }}</span>
                  </v-tooltip>
                  <v-tooltip location="bottom">
                    <template #activator="{ props }">
                      <v-btn 
                        variant="tonal" 
                        @click="clearHits"
                        icon="mdi-close"
                        class="search-action-btn"
                        v-bind="props"
                      />
                    </template>
                    <span>{{ $t('document.clearHighlights') }}</span>
                  </v-tooltip>
                </div>

                <!-- <v-radio-group v-model="searchMode" inline class="mb-2" density="compact">
                  <v-radio label="Form" value="form" />
                  <v-radio label="Lemma (coming soon)" value="lemma" disabled />
                </v-radio-group> -->

                <div v-if="searching" class="mt-4"><v-progress-linear indeterminate /></div>
                <v-alert v-else-if="matches.length === 0" type="info" variant="tonal">{{ $t('document.noMatches') }}</v-alert>

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
              <v-expansion-panel-title>{{ $t('document.cite.title') }}</v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-textarea :model-value="citation" auto-grow readonly class="mb-2" />
                <v-btn size="small" variant="tonal" @click="copyCitation" prepend-icon="mdi-content-copy">
                  {{ $t('document.cite.copy') }}
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
                :label="$t('document.goToPlaceholder')"
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
              <span class="text-caption text-no-wrap">{{ $t('document.pageCounter', { current: index + 1, total: refs.length }) }}</span>
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
              <strong>{{ $t('document.disclaimer.title') }}</strong>
              {{ $t('document.disclaimer.text') }}
            </div>
          </v-alert>

          <v-expansion-panels multiple>
            <v-expansion-panel>
              <v-expansion-panel-title>{{ $t('document.display.title') }}</v-expansion-panel-title>
              <v-expansion-panel-text>
                <div class="text-subtitle-2 mb-2">{{ $t('document.display.textSize') }}</div>
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
                  <v-btn size="x-small" variant="text" @click="resetSize">{{ $t('document.reset') }}</v-btn>
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
import { useI18n } from 'vue-i18n'
import { fetchNavigation, extractRefsFromNavigation, fetchPage, fetchCollectionRaw } from '../api/dts'

const { t } = useI18n()

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

// Document metadata 
const documentMetadata = ref({
  id: resource,
  title: '',
  author: '',
  language: '',
  dates: [],
  origin: '',
  type: '',
  description: '',
  keywords: [],
  sources: [],
  identifiers: []
})
const documentTitle = computed(() => documentMetadata.value.title || resource)
const hasMetadataDetails = computed(() => (
  documentMetadata.value.author || 
  documentMetadata.value.origin || 
  documentMetadata.value.type
))

// Parse languages for display
const displayLanguages = computed(() => {
  if (!documentMetadata.value.language) return []
  return parseLanguages(documentMetadata.value.language)
})

// Get color for language chips
function getLanguageColor(lang) {
  const colorMap = {
    'Latin': 'indigo',
    'French': 'blue',
    'English': 'red',
    'Italian': 'green',
    'Spanish': 'amber',
    'German': 'brown',
    'Greek': 'teal',
    'Ancient Greek': 'teal',
    'Hebrew': 'deep-purple',
    'Arabic': 'orange',
    'Sanskrit': 'deep-orange'
  }
  return colorMap[lang] || 'primary'
}

// Get color for keyword chips
function getKeywordColor(index) {
  const colors = ['primary', 'secondary', 'info', 'success', 'warning']
  return colors[index % colors.length]
}

// Helper functions for metadata display
function isUrl(str) {
  return /^https?:\/\//.test(str)
}

function formatSourceLink(url) {
  // Shorten the URL for display
  if (url.length > 60) {
    return url.substring(0, 57) + '...'
  }
  return url
}

// Map ISO language codes to full language names
function getLanguageDisplayName(code) {
  const languageMap = {
    'lat': 'Latin',
    'fre': 'French',
    'eng': 'English',
    'ita': 'Italian',
    'spa': 'Spanish',
    'ger': 'German',
    'grc': 'Ancient Greek',
    'heb': 'Hebrew',
    'ara': 'Arabic',
    'san': 'Sanskrit',
    'fr': 'French',
    'en': 'English',
    'it': 'Italian',
    'es': 'Spanish',
    'de': 'German',
    'el': 'Greek',
    'la': 'Latin',
    'he': 'Hebrew',
    'ar': 'Arabic',
    'sa': 'Sanskrit'
  }
  
  // If it's already a full language name, return it
  if (/^[A-Z][a-z]+$/.test(code)) {
    return code
  }
  
  // If it's in our map, return the mapped name
  return languageMap[code.toLowerCase()] || code
}

// Parse a language string that might contain multiple codes
function parseLanguages(langStr) {
  if (!langStr) return []
  
  // Split by commas or spaces
  const langCodes = langStr.split(/[ ,;]+/).filter(Boolean)
  
  // Convert each code to full name
  return langCodes.map(code => getLanguageDisplayName(code))
}

// Fetch document metadata from navigation endpoint which contains Dublin Core metadata
async function fetchDocumentMetadata() {
  try {
    // First try to get metadata from the navigation response
    const nav = await fetchNavigation(resource)
    
    if (nav && nav.resource) {
      // Extract metadata from the resource object and Dublin Core if available
      const resourceData = nav.resource;
      const dublinCore = resourceData.dublinCore || {};
      
      // Handle languages - could be array or string
      let languages = [];
      if (dublinCore.language) {
        languages = Array.isArray(dublinCore.language) ? dublinCore.language : [dublinCore.language];
      }
      
      // Handle dates/coverage - could be array or string
      let dates = [];
      if (dublinCore.coverage) {
        dates = Array.isArray(dublinCore.coverage) ? dublinCore.coverage : [dublinCore.coverage];
      } else if (dublinCore.date) {
        dates = Array.isArray(dublinCore.date) ? dublinCore.date : [dublinCore.date];
      }
      
      // Handle descriptions
      let descriptions = [];
      if (dublinCore.description) {
        descriptions = Array.isArray(dublinCore.description) ? dublinCore.description : [dublinCore.description];
      }
      
      // Handle contributors, creators, authors
      let authors = [];
      if (dublinCore.creator) {
        authors = Array.isArray(dublinCore.creator) ? dublinCore.creator : [dublinCore.creator];
      } else if (dublinCore.contributor) {
        authors = Array.isArray(dublinCore.contributor) ? dublinCore.contributor : [dublinCore.contributor];
      }
      
      // Handle subjects or keywords
      let keywords = [];
      if (dublinCore.subject) {
        keywords = Array.isArray(dublinCore.subject) ? dublinCore.subject : [dublinCore.subject];
      }
      
      // Handle sources
      let sources = [];
      if (dublinCore.source) {
        sources = Array.isArray(dublinCore.source) ? dublinCore.source : [dublinCore.source];
      }
      
      // Handle identifiers
      let identifiers = [];
      if (dublinCore.identifier) {
        identifiers = Array.isArray(dublinCore.identifier) ? dublinCore.identifier : [dublinCore.identifier];
      }
      
      // Extract metadata from navigation response
      documentMetadata.value = {
        id: resource,
        title: resourceData.title || resourceData.label || resource,
        author: authors.join(', '),
        language: languages.join(', '),
        dates: dates,
        description: descriptions.join('\n'),
        type: resourceData.type || resourceData['@type'] || '',
        keywords: keywords,
        sources: sources,
        identifiers: identifiers
      };
      
      // If no metadata found in navigation, try the collection endpoint as fallback
      if (!documentMetadata.value.title || documentMetadata.value.title === resource) {
        try {
          const collectionData = await fetchCollectionRaw(resource);
          if (collectionData && typeof collectionData === 'object') {
            documentMetadata.value.title = collectionData.title || collectionData.label || documentMetadata.value.title;
            if (!documentMetadata.value.author) {
              documentMetadata.value.author = collectionData.creator || collectionData.author || '';
            }
            if (!documentMetadata.value.description) {
              documentMetadata.value.description = collectionData.description || '';
            }
          }
        } catch (err) {
          console.warn('Failed to fetch fallback metadata from collection:', err);
        }
      }
    }
  } catch (error) {
    console.warn('Failed to fetch document metadata:', error);
    // Try collection as fallback
    try {
      const data = await fetchCollectionRaw(resource);
      if (data && typeof data === 'object') {
        documentMetadata.value = {
          id: resource,
          title: data.title || data.label || resource,
          author: data.creator || data.author || '',
          language: data.language || '',
          dates: Array.isArray(data.date) ? data.date : (data.date ? [data.date] : []),
          description: data.description || '',
          type: data.type || data['@type'] || ''
        };
      }
    } catch (fallbackError) {
      console.warn('Failed to fetch fallback metadata:', fallbackError);
    }
  }
}
const navigateTo = (ref) => {
  if (!ref) return
  if (route.params.ref === ref) return // skip redundant replace
  router.replace({
    name: 'documentRef',
    params: { resource: encodeURIComponent(resource), ref }
  })
}
/* Left panels */
const openPanels = ref([0, 1]) // Panel 0 is Document Info, 1 is Search
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
  
  // Extract metadata directly from the navigation response if possible
  if (nav && nav.resource && nav.resource.dublinCore) {
    processNavigationMetadata(nav);
  }
  
  if (!currentRef.value && refs.value.length) {
    navigateTo(refs.value[0])
  }
}

// Process metadata from navigation response
function processNavigationMetadata(nav) {
  if (!nav || !nav.resource) return;
  
  const resourceData = nav.resource;
  const dublinCore = resourceData.dublinCore || {};
  
  // Update metadata with Dublin Core values if present
  if (Object.keys(dublinCore).length > 0) {
    // Handle languages - store raw codes to process in computed property
    if (dublinCore.language) {
      const languages = Array.isArray(dublinCore.language) ? dublinCore.language : [dublinCore.language];
      documentMetadata.value.language = languages.join(', ');
    }
    
    // Handle dates/coverage
    if (dublinCore.coverage) {
      documentMetadata.value.dates = Array.isArray(dublinCore.coverage) ? dublinCore.coverage : [dublinCore.coverage];
    } else if (dublinCore.date) {
      documentMetadata.value.dates = Array.isArray(dublinCore.date) ? dublinCore.date : [dublinCore.date];
    }
    
    // Handle identifiers as extra source info
    if (dublinCore.identifier) {
      documentMetadata.value.identifiers = Array.isArray(dublinCore.identifier) ? dublinCore.identifier : [dublinCore.identifier];
    }
    
    // Handle sources which might contain URLs to original materials
    if (dublinCore.source) {
      documentMetadata.value.sources = Array.isArray(dublinCore.source) ? dublinCore.source : [dublinCore.source];
    }
    
    // Update description if it contains extra info
    if (dublinCore.description) {
      const descriptions = Array.isArray(dublinCore.description) ? dublinCore.description : [dublinCore.description];
      if (descriptions.length > 0) {
        documentMetadata.value.description = descriptions.join('\n');
      }
    }
  }
  
  // Always update the title from resource data
  if (resourceData.title) {
    documentMetadata.value.title = resourceData.title;
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
        el.classList.contains('rubric')
        // Marginal notes should remain inline, not treated as block elements

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
    // Use updated API endpoint with pagination support
    const params = new URLSearchParams()
    params.append('q', searchQ.value)
    params.append('resource', resource)
    params.append('mode', 'exact')
    params.append('page', '1') // First page for in-document search
    params.append('size', '50') // Reasonable size for in-document search
    
    const url = `${BASE}/search/?${params.toString()}`
    const res = await fetch(url, { signal: ctrl.signal })
    if (!res.ok) throw new Error('Search failed')
    const data = await res.json()
    
    // Handle the response format with total and items
    const items = data.items || []
    matches.value = items.filter(d => d?.ref).map(d => ({ 
      ref: d.ref, 
      snippet: d.snippet || '',
      title: d.title || ''
    }))
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
    if (!openPanels.value.includes(1)) {  // Index 1 is now the search panel
      openPanels.value.push(1)
    }
  }
  
  // Load navigation and metadata together
  // We'll extract metadata from navigation response in loadNav
  await loadNav()
  
  // If navigation didn't provide metadata, fetch it separately
  if (!documentMetadata.value.title || documentMetadata.value.title === resource) {
    await fetchDocumentMetadata()
  }
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

/* Document Info Panel Layout */
.info-panel-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.03); /* Light grey background for light mode */
}

.info-section {
  padding: 12px;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.06); /* Slightly darker grey for sections */
  border: 1px solid rgba(0, 0, 0, 0.08); /* Subtle border */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12); /* Light shadow */
}

.info-section .section-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.info-section .section-text {
  flex: 1;
}

.info-section .section-icon {
  color: var(--v-theme-primary); /* Use primary color for icons in light mode */
}

.info-section .section-label {
  font-weight: bold;
  color: var(--v-theme-on-surface); /* Use Vuetify theme variable */
}

.doc-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 8px;
  color: var(--v-theme-on-surface); /* Use Vuetify theme variable */
}

.description-text,
.section-value {
  color: var(--v-theme-on-surface-variant); /* Use Vuetify theme variable */
}

.date-chip {
  margin-right: 4px;
}

.keywords-container {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.sources-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.source-link {
  text-decoration: none;
  color: var(--v-theme-primary); /* Use Vuetify theme variable */
}

.source-link:hover {
  text-decoration: underline;
  opacity: 0.8;
}

.identifier-code {
  word-break: break-all;
  white-space: normal;
  display: inline-block;
  max-width: 100%;
  color: var(--v-theme-on-surface-variant); /* Use Vuetify theme variable */
}

.identifiers-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.identifier-item {
  padding: 4px 8px;
  border-radius: 4px;
  font-family: monospace;
  background-color: rgba(0, 0, 0, 0.08); /* Light background for identifiers */
  border: 1px solid rgba(0, 0, 0, 0.12); /* Subtle border */
  color: var(--v-theme-on-surface-variant); /* Consistent text color */
}

/* Theming for document info panel - works with Vuetify theme system */
:deep(.v-theme--dark) {
  .info-panel-wrapper {
    background-color: rgba(255, 255, 255, 0.05);
  }

  .info-section {
    background-color: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }

  .info-section .section-icon {
    color: var(--v-theme-primary-lighten-1, #90caf9);
  }

  .identifier-item {
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.15);
  }
}
/* ::v-deep(.v-expansion-panel-text__wrapper) {
  padding-left: 0 !important;
  padding-right: 0 !important;
} */
.custom-panel ::v-deep(.v-expansion-panel-text__wrapper) {
  padding-left: 0 !important;
  padding-right: 0 !important;
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
  /* Main container styling to match original XSL */
  width: 100%;
  position: relative; /* Important for absolute positioning of marginal notes */
}

/* Ensure styles apply to rendered TEI content regardless of wrapper */
:deep(.reader-html #rendered-tei) {
  width: 100%;
  position: relative;
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

/* Page break chip - matching original XSL styling */
:deep(.pb) {
  font-size: smaller; /* Match original XSL "smaller" value */
  display: inline-block;
  position: static;
  margin: 0.5rem 0 0.25rem;
  padding: 2px 8px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  border-radius: 999px;
  background: color-mix(in oklab, var(--v-theme-primary, #6750A4), white 85%);
  color: color-mix(in oklab, var(--v-theme-primary, #6750A4), black 35%);
}
:deep(.reader-html > .pb:not(:first-child)) {
  position: sticky; top: 8px; z-index: 1;
}

/* Rubrics - matching original XSL styling */
:deep(.rubric) {
  color: #ff0000;
  font-size: larger;
  font-weight: bold;
  display: inline; /* Keep inline to match original XSL behavior */
}

/* Marginal notes - inline with better styling */
:deep(.marginal) {
  display: inline;
  font-size: 0.9em;
  color: #555;
  padding: 0.2em 0.4em;
  margin: 0 0.5em;
  background: color-mix(in oklab, var(--v-theme-surface, #fff), var(--v-theme-on-surface, #000) 8%);
  border-radius: 4px;
  border: 1px solid color-mix(in oklab, var(--v-theme-primary, #6750A4), white 70%);
}

/* Highlights */
:deep(mark.dts-hit){
  background: rgba(255, 214, 51, 0.65);
  padding: 0 .15em; border-radius: 3px;
}

/* Search action buttons - square-ish style */
.search-action-btn {
  width: 40px !important; 
  height: 40px !important; 
  min-width: 40px !important;
  border-radius: 8px !important;
  font-size: 18px;
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

:deep(.v-theme--dark) {
  .size-readout {
    border: 1px solid rgba(255, 255, 255, 0.24);
    background-color: rgba(255, 255, 255, 0.08);
    color: var(--v-theme-on-surface);
  }
}

/* Images */
.reader-html img { max-width: 100%; height: auto; }

/* Emphasize highlights in results */
.result-list :deep(mark.dts-hit) { font-weight: 600; }
</style>
