<template>
  <v-list density="compact" nav>
    <template v-for="node in nodes" :key="nodeKey(node)">
      <v-list-item
        v-if="node.kind==='resource'"
        :title="node.title"
        :subtitle="node.id"
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
            <CatalogTree 
              v-if="children[nodeKey(node)]" 
              :nodes="children[nodeKey(node)]" 
              :ref="(el) => { if (el) childTreeRefs.set(nodeKey(node), el) }"
            />
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
const children = reactive({})

function nodeKey(n){ return `${n.kind}:${n.id}` }
function isOpen(n){ return open.value.has(nodeKey(n)) }

async function toggle(n){
  const k = nodeKey(n)
  if (isOpen(n)) { open.value.delete(k); return }
  open.value.add(k)
  if (n.kind==='collection' && !children[k]){
    const resp = await fetchCollectionRaw(n.id)
    children[k] = parseMembers(resp)
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
          if (!children[k]) {
            toLoad.push({ node, key: k })
          } else {
            // Process already loaded children
            processNodes(children[k])
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
        const resp = await fetchCollectionRaw(node.id)
        children[key] = parseMembers(resp)
        
        // Process the newly loaded children
        processNodes(children[key])
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
  collapseAll
})
</script>
<style scoped>
.cursor-pointer{cursor:pointer}
.rotate-90{transform:rotate(90deg)}
</style>