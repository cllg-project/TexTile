<template>
  <v-container fluid class="py-0 px-0">
    <v-sheet color="primary" class="py-4">
      <v-container>
        <h1 class="text-h2 font-weight-bold text-white">{{ $t('catalog.title') }}</h1>
        <p class="text-white opacity-90">{{ $t('catalog.subtitle') }}</p>
      </v-container>
    </v-sheet>

    <v-container class="py-6">
      <v-row class="mb-4" align="center">
        <v-col cols="12" md="6">
          <!-- Legacy Browse Mode -->
          <v-autocomplete
            v-if="searchMode === 'legacy'"
            v-model="q"
            :items="suggestions"
            item-title="title"
            item-value="value"
            :label="$t('catalog.searchPlaceholder')"
            prepend-inner-icon="mdi-format-list-bulleted"
            clearable 
            hide-details 
            density="comfortable"
            :loading="isLoading"
          />
          
          <!-- Metadata Search Mode -->
          <div v-else class="d-flex align-center gap-2">
            <!-- Search Type Toggle -->
            <v-btn-toggle
              v-model="selectedSearchType"
              mandatory
              variant="outlined"
              density="compact"
              class="flex-shrink-0"
            >
              <v-btn 
                v-for="type in searchTypes" 
                :key="type.value"
                :value="type.value" 
                size="small"
                class="px-2"
              >
                <v-icon 
                  :color="selectedSearchType === type.value ? type.color : 'grey'" 
                  size="small"
                  class="mr-1"
                >
                  {{ type.icon }}
                </v-icon>
                {{ $t(`catalog.searchTypes.${type.value}`) }}
              </v-btn>
            </v-btn-toggle>

            <!-- Search Input -->
            <v-text-field
              v-model="metadataQuery"
              :label="$t(`catalog.searchTypes.${selectedSearchType}`)"
              :placeholder="$t(`catalog.placeholders.${selectedSearchType}`)"
              prepend-inner-icon="mdi-magnify"
              clearable
              hide-details
              density="comfortable"
              :loading="isLoading"
              class="flex-grow-1"
              @keyup.enter="performMetadataSearch(metadataQuery, selectedSearchType)"
            >
              <template #append-inner>
                <v-btn 
                  icon="mdi-magnify" 
                  variant="text" 
                  size="small" 
                  @click="performMetadataSearch(metadataQuery, selectedSearchType)"
                  :disabled="!metadataQuery?.trim()"
                />
              </template>
            </v-text-field>
          </div>
        </v-col>
        
        <v-col cols="auto">
          <v-btn-toggle
            v-model="searchMode"
            mandatory
            variant="outlined"
            density="compact"
          >
            <v-btn value="legacy" size="small">
              <v-icon start>mdi-format-list-bulleted</v-icon>
              {{ $t('catalog.legacyBrowse') }}
            </v-btn>
            <v-btn value="metadata" size="small">
              <v-icon start>mdi-database-search</v-icon>
              {{ $t('catalog.metadataSearch') }}
            </v-btn>
          </v-btn-toggle>
        </v-col>
        
        <v-spacer />
        <!-- expand/collapse buttons -->
        <!-- <v-btn class="mr-2" variant="tonal" @click="expandAll" :loading="isExpanding">{{ $t('catalog.expandAll') }}</v-btn>
        <v-btn variant="tonal" @click="collapseAll">{{ $t('catalog.collapseAll') }}</v-btn> -->
      </v-row>

      <v-card>
        <v-card-text>
          <!-- Error display -->
          <v-alert
            v-if="searchError"
            type="error"
            variant="tonal"
            density="compact"
            class="mb-4"
            closable
            @click:close="searchError = ''"
          >
            {{ searchError }}
          </v-alert>

          <!-- Loading indicator -->
          <div v-if="isLoading" class="text-center py-8">
            <v-progress-circular
              indeterminate
              size="64"
              color="primary"
              class="mb-4"
            />
            <p class="text-h6">{{ searchMode === 'metadata' ? 'Searching manuscripts...' : 'Loading catalog...' }}</p>
          </div>

          <!-- No results -->
          <div v-else-if="hasSearchQuery && filtered.length === 0 && !searchError" class="text-center py-4 text-grey">
            <v-icon size="48" class="mb-2">mdi-magnify</v-icon>
            <p>{{ $t('catalog.noResults') }}</p>
            <p class="text-caption">
              {{ searchMode === 'metadata' ? 'Try different metadata terms like "latin", "Tournai", "1301"' : 'Try searching by title, ID, or partial matches' }}
            </p>
          </div>

          <!-- Results found -->
          <div v-else-if="hasSearchQuery" class="mb-3">
            <v-chip 
              :color="searchMode === 'metadata' ? currentSearchType.color : 'primary'" 
              variant="outlined" 
              size="small"
            >
              <v-icon start size="small">{{ searchMode === 'metadata' ? currentSearchType.icon : 'mdi-format-list-bulleted' }}</v-icon>
              {{ filtered.length }} {{ itemTypeText }}{{ filtered.length !== 1 ? 's' : '' }} found
              {{ searchMode === 'metadata' ? `(${currentSearchType.value} search)` : '(browse)' }}
            </v-chip>
          </div>

          <!-- Pagination info for browse mode -->
          <div v-else-if="!hasSearchQuery && paginatedResults.length > 0" class="mb-3">
            <v-chip variant="outlined" size="small" color="primary">
              <v-icon start size="small">mdi-format-list-bulleted</v-icon>
              Showing {{ paginatedResults.length }} of {{ filtered.length }} {{ itemTypeText }}{{ filtered.length !== 1 ? 's' : '' }}
            </v-chip>
          </div>

          <!-- Catalog Tree -->
          <div v-if="!isLoading">
            <CatalogTree :nodes="paginatedResults" ref="treeRef" />
            
            <!-- Load More Button -->
            <div v-if="hasMoreItems" class="text-center mt-4">
              <v-btn 
                variant="outlined" 
                color="primary"
                :loading="isLoadingMore"
                @click="loadMoreItems"
                prepend-icon="mdi-chevron-down"
              >
                Load {{ Math.min(itemsPerPage, filtered.length - displayedItemsCount) }} more
              </v-btn>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <v-expansion-panels class="mt-4" variant="accordion">
        <v-expansion-panel>
          <v-expansion-panel-title>Raw (debug)</v-expansion-panel-title>
          <v-expansion-panel-text><pre>{{ raw }}</pre></v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-container>
  </v-container>
