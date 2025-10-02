<template>
  <v-container fluid class="py-0 px-0">
    <v-sheet color="primary" class="py-4">
      <v-container>
        <h1 class="text-h2 font-weight-bold text-white">Catalog</h1>
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
            label="Browse manuscripts by title or ID"
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
                {{ type.shortLabel }}
              </v-btn>
            </v-btn-toggle>

            <!-- Search Input -->
            <v-text-field
              v-model="metadataQuery"
              :label="currentSearchType.inputLabel"
              :placeholder="currentSearchType.placeholder"
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
              Browse
            </v-btn>
            <v-btn value="metadata" size="small">
              <v-icon start>mdi-database-search</v-icon>
              Search
            </v-btn>
          </v-btn-toggle>
        </v-col>
        
        <v-spacer />
        <v-btn class="mr-2" variant="tonal" @click="expandAll" :loading="isExpanding">Expand all</v-btn>
        <v-btn variant="tonal" @click="collapseAll">Collapse all</v-btn>
      </v-row>

      <v-card>
        <v-card-text>
          <div v-if="hasSearchQuery && filtered.length === 0" class="text-center py-4 text-grey">
            <v-icon size="48" class="mb-2">mdi-magnify</v-icon>
            <p>No manuscripts found matching "{{ currentQuery }}"</p>
            <p class="text-caption">
              {{ searchMode === 'metadata' ? 'Try different metadata terms like "latin", "Tournai", "1301"' : 'Try searching by title, ID, or partial matches' }}
            </p>
          </div>
          <div v-else-if="hasSearchQuery" class="mb-3">
            <v-chip 
              :color="searchMode === 'metadata' ? currentSearchType.color : 'primary'" 
              variant="outlined" 
              size="small"
            >
              <v-icon start size="small">{{ searchMode === 'metadata' ? currentSearchType.icon : 'mdi-format-list-bulleted' }}</v-icon>
              {{ filtered.length }} manuscript{{ filtered.length !== 1 ? 's' : '' }} found
              {{ searchMode === 'metadata' ? `(${currentSearchType.shortLabel.toLowerCase()} search)` : '(browse)' }}
            </v-chip>
          </div>
          <CatalogTree :nodes="filtered" ref="treeRef" />
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

// Search mode and functionality
const searchMode = ref('legacy') // 'legacy' or 'metadata'
const manuscriptResults = ref([]) // Results from manuscript search

// Metadata search types configuration
const selectedSearchType = ref('general')

const searchTypes = [
  {
    value: 'general',
    label: 'General Search',
    shortLabel: 'General',
    inputLabel: 'Search all metadata fields',
    placeholder: 'e.g., Tournai, manuscript, notes, content...',
    description: 'Search across all metadata fields (content, language, location, notes, etc.)',
    color: 'primary',
    icon: 'mdi-database-search',
    endpoint: '/manuscripts/'
  },
  {
    value: 'language',
    label: 'Language Search',
    shortLabel: 'Language',
    inputLabel: 'Search by manuscript language',
    placeholder: 'e.g., lat, fre, "lat, fre", latin...',
    description: 'Search specifically for manuscript languages',
    color: 'success',
    icon: 'mdi-translate',
    endpoint: '/manuscripts/language/'
  },
  {
    value: 'date',
    label: 'Date Search',
    shortLabel: 'Date',
    inputLabel: 'Search by manuscript date',
    placeholder: 'e.g., 1301, 1300-1400, after 1200, before 1500, 14th century, exactly 1250',
    description: 'Search by manuscript creation dates and date ranges with flexible syntax',
    color: 'warning',
    icon: 'mdi-calendar',
    endpoint: '/manuscripts/date/'
  }
]

const currentSearchType = computed(() => {
  return searchTypes.find(type => type.value === selectedSearchType.value) || searchTypes[0]
})

// Build suggestions for legacy browse mode
const suggestions = computed(() => {
  const items = [...nodes.value]
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
  return searchMode.value === 'metadata' 
    ? metadataQuery.value?.trim()
    : q.value?.trim()
})

const currentQuery = computed(() => {
  return searchMode.value === 'metadata' ? metadataQuery.value : q.value
})

// Filtered results based on search mode
const filtered = computed(() => {
  if (searchMode.value === 'metadata') {
    // Show metadata search results if we have them and a query was made
    if (metadataQuery.value?.trim()) {
      if (manuscriptResults.value.length > 0) {
        // Filter the original tree structure to show only matching manuscripts and their parent collections
        return filterTreeForMetadataResults(nodes.value, manuscriptResults.value)
      } else {
        // Return empty array when search was performed but no results found
        return []
      }
    }
    // Show all nodes when no search is performed in metadata mode
    return nodes.value
  }
  
  // Legacy filtering
  const s = String(q.value || '').trim().toLowerCase()
  if (!s) return nodes.value
  
  const topLevelMatches = nodes.value.filter(n => 
    n.title.toLowerCase().includes(s) || 
    String(n.id).toLowerCase().includes(s)
  )
  
  const resourceMatches = allResources.value.filter(r =>
    r.title.toLowerCase().includes(s) || 
    String(r.id).toLowerCase().includes(s)
  ).filter(r => !topLevelMatches.find(t => t.id === r.id))
  
  return [...topLevelMatches, ...resourceMatches]
})

async function load(){
  const resp = await fetchRootCollection()
  raw.value = typeof resp === 'string' ? resp : JSON.stringify(resp, null, 2)
  nodes.value = parseMembers(resp)
  
  // Load all resources for comprehensive search
  await loadAllResources()
}

// Recursively load all resources from collections for better search
async function loadAllResources() {
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
  return searchResults.map(result => ({
    kind: 'resource',
    id: result.collection,
    title: result.title || result.manuscript_title || result.name || `Manuscript ${result.collection}`,
    metadata: result.metadata
  }))
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
    return
  }
  
  isLoading.value = true
  try {
    const result = await searchManuscripts(query, 50, searchType || selectedSearchType.value)
    manuscriptResults.value = result.manuscripts || result.items || []
    
    // Auto-expand tree to show search results at resource level
    if (manuscriptResults.value.length > 0) {
      // Wait for the DOM to update with the new filtered tree structure
      await nextTick()
      // Wait a bit more to ensure the tree component is fully rendered
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // Recursively expand all collections until resources are visible
      await expandAllToResources()
    }
  } catch (error) {
    console.error('Metadata search failed:', error)
    manuscriptResults.value = []
  } finally {
    isLoading.value = false
  }
}

// Watch for search mode changes to clear results
watch(searchMode, () => {
  q.value = ''
  metadataQuery.value = ''
  manuscriptResults.value = []
})

// Watch for search type changes to clear results
watch(selectedSearchType, () => {
  metadataQuery.value = ''
  manuscriptResults.value = []
})

onMounted(load)
</script>