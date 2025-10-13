<template>
  <v-list density="compact" nav>
    <template v-for="node in nodes" :key="nodeKey(node)">
      <v-list-item
        v-if="node.kind==='resource'"
        :subtitle="node.location || node.id"
        :to="{ name:'document', params:{ resource: encodeURIComponent(node.id) } }"
        prepend-icon="mdi-file-document-outline"
      >
        <template #title>
          <div class="d-flex align-center" style="gap: 4px; flex-wrap: wrap;">
            <span>{{ node.title }}</span>
            <!-- Language chip -->
            <v-chip
              v-if="node.language"
              size="small"
              variant="outlined"
              :color="getLanguageColor(node.language)"
              class="text-caption manuscript-chip"
              :title="node.language.includes(',') ? `Languages: ${getUniqueLanguagesForTooltip(node.language)}` : ''"
            >
              {{ formatLanguage(node.language) }}
            </v-chip>
            
            <!-- Date range chip -->
            <v-chip
              v-if="node.start_year || node.stop_year"
              size="small"
              variant="outlined"
              color="blue-grey"
              class="text-caption manuscript-chip"
            >
              {{ formatDateRange(node.start_year, node.stop_year) }}
            </v-chip>
          </div>
        </template>
      </v-list-item>
      <div v-else>
        <v-list-item @click="toggle(node)" class="cursor-pointer collection-item">
          <template #prepend><v-icon>{{ isOpen(node) ? 'mdi-folder-open' : 'mdi-folder' }}</v-icon></template>
          
          <v-list-item-title class="d-flex align-center" style="gap: 8px;">
            <span>{{ node.title }}</span>
            <!-- Children count bubble - closer to title -->
            <v-chip
              v-if="node.nb_children > 0"
              size="small"
              :color="getChildrenCountColor(node.nb_children)"
              variant="flat"
              class="children-count-chip"
            >
              <v-icon start size="small">mdi-folder-multiple</v-icon>
              {{ formatNumber(node.nb_children) }}
            </v-chip>
          </v-list-item-title>
          
          <v-list-item-subtitle>{{ node.id }}</v-list-item-subtitle>
          
          <template #append>
            <v-icon :class="{ 'rotate-90': isOpen(node) }">mdi-chevron-right</v-icon>
          </template>
        </v-list-item>
        <v-expand-transition>
          <div v-show="isOpen(node)" class="pl-6">
            <div v-if="children[nodeKey(node)]">
              <div class="children-container">
                <CatalogTree 
                  :key="`tree-${nodeKey(node)}`"
                  :nodes="children[nodeKey(node)]" 
                  :ref="(el) => { if (el) childTreeRefs.set(nodeKey(node), el) }"
                />
              </div>
              <!-- Load More Button for paginated results -->
              <div 
                v-if="pagination[nodeKey(node)]?.hasNext" 
                class="load-more-container"
              >
                <v-btn
                  variant="text"
                  color="primary"
                  size="small"
                  :loading="loadingMore.has(nodeKey(node))"
                  @click.stop="loadMore(node)"
                  class="load-more-btn"
                  block
                  :disabled="loadingMore.has(nodeKey(node))"
                >
                  <template v-if="!loadingMore.has(nodeKey(node))">
                    <v-icon start size="16">mdi-dots-horizontal</v-icon>
                    Load More
                    <v-icon end size="16">mdi-chevron-down</v-icon>
                  </template>
                  <template v-else>
                    Loading...
                  </template>
                </v-btn>
              </div>
            </div>
            <v-progress-circular v-else indeterminate size="20" class="my-2"></v-progress-circular>
          </div>
        </v-expand-transition>
      </div>
    </template>
  </v-list>
</template>
<script setup>
import { reactive, ref, nextTick } from 'vue'
import { fetchCollectionRaw, parseMembers } from '../api/dts'

const props = defineProps({ nodes: { type: Array, required: true } })
const open = ref(new Set())
const children = ref({}) // Use ref instead of reactive for better tracking
const pagination = ref({}) // Use ref instead of reactive
const loadingMore = ref(new Set()) // Track which collections are loading more

function nodeKey(n){ return `${n.kind}:${n.id}` }
function isOpen(n){ return open.value.has(nodeKey(n)) }

async function toggle(n){
  const k = nodeKey(n)
  if (isOpen(n)) { open.value.delete(k); return }
  open.value.add(k)
  if (n.kind==='collection' && !children.value[k]){
    await loadCollectionPage(n, 1)
  }
}

