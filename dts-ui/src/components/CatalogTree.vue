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
            <CatalogTree v-if="children[nodeKey(node)]" :nodes="children[nodeKey(node)]" />
            <v-progress-circular v-else indeterminate size="20" class="my-2"></v-progress-circular>
          </div>
        </v-expand-transition>
      </div>
    </template>
  </v-list>
</template>
<script setup>
import { reactive, ref } from 'vue'
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
</script>
<style scoped>
.cursor-pointer{cursor:pointer}
.rotate-90{transform:rotate(90deg)}
</style>