</template>
<script setup>
import { onMounted, ref, computed, watch, nextTick } from 'vue'
import { fetchRootCollection, parseMembers, fetchCollectionRaw, searchManuscripts } from '../api/dts'
import CatalogTree from '../components/CatalogTree.vue'

const raw = ref('')
const nodes = ref([])
const q = ref('')
const metadataQuery = ref('')
const allResources = ref([]) // Store all resources for comprehensive search
const isLoading = ref(false)

// Pagination
const itemsPerPage = 25
const displayedItemsCount = ref(itemsPerPage)
const isLoadingMore = ref(false)

// Search mode and functionality
const searchMode = ref('legacy') // 'legacy' or 'metadata'
const manuscriptResults = ref([]) // Results from manuscript search
const hasSearchBeenPerformed = ref(false) // Track if a search has been performed
const searchError = ref('') // Store search error messages

// Metadata search types configuration
const selectedSearchType = ref('general')

const searchTypes = [
  {
    value: 'general',
    color: 'primary',
    icon: 'mdi-database-search',
    endpoint: '/manuscripts/'
  },
  {
    value: 'language',
    color: 'success',
    icon: 'mdi-translate',
    endpoint: '/manuscripts/language/'
  },
  {
    value: 'date',
    color: 'warning',
    icon: 'mdi-calendar',
    endpoint: '/manuscripts/range/' // Now uses range endpoint for simple ranges
  }
]

const currentSearchType = computed(() => {
  return searchTypes.find(type => type.value === selectedSearchType.value) || searchTypes[0]
})

// Build suggestions for legacy browse mode
const suggestions = computed(() => {
  const items = [...nodes.value]
  // Only include pre-loaded resources if available
  allResources.value.forEach(resource => {
    if (!items.find(item => item.id === resource.id)) {
      items.push(resource)
    }
  })
  return items.map(n => ({ 
    id: n.id, 
    title: `${n.title} ${n.kind === 'resource' ? '(manuscript)' : '(collection)'}`,
    value: n.title
  }))
})

// Helper computed properties for search display
const hasSearchQuery = computed(() => {
  if (searchMode.value === 'metadata') {
    // Only show search query state if search has been performed
    return metadataQuery.value?.trim() && hasSearchBeenPerformed.value
  }
  return q.value?.trim()
})