async function loadCollectionPage(node, page = 1) {
  const k = nodeKey(node)
  
  const resp = await fetchCollectionRaw(node.id, 'children', page)
  const { members, pagination: paginationInfo } = parseMembers(resp)
  
  if (page === 1) {
    // First page - replace existing data
    children.value[k] = [...members] // Create new array for reactivity
  } else {
    // Subsequent pages - append to existing data with proper reactivity
    if (!children.value[k]) children.value[k] = []
    // Create a new array with all items to trigger reactivity
    children.value[k] = [...children.value[k], ...members]
  }
  
  // Store pagination info
  pagination.value[k] = paginationInfo
  
  // Force reactivity update
  await nextTick()
}

async function loadMore(node) {
  const k = nodeKey(node)
  const currentPagination = pagination.value[k]
  
  if (!currentPagination?.hasNext) return
  
  loadingMore.value.add(k)
  
  try {
    // Extract page number from next URL
    const nextUrl = currentPagination.next
    const pageMatch = nextUrl.match(/[?&]page=(\d+)/)
    const nextPage = pageMatch ? parseInt(pageMatch[1], 10) : 2
    
    await loadCollectionPage(node, nextPage)
  } catch (error) {
    console.error(`Failed to load more for collection ${node.id}:`, error)
  } finally {
    loadingMore.value.delete(k)
  }
}

// Store refs to child CatalogTree components
const childTreeRefs = ref(new Map())

// Methods to expand/collapse all nodes
async function expandAll() {
  const processed = new Set()
  const toLoad = []
  
  // First pass: expand all visible collections and queue loading
  function processNodes(nodes) {
    for (const node of nodes) {
      if (node.kind === 'collection') {
        const k = nodeKey(node)
        
        if (!processed.has(k)) {
          processed.add(k)
          open.value.add(k)
          
          // Queue loading if not already loaded
          if (!children.value[k]) {
            toLoad.push({ node, key: k })
          } else {
            // Process already loaded children
            processNodes(children.value[k])
          }
        }
      }
    }
  }
  
  processNodes(props.nodes)
  
  // Load collections in small batches to avoid overwhelming the API
  const batchSize = 3
  for (let i = 0; i < toLoad.length; i += batchSize) {
    const batch = toLoad.slice(i, i + batchSize)
    
    await Promise.all(batch.map(async ({ node, key }) => {
      try {
        await loadCollectionPage(node, 1)
        
        // Process the newly loaded children
        processNodes(children.value[key])
      } catch (error) {
        console.warn(`Failed to expand collection ${node.id}:`, error)
      }
    }))
    
    // Small delay between batches
    if (i + batchSize < toLoad.length) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }
  
  // Wait for DOM to update with new child components
  await new Promise(resolve => setTimeout(resolve, 200))
  
  // Now recursively call expandAll on all nested CatalogTree components
  const expandPromises = []
  for (const node of props.nodes) {
    if (node.kind === 'collection' && isOpen(node)) {
      const k = nodeKey(node)
      const childRef = childTreeRefs.value.get(k)
      if (childRef && childRef.expandAll) {
        expandPromises.push(childRef.expandAll())
      }
    }
  }
  
  if (expandPromises.length > 0) {
    await Promise.all(expandPromises)
  }
}

function collapseAll() {
  // First collapse all child components
  for (const childRef of childTreeRefs.value.values()) {
    if (childRef && childRef.collapseAll) {
      childRef.collapseAll()
    }
  }
  // Then collapse this level
  open.value.clear()
  // Clear child refs since they're no longer visible
  childTreeRefs.value.clear()
}

// Helper functions for metadata display
function formatLanguage(lang) {
  if (!lang) return ''
  
  // Handle common language codes and full names
  const langMap = {
    // Short codes
    'lat': 'Latin',
    'fro': 'Old French', 
    'frm': 'Middle French',
    'fre': 'French',
    'fra': 'French',
    'ita': 'Italian',
    'eng': 'English',
    'deu': 'German',
    'spa': 'Spanish',
    // Full names (case insensitive)
    'latin': 'Latin',
    'old french': 'Old French',
    'middle french': 'Middle French', 
    'french': 'French',
    'italian': 'Italian',
    'english': 'English',
    'german': 'German',
    'spanish': 'Spanish'
  }
  
  // Process multiple languages separated by commas
  const languages = lang.split(',').map(l => l.trim())
  
  // Remove duplicates by converting to Set
  const uniqueLanguages = [...new Set(languages)]
  
  const formattedLanguages = uniqueLanguages.map(singleLang => {
    const normalized = singleLang.toLowerCase()
    
    // Check if it's in our mapping (both short codes and full names)
    if (langMap[normalized]) {
      return langMap[normalized]
    }
    
    // Otherwise return as-is, capitalized
    return singleLang.charAt(0).toUpperCase() + singleLang.slice(1)
  })
  
  // Remove duplicates again after formatting (in case different codes map to same language)
  const uniqueFormattedLanguages = [...new Set(formattedLanguages)]
  
  // If multiple languages, show first one with count indicator
  if (uniqueFormattedLanguages.length > 1) {
    return `${uniqueFormattedLanguages[0]} +${uniqueFormattedLanguages.length - 1}`
  }
  
  return uniqueFormattedLanguages[0]
}

