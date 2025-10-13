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
                <div class="d-flex align-center w-100">
                  <h2 class="document-main-title">{{ documentTitle }}</h2>
                </div>
              </v-expansion-panel-title>
              <v-expansion-panel-text class="custom-panel">
                <div class="info-panel-wrapper">
                  <!-- Languages and Dates Section - Compact Inline -->
                  <div v-if="uniqueDisplayLanguages.length || (documentMetadata.dates && documentMetadata.dates.length)" class="chips-section">
                    <v-chip 
                      v-for="(lang, i) in uniqueDisplayLanguages" 
                      :key="`lang-${i}`" 
                      size="small" 
                      :color="getLanguageColor(lang)"
                      variant="flat"
                      class="info-chip language-chip"
                    >
                      <v-icon size="14" class="mr-1">mdi-translate</v-icon>
                      {{ lang }}
                    </v-chip>
                    <v-chip 
                      v-for="(date, i) in documentMetadata.dates" 
                      :key="`date-${i}`" 
                      size="small" 
                      variant="flat"
                      color="amber-darken-2"
                      class="info-chip date-chip"
                    >
                      <v-icon size="14" class="mr-1">mdi-calendar</v-icon>
                      {{ formatDateForDisplay(date) }}
                    </v-chip>
                  </div>
                  
                  <!-- Description Section -->
                  <div v-if="documentMetadata.description" class="info-section description-section">
                    <div class="section-header">
                      <v-icon size="18" class="section-icon">mdi-text-box-outline</v-icon>
                    </div>
                    <p class="section-text">{{ documentMetadata.description }}</p>
                  </div>
                  
                  <!-- Metadata Details -->
                  <div v-if="hasMetadataDetails" class="info-section metadata-section">
                    <div v-if="documentMetadata.author" class="metadata-item">
                      <div class="section-header">
                        <v-icon size="18" class="section-icon">mdi-account-outline</v-icon>
                        <span class="section-label">{{ $t('document.info.author') }}</span>
                      </div>
                      <div class="section-text">{{ documentMetadata.author }}</div>
                    </div>
                    
                    <div v-if="documentMetadata.origin" class="metadata-item">
                      <div class="section-header">
                        <v-icon size="18" class="section-icon">mdi-map-marker-outline</v-icon>
                        <span class="section-label">{{ $t('document.info.origin') }}</span>
                      </div>
                      <div class="section-text">{{ documentMetadata.origin }}</div>
                    </div>
                    
                    <div v-if="documentMetadata.type" class="metadata-item">
                      <div class="section-header">
                        <v-icon size="18" class="section-icon">mdi-file-document-outline</v-icon>
                        <span class="section-label">{{ $t('document.info.type') }}</span>
                      </div>
                      <div class="section-text">{{ documentMetadata.type }}</div>
                    </div>
                  </div>
                  
                  <!-- Keywords -->
                  <div v-if="documentMetadata.keywords && documentMetadata.keywords.length" class="info-section keywords-section">
                    <div class="section-header">
                      <v-icon size="18" class="section-icon">mdi-tag-multiple-outline</v-icon>
                      <span class="section-label">{{ $t('document.info.keywords') }}</span>
                    </div>
                    <div class="keywords-container">
                      <v-chip 
                        v-for="(keyword, i) in documentMetadata.keywords" 
                        :key="i" 
                        size="small" 
                        variant="flat"
                        :color="getKeywordColor(i)"
                        class="info-chip keyword-chip"
                      >
                        {{ keyword }}
                      </v-chip>
                    </div>
                  </div>
                  
                  <!-- Biblissima Link -->
                  <div v-if="biblissimaUrl" class="info-section biblissima-section">
                    <div class="section-header">
                      <v-icon size="18" class="section-icon">mdi-open-in-new</v-icon>
                    </div>
                    <a 
                      :href="biblissimaUrl" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      class="biblissima-link"
                    >
                      {{ $t('document.info.biblissimaLink', 'Biblissima link') }}
                    </a>
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

            <!-- DISPLAY PANEL -->
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
          <!-- Transcription Quality Disclaimer -->
          <v-alert
            v-if="showDisclaimer"
            type="warning"
            variant="tonal"
            density="compact"
            class="mb-3"
            closable
            @click:close="showDisclaimer = false"
          >
            <template #prepend>
              <v-icon>mdi-information-outline</v-icon>
            </template>
            <div class="text-body-2">
              <strong>{{ $t('document.disclaimer.title') }}</strong>
              {{ $t('document.disclaimer.text') }}
            </div>
          </v-alert>

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

        <!-- RIGHT: IIIF Viewer -->
        <v-col cols="12" md="3">
          <div v-if="iiifManifestUrl" class="iiif-viewer-container">
            <div class="iiif-viewer-header">
              <h3 class="iiif-viewer-title">{{ $t('document.iiif.title', 'Manuscript Viewer') }}</h3>
              <v-tooltip location="bottom">
                <template #activator="{ props }">
                  <v-btn
                    size="small"
                    variant="text"
                    icon="mdi-sync"
                    class="sync-btn"
                    @click="syncTifyWithPassage(currentRef)"
                    v-bind="props"
                  >
                  </v-btn>
                </template>
                <span>{{ $t('document.iiif.sync', 'Sync with current passage') }}</span>
              </v-tooltip>
            </div>
            <div ref="tifyEl" class="tify-viewer"></div>
          </div>
          <div v-else class="no-iiif-message">
            <v-icon size="48" color="grey-lighten-1">mdi-image-off-outline</v-icon>
            <p class="text-body-2 text-grey mt-2">{{ $t('document.iiif.noManifest', 'No manuscript images available') }}</p>
          </div>
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
const tifyEl = ref(null)
const tifyInstance = ref(null)
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

