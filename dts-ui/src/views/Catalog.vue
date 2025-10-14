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
        <v-col cols="12" md="8" lg="6">
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
            :loading="isLoadingAutocomplete"
            @update:model-value="handleCollectionSelection"
            @click:clear="handleAutocompleteClear"
          />
          
          <!-- Metadata Search Mode -->
          <div v-else class="metadata-search-container">
            <!-- Search Type Toggle -->
            <v-btn-toggle
              v-model="selectedSearchType"
              mandatory
              variant="outlined"
              density="compact"
              class="search-type-toggle"
            >
              <v-btn 
                v-for="type in searchTypes" 
                :key="type.value"
                :value="type.value" 
                size="small"
                class="search-type-btn"
              >
                <v-icon 
                  :color="selectedSearchType === type.value ? type.color : 'grey'" 
                  size="small"
                  class="mr-1"
                >
                  {{ type.icon }}
                </v-icon>
                <span class="btn-text">{{ $t(`catalog.searchTypes.${type.value}`) }}</span>
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
              class="search-input"
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
        
        <v-col cols="12" md="4" lg="auto">
          <v-btn-toggle
            v-model="searchMode"
            mandatory
            variant="outlined"
            density="compact"
            class="w-100"
          >
            <v-btn value="legacy" size="small" class="flex-grow-1">
              <v-icon start size="small">mdi-format-list-bulleted</v-icon>
              <span class="d-none d-sm-inline">{{ $t('catalog.legacyBrowse') }}</span>
              <span class="d-sm-none">{{ $t('catalog.browse') }}</span>
            </v-btn>
            <v-btn value="metadata" size="small" class="flex-grow-1">
              <v-icon start size="small">mdi-database-search</v-icon>
              <span class="d-none d-sm-inline">{{ $t('catalog.metadataSearch') }}</span>
              <span class="d-sm-none">{{ $t('catalog.search') }}</span>
            </v-btn>
          </v-btn-toggle>
        </v-col>
        
        <v-spacer />
        
        <!-- Sorting Controls (only for legacy browse mode) -->
        <v-col v-if="searchMode === 'legacy'" cols="auto">
          <div class="d-flex align-center sorting-controls" style="gap: 12px;">
            <!-- Alphabetical Sort Button -->
            <v-btn
              :variant="sortBy === 'title' ? 'elevated' : 'outlined'"
              :color="sortBy === 'title' ? 'primary' : 'default'"
              size="small"
              class="sort-btn"
              @click="toggleSort('title')"
            >
              <v-icon 
                :start="true" 
                size="18"
                class="sort-icon"
                :class="{ 'rotate-icon': sortBy === 'title' && sortOrder === 'desc' }"
              >
                {{ getSortIcon('title') }}
              </v-icon>
              Alphabetical
            </v-btn>
            
            <!-- Count Sort Button -->
            <v-btn
              :variant="sortBy === 'nb_children' ? 'elevated' : 'outlined'"
              :color="sortBy === 'nb_children' ? 'secondary' : 'default'"
              size="small"
              class="sort-btn"
              @click="toggleSort('nb_children')"
            >
              <v-icon 
                :start="true" 
                size="18"
                class="sort-icon"
                :class="{ 'rotate-icon': sortBy === 'nb_children' && sortOrder === 'desc' }"
              >
                {{ getSortIcon('nb_children') }}
              </v-icon>
              Count
            </v-btn>
          </div>
        </v-col>
        
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
                variant="text" 
                color="primary"
                size="large"
                :loading="isLoadingMore"
                @click="loadMoreItems"
                class="main-load-more-btn"
                block
              >
                <v-icon start>mdi-dots-horizontal</v-icon>
                <span v-if="rootPagination?.hasNext">
                  <span v-if="currentSelectedCollection">
                    Load More from {{ currentSelectedCollection.title }}
                  </span>
                  <span v-else>
                    Load More Collections
                  </span>
                </span>
                <span v-else>
                  Show {{ Math.min(itemsPerPage, filtered.length - displayedItemsCount) }} More
                </span>
                <v-icon end>mdi-chevron-down</v-icon>
              </v-btn>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- <v-expansion-panels class="mt-4" variant="accordion">
        <v-expansion-panel>
          <v-expansion-panel-title>Raw (debug)</v-expansion-panel-title>
          <v-expansion-panel-text><pre>{{ raw }}</pre></v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels> -->
    </v-container>
  </v-container>