function formatDateRange(startYear, stopYear) {
  if (startYear && stopYear) {
    return `${startYear}-${stopYear}`
  } else if (startYear) {
    return `${startYear}-`
  } else if (stopYear) {
    return `<${stopYear}`
  }
  return ''
}

function formatNumber(num) {
  if (num < 1000) return num.toString()
  if (num < 1000000) return `${Math.floor(num / 100) / 10}k`
  return `${Math.floor(num / 100000) / 10}M`
}

function getLanguageColor(lang) {
  const firstLang = lang?.split(',')[0]?.trim()?.toLowerCase()
  switch (firstLang) {
    case 'lat': case 'latin': return 'purple'
    case 'fro': case 'frm': case 'fre': case 'fra': case 'french': case 'old french': case 'middle french': return 'blue'
    case 'ita': case 'italian': return 'green'
    case 'eng': case 'english': return 'orange'
    case 'deu': case 'german': return 'red'
    case 'spa': case 'spanish': return 'pink'
    default: return 'grey'
  }
}

function getChildrenCountColor(count) {
  if (count > 10000) return 'red'
  if (count > 1000) return 'orange'
  if (count > 100) return 'amber'
  if (count > 10) return 'green'
  return 'blue-grey'
}

function getUniqueLanguagesForTooltip(lang) {
  if (!lang) return ''
  
  // Remove duplicates from original language string for tooltip
  const languages = lang.split(',').map(l => l.trim())
  const uniqueLanguages = [...new Set(languages)]
  return uniqueLanguages.join(', ')
}

// Expose methods to parent
defineExpose({
  expandAll,
  collapseAll,
  loadMore
})
</script>
<style scoped>
.cursor-pointer{cursor:pointer}
.rotate-90{transform:rotate(90deg)}

/* Transition animations for smooth expansion */
.v-expand-transition-enter-active,
.v-expand-transition-leave-active {
  transition: all 0.3s ease;
}

.v-expand-transition-enter-from,
.v-expand-transition-leave-to {
  opacity: 0;
}

/* Children container for smooth animations */
.children-container {
  animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Load More Button Styling */
.load-more-container {
  margin: 8px 0;
  padding: 0 4px;
}

.load-more-btn {
  text-transform: none !important;
  font-weight: normal !important;
  letter-spacing: normal !important;
  opacity: 0.8;
  border: 1px dashed rgba(var(--v-theme-primary), 0.3) !important;
  border-radius: 8px !important;
  min-height: 32px !important;
  transition: all 0.2s ease !important;
}

.load-more-btn:hover:not([disabled]) {
  opacity: 1;
  border-color: rgba(var(--v-theme-primary), 0.6) !important;
  background-color: rgba(var(--v-theme-primary), 0.04) !important;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(var(--v-theme-primary), 0.2);
}

/* Loading and disabled state styling */
.load-more-btn:disabled,
.load-more-btn.v-btn--loading {
  opacity: 0.6;
  transform: none !important;
}

/* Metadata chips styling */
.children-count-chip {
  font-weight: 500;
  font-size: 0.7rem !important;
  height: 20px !important;
  min-height: 20px !important;
}

.children-count-chip :deep(.v-chip__content) {
  padding: 0 4px !important;
}

/* Language and date chips for manuscripts */
.manuscript-chip {
  margin-left: 2px !important;
  margin-right: 2px !important;
  font-weight: 500 !important;
  opacity: 0.9 !important;
  font-size: 0.7rem !important;
  height: 18px !important;
  min-height: 18px !important;
  vertical-align: middle;
}

.manuscript-chip :deep(.v-chip__content) {
  padding: 0 4px !important;
  line-height: 1;
}

/* Ensure proper spacing for chips */
</style>