const currentQuery = computed(() => {
  return searchMode.value === 'metadata' ? metadataQuery.value : q.value
})

// Determine the correct item type for display
const itemTypeText = computed(() => {
  if (searchMode.value === 'metadata') {
    return 'manuscript'
  }
  
  // For legacy mode, determine based on what's in the filtered results
  if (!filtered.value.length) return 'item'
  
  const hasCollections = filtered.value.some(item => item.kind === 'collection')
  const hasResources = filtered.value.some(item => item.kind === 'resource')
  
  if (hasCollections && hasResources) {
    return 'item' // Mixed results
  } else if (hasCollections) {
    return 'collection'
  } else {
    return 'manuscript'
  }
})

// Filtered results based on search mode
const filtered = computed(() => {
  if (searchMode.value === 'metadata') {
    // If we have search results from metadata search, show them
    if (manuscriptResults.value.length > 0) {
      return filterTreeForMetadataResults(nodes.value, manuscriptResults.value)
    }
    
    // If there's a query but no results, show empty (only if search was actually performed)
    if (metadataQuery.value?.trim() && hasSearchBeenPerformed.value) {
      return []
    }
    
    // No query, show all nodes
    return nodes.value
  }
  
  // Legacy filtering
  const s = String(q.value || '').trim().toLowerCase()
  if (!s) return nodes.value
  
  const topLevelMatches = nodes.value.filter(n => 
    n.title.toLowerCase().includes(s) || 
    String(n.id).toLowerCase().includes(s)
  )
  
  // Include any pre-loaded resources that match (but don't force loading)
  const resourceMatches = allResources.value.filter(r =>
    r.title.toLowerCase().includes(s) || 
    String(r.id).toLowerCase().includes(s)
  ).filter(r => !topLevelMatches.find(t => t.id === r.id))
  
  return [...topLevelMatches, ...resourceMatches]
})

// Paginated results for display
const paginatedResults = computed(() => {
  const allResults = filtered.value
  
  // If searching, show all results (no pagination for search)
  if (hasSearchQuery.value) {
    return allResults
  }
  
  // Apply pagination for browsing mode
  return allResults.slice(0, displayedItemsCount.value)
})

// Check if there are more items to load
const hasMoreItems = computed(() => {
  return !hasSearchQuery.value && displayedItemsCount.value < filtered.value.length
})

// Function to load more items
function loadMoreItems() {
  displayedItemsCount.value += itemsPerPage
}

// Reset pagination when search changes
function resetPagination() {
  displayedItemsCount.value = itemsPerPage
}

async function load(){
  isLoading.value = true
  try {
    const resp = await fetchRootCollection()
    raw.value = typeof resp === 'string' ? resp : JSON.stringify(resp, null, 2)
    nodes.value = parseMembers(resp)
  } finally {
    isLoading.value = false
  }
}