</template>
<script setup>
import { onMounted, ref, computed, watch, nextTick } from 'vue'
import { fetchRootCollection, parseMembers, fetchCollectionRaw, searchManuscripts, fetchCollectionsList } from '../api/dts'
import CatalogTree from '../components/CatalogTree.vue'

const raw = ref('')
const nodes = ref([])
const q = ref('')
const metadataQuery = ref('')
const allResources = ref([]) // Store all resources for comprehensive search
const isLoading = ref(false)

// Autocomplete collections data
const autocompleteCollections = ref([])
const isLoadingAutocomplete = ref(false)

// Sorting controls
const sortBy = ref('nb_children') // 'default', 'title', 'nb_children'
const sortOrder = ref('desc') // 'asc', 'desc' - default to high to low for count

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
const selectedSearchType = ref('language')

const searchTypes = [
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

// Language mapping - convert long forms to short forms
const languageMap = {
  // Long forms to short forms
  'latin': 'lat',
  'french': 'fre',
  'old french': 'fro',
  'middle french': 'frm',
  'italian': 'ita',
  'english': 'eng',
  'german': 'deu',
  'spanish': 'spa',
  // Keep short forms as-is
  'lat': 'lat',
  'fre': 'fre',
  'fro': 'fro',
  'frm': 'frm',
  'ita': 'ita',
  'eng': 'eng',
  'deu': 'deu',
  'spa': 'spa'
}

function normalizeLanguageQuery(query) {
  const normalized = query.trim().toLowerCase()
  return languageMap[normalized] || query
}

const currentSearchType = computed(() => {
  return searchTypes.find(type => type.value === selectedSearchType.value) || searchTypes[0]
})

// Build suggestions for legacy browse mode using the new collections endpoint
const suggestions = computed(() => {
  return autocompleteCollections.value.map(collection => ({
    id: collection.identifier,
    title: `${collection.title} `,
    value: collection.title,
    nb_children: collection.nb_children,
    identifier: collection.identifier // Keep the identifier for selection
  }))
})

// Helper computed properties for search display
const hasSearchQuery = computed(() => {
  if (searchMode.value === 'metadata') {
    // Only show search query state if search has been performed
    return metadataQuery.value?.trim() && hasSearchBeenPerformed.value
  }
  // For legacy mode, check if there's text AND we're not viewing a selected collection
  // If a collection is selected, we're browsing, not searching
  if (currentSelectedCollection.value && q.value === currentSelectedCollection.value.title) {
    return false // Viewing a collection, not searching
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
  
  // Check if the search matches a collection title from autocomplete
  const matchingCollection = autocompleteCollections.value.find(
    collection => collection.title.toLowerCase() === s.toLowerCase()
  )
  
  // If exact match found, show the loaded collection data
  if (matchingCollection) {
    return nodes.value
  }
  
  // Otherwise, filter current nodes
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
  const result = allResults.slice(0, displayedItemsCount.value)
  
  console.log('paginatedResults computed:', {
    allResultsLength: allResults.length,
    displayedItemsCount: displayedItemsCount.value,
    resultLength: result.length,
    nodesLength: nodes.value.length
  })
  
  return result
})

// Check if there are more items to load
const hasMoreItems = computed(() => {
  if (hasSearchQuery.value) return false
  
  // For browse mode, check if there are more paginated items from the server
  // or more local items that haven't been displayed yet
  return rootPagination.value?.hasNext || displayedItemsCount.value < filtered.value.length
})

// Function to load more items
async function loadMoreItems() {
  // If there are more items from server pagination, load them
  if (rootPagination.value?.hasNext) {
    await loadMoreRootItems()
  } else {
    // Otherwise, just show more of the already loaded items
    displayedItemsCount.value += itemsPerPage
  }
}

// Reset pagination when search changes
function resetPagination() {
  displayedItemsCount.value = itemsPerPage
}

// Pagination state for root collection
const rootPagination = ref(null)

// Track current selected collection from autocomplete
const currentSelectedCollection = ref(null)

async function load(){
  isLoading.value = true
  try {
    // Only apply sorting to root level, nested levels use default (count desc)
    const resp = await fetchRootCollection(1, sortBy.value, sortOrder.value)
    raw.value = typeof resp === 'string' ? resp : JSON.stringify(resp, null, 2)
    
    const { members, pagination } = parseMembers(resp)
    nodes.value = members
    rootPagination.value = pagination
  } finally {
    isLoading.value = false
  }
}

// Load autocomplete collections data
async function loadAutocompleteCollections(query = '') {
  isLoadingAutocomplete.value = true
  try {
    const response = await fetchCollectionsList(query)
    const collections = response.collections || []
    
    // Limit to 10 results for autocomplete performance
    autocompleteCollections.value = collections
  } catch (error) {
    console.error('Failed to load autocomplete collections:', error)
    autocompleteCollections.value = []
  } finally {
    isLoadingAutocomplete.value = false
  }
}

// Handle collection selection and load collection data with pagination
async function handleCollectionSelection(selectedTitle) {
  if (!selectedTitle) {
    // Clear the current collection when the input is cleared
    currentSelectedCollection.value = null
    return
  }
  
  // Find the selected collection's identifier from autocomplete data
  const selectedCollection = autocompleteCollections.value.find(
    collection => collection.title === selectedTitle
  )
  
  if (!selectedCollection) {
    console.warn('Selected collection not found in autocomplete data')
    return
  }
  
  isLoading.value = true
  try {
    // Load first page of the selected collection with current sorting
    const resp = await fetchCollectionRaw(selectedCollection.identifier, 'children', 1, sortBy.value, sortOrder.value)
    const { members, pagination } = parseMembers(resp)
    
    // Replace current nodes with first page of selected collection
    nodes.value = members
    rootPagination.value = pagination
    
    // Track the current selected collection
    currentSelectedCollection.value = selectedCollection
    
    // Reset displayed items count to show proper pagination
    displayedItemsCount.value = itemsPerPage
    
    console.log(`Loaded first ${members.length} items from collection: ${selectedCollection.title}`)
    
  } catch (error) {
    console.error('Failed to load selected collection:', error)
  } finally {
    isLoading.value = false
  }
}

// Handle autocomplete clear - restore initial page
function handleAutocompleteClear() {
  // The v-autocomplete already clears q.value, so we just need to:
  currentSelectedCollection.value = null
  resetPagination()
  load() // Reload the initial root collection
  // The watcher will handle reloading autocomplete suggestions
}

async function loadMoreRootItems() {
  console.log('loadMoreRootItems called, hasNext:', rootPagination.value?.hasNext)
  
  if (!rootPagination.value?.hasNext) return
  
  isLoadingMore.value = true
  
  try {
    // Extract page number from next URL
    const nextUrl = rootPagination.value.next
    const pageMatch = nextUrl.match(/[?&]page=(\d+)/)
    const nextPage = pageMatch ? parseInt(pageMatch[1], 10) : 2
    
    console.log('Fetching page:', nextPage)
    
    let resp
    if (currentSelectedCollection.value) {
      // Load more from the selected collection
      resp = await fetchCollectionRaw(currentSelectedCollection.value.identifier, 'children', nextPage, sortBy.value, sortOrder.value)
    } else {
      // Only apply sorting to root level
      resp = await fetchRootCollection(nextPage, sortBy.value, sortOrder.value)
    }
    const { members, pagination } = parseMembers(resp)
    
    console.log('Got response:', {
      membersCount: members?.length,
      paginationHasNext: pagination?.hasNext,
      paginationNext: pagination?.next
    })
    
    if (members && members.length > 0) {
      const beforeLength = nodes.value.length
      
      // Add new items to nodes array
      nodes.value.splice(nodes.value.length, 0, ...members)
      
      // IMPORTANT: Update displayedItemsCount to show the new items
      displayedItemsCount.value = nodes.value.length
      
      console.log('Updated nodes from', beforeLength, 'to', nodes.value.length)
      console.log('Updated displayedItemsCount to', displayedItemsCount.value)
    }
    
    // Update pagination - try triggering reactivity more explicitly
    const oldPagination = rootPagination.value
    rootPagination.value = pagination ? { ...pagination } : null
    
    console.log('Updated pagination from', oldPagination?.hasNext, 'to', rootPagination.value?.hasNext)
    
  } catch (error) {
    console.error('Failed to load more root items:', error)
  } finally {
    isLoadingMore.value = false
    console.log('loadMoreRootItems finished, new hasNext:', rootPagination.value?.hasNext)
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
            // Load all pages for this collection
            let page = 1
            let hasMore = true
            
            while (hasMore) {
              const resp = await fetchCollectionRaw(node.id, 'children', page)
              const { members, pagination } = parseMembers(resp)
              
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
              
              hasMore = pagination?.hasNext || false
              page++
              
              // Safety limit to prevent infinite loops
              if (page > 50) break
            }
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

// Sorting functionality
function toggleSort(newSortBy) {
  if (sortBy.value === newSortBy) {
    // Same button clicked - toggle sort order
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    // Different button clicked - change sort type and reset to ascending
    sortBy.value = newSortBy
    sortOrder.value = 'asc'
  }
}

function getSortIcon(type) {
  if (sortBy.value !== type) {
    // Not active - show neutral icon
    return type === 'title' ? 'mdi-sort-alphabetical-variant' : 'mdi-sort-numeric-variant'
  }
  
  // Active button - show directional icon
  if (type === 'title') {
    return sortOrder.value === 'asc' ? 'mdi-sort-alphabetical-ascending' : 'mdi-sort-alphabetical-descending'
  } else {
    return sortOrder.value === 'asc' ? 'mdi-sort-numeric-ascending' : 'mdi-sort-numeric-descending'
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
      // Keep language, date, and token count fields
      language: result.language,
      start_year: result.start_year,
      stop_year: result.stop_year,
      token_count: result.token_count
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
    
    try {
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
    } catch (error) {
      console.warn('Error during expansion:', error)
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
    // Normalize language queries to use short forms
    let searchQuery = query
    if (searchType === 'language') {
      searchQuery = normalizeLanguageQuery(query)
    }
    
    // Use pagination for language and date searches
    let result
    if (searchType === 'date') {
      result = await searchManuscripts(searchQuery, 1, 50, searchType)
    } else {
      result = await searchManuscripts(searchQuery, 1, 50, searchType)
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

// Watch sorting parameters to reload data when changed
watch([sortBy, sortOrder], () => {
  if (searchMode.value === 'legacy') {
    resetPagination()
    load()
  }
})

// Debug watcher for pagination changes
watch(rootPagination, (newPagination, oldPagination) => {
  console.log('Pagination changed:', {
    old: oldPagination,
    new: newPagination,
    hasNext: newPagination?.hasNext
  })
}, { deep: true })

// Watch for legacy search query changes to update autocomplete
let autocompleteTimeout = null
watch(q, (newQuery, oldQuery) => {
  if (searchMode.value === 'legacy') {
    // If query was cleared and we had a selected collection, restore to root
    // But only if newQuery is empty/null (not just different)
    if (!newQuery && currentSelectedCollection.value && oldQuery) {
      // User cleared the autocomplete, restore initial state
      currentSelectedCollection.value = null
      resetPagination()
      load() // Reload the initial root collection
    }
    
    // Debounce the autocomplete search
    clearTimeout(autocompleteTimeout)
    autocompleteTimeout = setTimeout(() => {
      // Always reload autocomplete, even for empty queries
      loadAutocompleteCollections(newQuery || '')
    }, 300) // 300ms delay
  }
})

onMounted(() => {
  load()
  loadAutocompleteCollections() // Load initial autocomplete data
})
</script>

<style scoped>
.main-load-more-btn {
  text-transform: none !important;
  font-weight: 500 !important;
  letter-spacing: normal !important;
  border: 1px dashed rgba(var(--v-theme-primary), 0.4) !important;
  border-radius: 12px !important;
  min-height: 48px !important;
  transition: all 0.3s ease !important;
  margin: 0 auto;
  max-width: 300px;
}

.main-load-more-btn:hover {
  border-color: rgba(var(--v-theme-primary), 0.7) !important;
  background-color: rgba(var(--v-theme-primary), 0.06) !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.25);
}

.main-load-more-btn:not(.v-btn--loading):hover {
  transform: translateY(-2px);
}

.main-load-more-btn.v-btn--loading {
  opacity: 0.6;
  transform: none !important;
}

/* Sorting Controls Styling */
.sorting-controls {
  padding: 4px 8px;
  background: rgba(var(--v-theme-surface), 0.8);
  backdrop-filter: blur(8px);
  border-radius: 12px;
  border: 1px solid rgba(var(--v-theme-outline), 0.12);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.sort-btn {
  text-transform: none !important;
  font-weight: 500 !important;
  letter-spacing: 0.025em !important;
  border-radius: 8px !important;
  min-width: 110px !important;
  height: 36px !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  position: relative;
  overflow: hidden;
}

.sort-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
  z-index: 1;
}

.sort-btn:hover::before {
  left: 100%;
}

.sort-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.25) !important;
}

.sort-btn[variant="elevated"] {
  box-shadow: 
    0 3px 8px rgba(var(--v-theme-primary), 0.3),
    0 1px 3px rgba(var(--v-theme-primary), 0.2) !important;
}

.sort-btn[variant="elevated"]:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 6px 16px rgba(var(--v-theme-primary), 0.35),
    0 2px 6px rgba(var(--v-theme-primary), 0.25) !important;
}

.sort-icon {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.rotate-icon {
  transform: scaleY(-1);
}

/* Color variations for different sort buttons */
.sort-btn[color="secondary"][variant="elevated"] {
  box-shadow: 
    0 3px 8px rgba(var(--v-theme-secondary), 0.3),
    0 1px 3px rgba(var(--v-theme-secondary), 0.2) !important;
}

.sort-btn[color="secondary"][variant="elevated"]:hover {
  box-shadow: 
    0 6px 16px rgba(var(--v-theme-secondary), 0.35),
    0 2px 6px rgba(var(--v-theme-secondary), 0.25) !important;
}

.sort-btn[color="secondary"]:hover {
  box-shadow: 0 4px 12px rgba(var(--v-theme-secondary), 0.25) !important;
}

/* Dark theme support */
.v-theme--dark .sorting-controls {
  background: rgba(var(--v-theme-surface), 0.9);
  border-color: rgba(var(--v-theme-outline), 0.2);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .sorting-controls {
    padding: 2px 4px;
    gap: 8px !important;
  }
  
  .sort-btn {
    min-width: 90px !important;
    font-size: 0.8rem !important;
  }
}

@media (max-width: 480px) {
  .sort-btn {
    min-width: 80px !important;
    padding: 0 8px !important;
  }
  
  .sort-btn .v-icon {
    font-size: 16px !important;
  }
}

/* Metadata Search Responsive Styles */
.metadata-search-container {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.search-type-toggle {
  flex-shrink: 0;
}

.search-input {
  flex-grow: 1;
}

@media (max-width: 768px) {
  .metadata-search-container {
    flex-direction: column;
    gap: 12px;
  }
  
  .search-type-toggle {
    width: 100%;
  }
  
  .search-type-toggle .v-btn-group {
    width: 100%;
  }
  
  .search-type-btn {
    flex: 1;
  }
  
  .search-input {
    width: 100%;
  }
}

@media (max-width: 600px) {
  .search-type-btn .btn-text {
    display: none;
  }
  
  .search-type-btn {
    min-width: 48px !important;
    padding: 0 8px !important;
  }
}

</style>