<template>
  <div class="container" :class="{ 'mobile-view': isMobile }" :style="containerStyle">
    <aside v-show="!leftCollapsed" class="sidebar">
      <RouterLink to="/catalog" class="btn" style="margin-bottom:8px;display:inline-block">← {{ $t('collection.backToCatalog') }}</RouterLink>
      <h4>{{ $t('collection.collections') }}</h4>
      <ul class="list">
        <li v-for="c in data.collections" :key="c.identifier">
          <RouterLink :to="{ name: 'collection', params: { id: c.identifier } }">{{ c.title }}</RouterLink>
        </li>
      </ul>
      <h4 style="margin-top:16px">{{ $t('collection.resources') }}</h4>
      <ul class="list">
        <li v-for="r in data.resources" :key="r.identifier">
          <RouterLink :to="{ name: 'document', params: { resource: encodeURIComponent(r.identifier) } }">{{ r.title }}</RouterLink>
        </li>
      </ul>
    </aside>
    <main class="main-content">
      <div class="toolbar" style="justify-content:space-between">
        <div>
          <h2 style="margin:0 0 6px 0">{{ data.title }}</h2>
          <p class="muted">ID: <span class="code">{{ id }}</span></p>
        </div>
        <button class="collapse-btn" @click="leftCollapsed=!leftCollapsed">{{ leftCollapsed? `⟨ ${$t('collection.showLeft')}` : `${$t('collection.hideLeft')} ⟩` }}</button>
      </div>
      <details style="margin-top:16px">
        <summary>{{ $t('collection.rawResponse') }}</summary>
        <pre><code>{{ raw }}</code></pre>
      </details>
    </main>
    <div class="rightpanel" v-if="!isMobile">
      <p class="muted">{{ $t('collection.pickResource') }}</p>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref, onMounted, watch, computed, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { fetchCollectionRaw, parseMembers } from '../api/dts'

const route = useRoute()
const id = ref(route.params.id)
const raw = ref('')
const data = reactive({ title:'', collections: [], resources: [] })
const leftCollapsed = ref(false)
const isMobile = ref(false)

const containerStyle = computed(() => {
  if (isMobile.value) {
    return { gridTemplateColumns: leftCollapsed.value ? '0 1fr' : '280px 1fr' }
  }
  return { gridTemplateColumns: leftCollapsed.value ? '0 1fr 300px' : '280px 1fr 300px' }
})

function checkMobile() {
  isMobile.value = window.innerWidth < 1024
}

async function load(){
  try {
    const resp = await fetchCollectionRaw(id.value)
    raw.value = typeof resp === 'string' ? resp : JSON.stringify(resp, null, 2)
    const members = parseMembers(resp)
    data.title = resp.title || 'Collection'
    data.collections = members.filter(n => n.kind==='collection').map(n => ({ identifier:n.id, title:n.title }))
    data.resources   = members.filter(n => n.kind==='resource'  ).map(n => ({ identifier:n.id, title:n.title }))
  } catch (e) {
    raw.value = `Error: ${e?.message || e}`
    data.title = 'Error'
    data.collections = []
    data.resources = []
  }
}

onMounted(() => {
  load()
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkMobile)
})

watch(() => route.params.id, (n) => { id.value = n; load() })
</script>

<style scoped>
.container {
  display: grid;
  gap: 16px;
  padding: 16px;
  min-height: 100vh;
}

.sidebar {
  overflow-y: auto;
  max-height: calc(100vh - 100px);
}

.main-content {
  overflow-y: auto;
}

.rightpanel {
  overflow-y: auto;
  max-height: calc(100vh - 100px);
}

.mobile-view .sidebar {
  position: fixed;
  top: 64px;
  left: 0;
  bottom: 0;
  background: var(--v-theme-surface);
  z-index: 1000;
  box-shadow: 2px 0 8px rgba(0,0,0,0.1);
  padding: 16px;
}

.mobile-view .main-content {
  grid-column: 2;
}

@media (max-width: 768px) {
  .container {
    padding: 8px;
    gap: 8px;
  }
  
  .toolbar {
    flex-direction: column;
    align-items: flex-start !important;
    gap: 8px;
  }
  
  .collapse-btn {
    width: 100%;
  }
}
</style>