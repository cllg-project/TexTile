<template>
  <v-container fluid class="py-0">
    <v-sheet color="primary" class="py-10">
      <v-container>
        <h1 class="text-h2 font-weight-bold text-white">Catalog</h1>
      </v-container>
    </v-sheet>

    <v-container class="py-6">
      <v-row class="mb-4" align="center">
        <v-col cols="12" md="6">
          <v-autocomplete
            v-model="q"
            :items="suggestions"
            item-title="title"
            item-value="title"
            label="Find a text group or work…"
            prepend-inner-icon="mdi-magnify"
            clearable hide-details density="comfortable"
          />
        </v-col>
        <v-spacer />
        <v-btn class="mr-2" variant="tonal" @click="expandAll">Expand all</v-btn>
        <v-btn variant="tonal" @click="collapseAll">Collapse all</v-btn>
      </v-row>

      <v-card>
        <v-card-text>
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
import { onMounted, ref, computed } from 'vue'
import { fetchRootCollection, parseMembers } from '../api/dts'
import CatalogTree from '../components/CatalogTree.vue'

const raw = ref('')
const nodes = ref([])
const q = ref('')
const suggestions = computed(() => nodes.value.map(n => ({ id:n.id, title:n.title })))
const filtered = computed(() => {
  const s = String(q.value || '').trim().toLowerCase()
  if (!s) return nodes.value
  return nodes.value.filter(n => n.title.toLowerCase().includes(s) || String(n.id).toLowerCase().includes(s))
})

async function load(){
  const resp = await fetchRootCollection()
  raw.value = typeof resp === 'string' ? resp : JSON.stringify(resp, null, 2)
  nodes.value = parseMembers(resp)
}

// Expand/collapse helpers (best-effort)
const treeRef = ref()
function expandAll(){ treeRef.value?.$el.querySelectorAll('.v-list-item .v-icon').forEach(el=>{ /* noop, user-driven */ }) }
function collapseAll(){ /* left as UI sugar; real tree loads on demand */ }

onMounted(load)
</script>