// Optional: Load all resources from collections (only when needed for comprehensive search)
async function loadAllResources() {
  if (allResources.value.length > 0) return // Already loaded
  
  isLoading.value = true
  const discovered = new Set()
  const toProcess = [...nodes.value]
  
  try {
    while (toProcess.length > 0) {
      const batch = toProcess.splice(0, 5) // Process in batches to avoid overwhelming the API
      
      await Promise.all(batch.map(async (node) => {
        if (node.kind === 'collection' && !discovered.has(node.id)) {
          discovered.add(node.id)
          try {
            const resp = await fetchCollectionRaw(node.id)
            const members = parseMembers(resp)
            
            members.forEach(member => {
              if (member.kind === 'resource') {
                // Add to allResources if not already present
                if (!allResources.value.find(r => r.id === member.id)) {
                  allResources.value.push(member)
                }
              } else if (member.kind === 'collection' && !discovered.has(member.id)) {
                toProcess.push(member)
              }
            })
          } catch (error) {
            console.warn(`Failed to load collection ${node.id}:`, error)
          }
        }
      }))
      
      // Small delay to be nice to the API
      if (toProcess.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }
  } finally {
    isLoading.value = false
  }
}

// Expand/collapse functionality
const treeRef = ref()
const isExpanding = ref(false)

async function expandAll() {
  if (treeRef.value && treeRef.value.expandAll) {
    isExpanding.value = true
    try {
      await treeRef.value.expandAll()
    } finally {
      isExpanding.value = false
    }
  }
}

function collapseAll() {
  if (treeRef.value && treeRef.value.collapseAll) {
    treeRef.value.collapseAll()
  }
}

// Function to filter tree structure while preserving hierarchy for metadata results
function filterTreeForMetadataResults(treeNodes, searchResults) {
  // Simply return the search results as flat resources without trying to organize them
  // This avoids creating fake collections that don't exist on the server
  return searchResults.map(result => {
    // Use the collection URL directly as ID for routing (like normal catalog)
    // Don't extract - use the full collection URL as the ID
    const collectionId = result.collection
    
    // Create a proper manuscript title from the location
    // Extract manuscript identifier from location like "Grenoble. Bibliothèque municipale, Ms.1005 Rés."
    let manuscriptTitle = result.title
    if (result.location && result.location.includes('Ms.')) {
      // Extract just the manuscript number/identifier
      const msMatch = result.location.match(/Ms\.\s*([^,.\s]+(?:\s+[^,.\s]+)*)/i)
      if (msMatch) {
        manuscriptTitle = `Ms. ${msMatch[1]}`
      }
    } else if (result.location) {
      // Fallback: use the last part of the location
      const parts = result.location.split(',')
      manuscriptTitle = parts[parts.length - 1]?.trim() || result.title
    }
    
    return {
      kind: 'resource',
      id: collectionId, // Use full collection URL for routing
      title: manuscriptTitle,
      location: result.location, // This will be shown as subtitle
      metadata: {
        location: result.location,
        language: result.language,
        start_year: result.start_year,
        page_count: result.page_count,
        tokens: result.tokens,
        ark_portail: result.ark_portail,
        filename: result.filename,
        ...result.metadata
      }
    }
  })
}

// Function to recursively expand all collections until resources are reached
async function expandAllToResources() {
  if (!treeRef.value || !treeRef.value.expandAll) return
  
  // The CatalogTree's expandAll method should handle recursive expansion
  // But we may need to call it multiple times to ensure deep nesting is expanded
  let attempts = 0
  const maxAttempts = 5
  
  while (attempts < maxAttempts) {
    attempts++
    
    // Call expandAll and wait for it to complete
    await treeRef.value.expandAll()
    
    // Wait a bit for any async loading to complete
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Check if there are still loading indicators (means more expansion might be needed)
    const loadingElements = document.querySelectorAll('.v-progress-circular')
    if (loadingElements.length === 0) {
      // No more loading, expansion is likely complete
      break
    }
  }
}

// Search functions
async function performMetadataSearch(query, searchType) {
  if (!query?.trim()) {
    manuscriptResults.value = []
    hasSearchBeenPerformed.value = false
    searchError.value = ''
    return
  }
  
  isLoading.value = true
  hasSearchBeenPerformed.value = true
  searchError.value = ''
  
  try {
    // Use pagination for general and language searches, but not for date searches
    let result
    if (searchType === 'date') {
      result = await searchManuscripts(query, 1, 50, searchType)
    } else {
      result = await searchManuscripts(query, 1, 50, searchType)
    }
    
    const items = result.items || result.manuscripts || []
    manuscriptResults.value = items
    
    // Auto-expand tree to show search results at resource level
    if (manuscriptResults.value.length > 0) {
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 200))
      await expandAllToResources()
    }
  } catch (error) {
    console.error('Metadata search failed:', error)
    manuscriptResults.value = []
    searchError.value = error.message || 'Search failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// Watch for search mode changes to clear results
watch(searchMode, () => {
  q.value = ''
  metadataQuery.value = ''
  manuscriptResults.value = []
  hasSearchBeenPerformed.value = false
  searchError.value = ''
  resetPagination()
})

// Watch for search type changes to clear results
watch(selectedSearchType, () => {
  metadataQuery.value = ''
  manuscriptResults.value = []
  hasSearchBeenPerformed.value = false
  searchError.value = ''
  resetPagination()
})

// Reset search performed flag when query is cleared
watch(metadataQuery, (newValue) => {
  if (!newValue?.trim()) {
    hasSearchBeenPerformed.value = false
    manuscriptResults.value = []
    searchError.value = ''
  }
})

// Reset pagination when legacy search query changes
watch(q, () => {
  resetPagination()
})

onMounted(load)
</script>