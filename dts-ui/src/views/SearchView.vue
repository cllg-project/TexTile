<template>
  <v-container class="py-6">
    <!-- Search guide -->
    <v-alert variant="tonal" type="info" class="mb-6">
      <div class="text-subtitle-1 mb-2">SEARCH GUIDE</div>
      <v-row>
        <v-col cols="12" md="6">
          <div class="rule"><v-chip size="x-small" label>+</v-chip>&nbsp;signifies AND operation</div>
          <div class="rule"><v-chip size="x-small" label>|</v-chip>&nbsp;signifies OR operation</div>
          <div class="rule"><v-chip size="x-small" label>-</v-chip>&nbsp;negates a single token</div>
          <div class="rule"><v-chip size="x-small" label>"&nbsp;&nbsp;"</v-chip>&nbsp;wraps tokens to make a phrase</div>
        </v-col>
        <v-col cols="12" md="6">
          <div class="rule"><v-chip size="x-small" label>*</v-chip>&nbsp;at the end of a term is a prefix query</div>
          <div class="rule"><v-chip size="x-small" label>( )</v-chip>&nbsp;signify precedence</div>
          <div class="rule"><v-chip size="x-small" label>~num</v-chip>&nbsp;after a word = fuzziness</div>
          <div class="rule"><v-chip size="x-small" label>~num</v-chip>&nbsp;after a phrase = slop</div>
        </v-col>
      </v-row>
    </v-alert>

    <!-- Query bar + search type (lemma placeholder) -->
    <div class="d-flex align-center" style="gap:12px">
      <v-text-field
        v-model="q"
        placeholder="Search…"
        clearable
        hide-details
        density="comfortable"
        class="flex-grow-1"
        @keydown.enter="run(1)"
      />
      <v-btn color="primary" @click="run(1)">Search</v-btn>
    </div>

    <!-- <div class="mt-2">
      <span class="text-body-2 mr-3">Search Type:</span>
      <v-radio-group v-model="mode" inline density="compact">
        <v-radio label="Form" value="form" />
        <v-radio label="Lemma" value="lemma" disabled />
      </v-radio-group>
    </div> -->

    <!-- Results header -->
    <div v-if="loaded" class="d-flex align-center justify-space-between mt-4 mb-2">
      <div class="text-body-2">
        Showing {{ start }}–{{ end }} of {{ total }}
      </div>
      <div class="d-flex align-center" style="gap:8px">
        <v-btn size="small" variant="text" :disabled="page<=1" @click="run(1)">
          <v-icon start>mdi-page-first</v-icon> first
        </v-btn>
        <v-btn size="small" variant="text" :disabled="page<=1" @click="run(page-1)">
          <v-icon start>mdi-chevron-left</v-icon> prev
        </v-btn>
        <span class="text-caption">page {{ page }} of {{ pages }}</span>
        <v-btn size="small" variant="text" :disabled="page>=pages" @click="run(page+1)">
          next <v-icon end>mdi-chevron-right</v-icon>
        </v-btn>
        <v-btn size="small" variant="text" :disabled="page>=pages" @click="run(pages)">
          last <v-icon end>mdi-page-last</v-icon>
        </v-btn>
      </div>
    </div>

    <v-progress-linear v-if="loading" indeterminate class="mt-6" />
    <v-alert v-else-if="loaded && items.length===0" type="info" variant="tonal" class="mt-6">
      No results.
    </v-alert>

    <!-- Results list -->
    <v-list v-else class="mt-2">
      <v-list-item
        v-for="(hit, i) in items"
        :key="i"
        class="py-3"
        @click="open(hit)"
      >
        <template #title>
          <!-- “Edition” pill just for the look -->
          <div class="d-flex align-center" style="gap:8px">
            <RouterLink
              :to="toDoc(hit)"
              class="font-weight-medium text-decoration-none"
              @click.stop
            >
              {{ hit.collection }} • {{ hit.ref }}
            </RouterLink>
            <v-chip size="x-small" label variant="tonal">edition</v-chip>
          </div>
        </template>
        <v-list-item-subtitle>
          <span v-html="hit.snippet"></span>
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>

    <!-- Bottom pager -->
    <div v-if="loaded && pages>1" class="d-flex justify-center mt-6">
      <v-pagination v-model="page" :length="pages" @update:modelValue="run" />
    </div>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { searchAll } from '../api/dts'

const router = useRouter()
const route = useRoute()

const q = ref(route.query.q?.toString() || '')
const page = ref(Number(route.query.page || 1))
const size = ref(25)

const loading = ref(false)
const loaded  = ref(false)
const total   = ref(0)
const items   = ref([])
const mode    = ref('form') // placeholder

const pages = computed(() => Math.max(1, Math.ceil(total.value / size.value)))
const start = computed(() => total.value ? (page.value - 1) * size.value + 1 : 0)
const end   = computed(() => Math.min(total.value, start.value + items.value.length - 1))

async function run(p = page.value){
  if (!q.value.trim()) { total.value = 0; items.value = []; loaded.value = true; page.value = 1; pushState(); return }
  loading.value = true; loaded.value = false; page.value = p; pushState()
  try {
    const res = await searchAll(q.value, page.value, size.value)
    total.value = res.total || 0
    items.value = res.items || []
  } finally {
    loading.value = false; loaded.value = true
  }
}

function pushState(){
  router.replace({ name: 'search', query: { q: q.value || undefined, page: page.value > 1 ? page.value : undefined } })
}

function toDoc(hit){
  return {
    name: 'documentRef',
    params: { resource: encodeURIComponent(hit.collection), ref: hit.ref },
    query: { highlight: q.value } // tells the reader what to highlight
  }
}

function open(hit){ router.push(toDoc(hit)) }

onMounted(() => { run(page.value) })
watch(() => route.query, () => {
  q.value = route.query.q?.toString() || ''
  page.value = Number(route.query.page || 1)
  run(page.value)
})
</script>

<style scoped>
.rule { margin: 4px 0; }
:deep(mark.dts-hit){
  background: rgba(255, 214, 51, 0.65);
  padding: 0 .15em;
  border-radius: 3px;
}
</style>