// Get unique languages (remove duplicates)
const uniqueDisplayLanguages = computed(() => {
  if (!displayLanguages.value.length) return []
  return [...new Set(displayLanguages.value)]
})

// Biblissima URL from first identifier
const biblissimaUrl = computed(() => {
  if (!documentMetadata.value.identifiers || !documentMetadata.value.identifiers.length) return null
  const firstIdentifier = documentMetadata.value.identifiers[0]
  if (!firstIdentifier) return null
  return `https://portail.biblissima.fr/${firstIdentifier}`
})

// IIIF Manifest URL from sources (Dublin Core)
const iiifManifestUrl = computed(() => {
  if (!documentMetadata.value.sources || !documentMetadata.value.sources.length) return null
  // Find the first source that looks like an IIIF manifest URL
  const manifestSource = documentMetadata.value.sources.find(source => 
    typeof source === 'string' && (
      source.includes('iiif') || 
      source.includes('manifest') ||
      source.endsWith('/manifest.json') ||
      source.endsWith('/manifest')
    )
  )
  return manifestSource || documentMetadata.value.sources[0]
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

// Normalize date range input (same logic as CatalogTree)
function normalizeDateRange(input) {
  if (!input) return ''
  input = input.toString().trim();

  // If already a range like "1000–1100", keep as is
  if (/^\d{3,4}–\d{3,4}$/.test(input)) {
    return input;
  }

  // Match things like "1000–", "1050–", etc.
  const match = input.match(/^(\d{3,4})–$/);
  if (match) {
    const start = parseInt(match[1], 10);

    // Rule 1: centuries (like 1000–, 800–, 801–)
    if (start % 100 === 0 || start % 100 === 1) {
      const centuryStart = Math.floor(start / 100) * 100 + 1;
      const centuryEnd = centuryStart + 99;
      return `${centuryStart}–${centuryEnd}`;
    }

    // Rule 2: ends in 25 or 75 → add 25
    if (start % 100 === 25) return `${start}–${start + 25}`;
    if (start % 100 === 75) return `${start}–${start + 25}`;

    // Rule 3: ends in 50 → add 50
    if (start % 100 === 50) return `${start}–${start + 50}`;
  }

  // Rule 4: precise start only, remove trailing '–'
  if (/^\d{3,4}–$/.test(input)) {
    return input.replace(/–$/, '');
  }

  // Rule 5: keep both if already in range format
  return input;
}

// Format date for display (same logic as CatalogTree)
function formatDateForDisplay(dateStr) {
  if (!dateStr) return ''
  
  const trimmed = dateStr.toString().trim()
  
  // Case 1: Already a complete range like "1000–1100" - return as-is
  if (/^\d{3,4}–\d{3,4}$/.test(trimmed)) {
    return trimmed
  }
  
  // Case 2: Single year with trailing – like "1000–" - apply normalization
  if (/^\d{3,4}–$/.test(trimmed)) {
    return normalizeDateRange(trimmed)
  }
  
  // Case 3: Just a plain year like "1000" - add – and normalize
  if (/^\d{3,4}$/.test(trimmed)) {
    const normalized = normalizeDateRange(`${trimmed}–`)
    return normalized
  }
  
  // Case 4: Anything else - return as-is
  return trimmed
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
const openPanels = ref([0, 1]) // Panel 0 is Document Info, 1 is Search, 2 is Display, 3 is Cite
const searchQ = ref('')
const searchMode = ref('form')
const matches = ref([])
const searching = ref(false)
const highlightTerm = ref('')
let keyListenerBound = false
const pageCtrl = ref(null)
const searchCtrl = ref(null)

/* Disclaimer state */
const DISCLAIMER_KEY = 'hideDisclaimer'
const showDisclaimer = ref(localStorage.getItem(DISCLAIMER_KEY) !== 'true')
watch(showDisclaimer, v => {
  if (!v) {
    localStorage.setItem(DISCLAIMER_KEY, 'true')
  }
})
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

// Initialize Tify viewer when manifest URL is available
watch([iiifManifestUrl, tifyEl], ([manifestUrl, el]) => {
  if (manifestUrl && el && window.Tify) {
    // Clear any existing Tify instance
    el.innerHTML = ''
    tifyInstance.value = null
    
    // Initialize Tify with the manifest URL
    try {
      tifyInstance.value = new window.Tify({
        container: el,
        manifestUrl: manifestUrl,
        language: 'en', // or get from i18n
        stylesheet: false, // We're using the CDN stylesheet
      })
      
      // Auto-sync Tify viewer with current text reader page upon initialization
      if (tifyInstance.value) {
        // Sync with current passage after a short delay to let Tify initialize
        setTimeout(() => {
          if (tifyInstance.value && currentRef.value) {
            // Special case: if text reader is on page 1 (index 0), force Tify to page 1
            if (index.value === 0) {
              tifyInstance.value.setPage(1) // Force to page 1 (0-indexed)
              console.log('Tify synced to page 1 for first passage')
            } else {
              // Otherwise, sync normally with the current passage
              syncTifyWithPassage(currentRef.value)
            }
          }
        }, 200) // Slightly longer delay to ensure Tify is fully loaded
      }
    } catch (error) {
      console.error('Failed to initialize Tify viewer:', error)
    }
  }
}, { immediate: true })

// Sync Tify viewer with current passage
function syncTifyWithPassage(passageRef) {
  if (!tifyInstance.value || !passageRef) return
  
  try {
    // Extract page number from passage reference
    // This assumes passage refs are like "1.1", "1.2", "2.1", etc.
    // or might contain page markers like "p1", "page1", "fol1", etc.
    
    // Try different patterns to extract page/canvas number
    let pageNum = null
    
    // Pattern 1: Extract first number from ref like "1.1" -> 1
    const match1 = passageRef.match(/^(\d+)/)
    if (match1) {
      pageNum = parseInt(match1[1], 10)
    }
    
    // Pattern 2: Look for explicit page markers like "p12", "page12", "fol12"
    const match2 = passageRef.match(/(?:p|page|fol|folio)\.?\s*(\d+)/i)
    if (match2) {
      pageNum = parseInt(match2[1], 10)
    }
    
    // Pattern 3: Try to get index from refs array
    if (!pageNum && refs.value.length > 0) {
      const currentIndex = refs.value.findIndex(r => r === passageRef)
      if (currentIndex >= 0) {
        pageNum = currentIndex + 1 // IIIF pages are usually 1-indexed
      }
    }
    
    if (pageNum !== null && tifyInstance.value.setPage) {
      // The first page in Tify counts as 2 pages (cover spread)
      // After that, pages are 1:1 with our passages
      // So: passage 1 -> tify page 0, passage 2 -> tify page 2, passage 3 -> tify page 3, etc.
      let tifyPageIndex
      if (pageNum === 1) {
        tifyPageIndex = 1  // First passage shows the cover spread (pages 0-1)
        console.log('Tify synced to page 1 for first passage')
      } else {
        tifyPageIndex = pageNum  // After the first, add 1 to account for the cover spread
      }
      tifyInstance.value.setPage(tifyPageIndex)
    }
  } catch (error) {
    console.warn('Failed to sync Tify viewer with passage:', error)
  }
}

// Watch for passage changes and sync with Tify
watch(currentRef, (newRef) => {
  if (newRef && tifyInstance.value) {
    syncTifyWithPassage(newRef)
  }
})

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
    if (!openPanels.value.includes(1)) {  // Index 1 is the search panel
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
.document-main-title {
  font-size: 1.1rem !important;
  font-weight: 600;
  color: var(--v-theme-on-surface);
  margin: 0;
  line-height: 1.3;
}

.info-panel-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(var(--v-theme-primary-rgb), 0.04) 0%, rgba(var(--v-theme-secondary-rgb), 0.04) 100%);
  border: 1px solid rgba(var(--v-theme-outline-rgb), 0.12);
}

/* Chips Section - Compact inline layout with color */
.chips-section {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  padding: 6px 8px;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(103, 80, 164, 0.06) 0%, rgba(66, 165, 245, 0.06) 100%);
  border: 1px solid rgba(103, 80, 164, 0.12);
}

.info-chip {
  font-weight: 500;
  text-transform: capitalize;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.info-chip:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
}

/* Info Section - Unified consistent design with subtle color */
.info-section {
  padding: 10px 12px;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(248, 249, 250, 1) 0%, rgba(241, 243, 245, 1) 100%);
  border: 1px solid rgba(var(--v-theme-outline-rgb), 0.12);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.info-section:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-color: rgba(var(--v-theme-primary-rgb), 0.2);
  background: linear-gradient(135deg, rgba(103, 80, 164, 0.06) 0%, rgba(66, 165, 245, 0.06) 100%);
}

