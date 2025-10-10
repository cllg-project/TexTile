<template>
  <v-list density="compact" nav>
    <template v-for="node in nodes" :key="nodeKey(node)">
      <v-list-item
        v-if="node.kind==='resource'"
        :title="node.title"
        :subtitle="node.location || node.id"
        :to="{ name:'document', params:{ resource: encodeURIComponent(node.id) } }"
        prepend-icon="mdi-file-document-outline"
      />
      <div v-else>
        <v-list-item @click="toggle(node)" :title="node.title" :subtitle="node.id" class="cursor-pointer">
          <template #prepend><v-icon>{{ isOpen(node) ? 'mdi-folder-open' : 'mdi-folder' }}</v-icon></template>
          <template #append><v-icon :class="{ 'rotate-90': isOpen(node) }">mdi-chevron-right</v-icon></template>
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
</style>