/* Unified header style for all sections */
.section-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}

.section-icon {
  color: var(--v-theme-primary);
  flex-shrink: 0;
}

.section-label {
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--v-theme-primary);
  opacity: 0.9;
}

.section-text {
  font-size: 0.9rem;
  line-height: 1.45;
  color: var(--v-theme-on-surface);
  margin: 0;
  padding-left: 24px;
}

/* Description specific - with subtle accent */
.description-section {
  background: linear-gradient(135deg, rgba(103, 80, 164, 0.06) 0%, rgba(66, 165, 245, 0.06) 100%);
  border-color: rgba(251, 140, 0, 0.15);
}

.description-section .section-text {
  font-style: italic;
  color: var(--v-theme-on-surface-variant);
}

/* Metadata section - with cool blue tint */
.metadata-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: linear-gradient(135deg, rgba(232, 245, 253, 0.6) 0%, rgba(225, 242, 252, 0.6) 100%);
  border-color: rgba(3, 169, 244, 0.15);
}

.metadata-item {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

/* Keywords section - with purple tint */
.keywords-section {
  background: linear-gradient(135deg, rgba(243, 237, 251, 0.6) 0%, rgba(237, 229, 248, 0.6) 100%);
  border-color: rgba(103, 80, 164, 0.15);
}

.keywords-section .keywords-container {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  padding-left: 24px;
}

/* Biblissima section - with green tint */
.biblissima-section {
  text-align: left;
  background: linear-gradient(135deg, rgba(103, 80, 164, 0.06) 0%, rgba(66, 165, 245, 0.06) 100%);
  border: 1px solid rgba(76, 175, 80, 0.2);
}

.biblissima-link {
  display: block;
  text-decoration: none;
  color: var(--v-theme-primary);
  font-weight: 600;
  font-size: 0.9rem;
  padding-left: 24px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.biblissima-link:hover {
  color: var(--v-theme-primary-darken-1);
  text-decoration: underline;
  padding-left: 26px;
}

/* Dark theme overrides */
:deep(.v-theme--dark) {
  .info-panel-wrapper {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.05) 100%);
    border: 1px solid rgba(255, 255, 255, 0.14);
  }

  .chips-section {
    background: linear-gradient(135deg, rgba(103, 80, 164, 0.15) 0%, rgba(66, 165, 245, 0.15) 100%);
    border: 1px solid rgba(255, 255, 255, 0.12);
  }

  .info-section {
    background: linear-gradient(135deg, rgba(103, 80, 164, 0.06) 0%, rgba(66, 165, 245, 0.06) 100%);
    border: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
  }

  .info-section:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
    border-color: rgba(255, 255, 255, 0.2);
    background: linear-gradient(135deg, rgba(103, 80, 164, 0.06) 0%, rgba(66, 165, 245, 0.06) 100%);
  }

  .section-icon {
    color: var(--v-theme-primary-lighten-1);
  }

  .description-section {
    background: linear-gradient(135deg, rgba(103, 80, 164, 0.06) 0%, rgba(66, 165, 245, 0.06) 100%);
    border: 1px solid rgba(255, 255, 255, 0.12);
  }

  .metadata-section {
    background: linear-gradient(135deg, rgba(33, 150, 243, 0.08) 0%, rgba(100, 181, 246, 0.08) 100%);
    border-color: rgba(33, 150, 243, 0.2);
  }

  .keywords-section {
    background: linear-gradient(135deg, rgba(156, 39, 176, 0.08) 0%, rgba(186, 104, 200, 0.08) 100%);
    border-color: rgba(156, 39, 176, 0.2);
  }

  .biblissima-section {
    background: linear-gradient(135deg, rgba(76, 175, 80, 0.12) 0%, rgba(129, 199, 132, 0.12) 100%);
    border: 1px solid rgba(255, 255, 255, 0.12);
  }

  .biblissima-link:hover {
    padding-left: 26px;
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
  /* Disable typographic ligatures to keep medieval letterforms literal and avoid unexpected substitutions */
  font-variant-ligatures: none;
  font-feature-settings: 'liga' 0, 'clig' 0, 'hlig' 0, 'calt' 0;
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

/* IIIF Viewer Styles */
.iiif-viewer-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 120px);
  border-radius: 12px;
  overflow: hidden;
  background: rgba(var(--v-theme-surface-rgb), 1);
  border: 1px solid rgba(var(--v-theme-outline-rgb), 0.12);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.iiif-viewer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px 8px 16px;
  background: linear-gradient(135deg, rgba(var(--v-theme-primary-rgb), 0.06) 0%, rgba(var(--v-theme-secondary-rgb), 0.06) 100%);
  border-bottom: 1px solid rgba(var(--v-theme-outline-rgb), 0.12);
}

.iiif-viewer-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--v-theme-on-surface);
  margin: 0;
}

.sync-btn {
  opacity: 0.7;
  transition: all 0.2s ease;
}

.sync-btn:hover {
  opacity: 1;
  transform: rotate(180deg);
}

.tify-viewer {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.no-iiif-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  padding: 24px;
  text-align: center;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(var(--v-theme-surface-rgb), 0.6) 0%, rgba(var(--v-theme-surface-variant-rgb), 0.4) 100%);
  border: 1px dashed rgba(var(--v-theme-outline-rgb), 0.3);
}

:deep(.v-theme--dark) {
  .iiif-viewer-container {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  .iiif-viewer-header {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.06) 100%);
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  }

  .no-iiif-message {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.02) 100%);
    border: 1px dashed rgba(255, 255, 255, 0.2);
  }
}
</style>
