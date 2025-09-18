<template>
  <section class="pane" :class="{ 'mode-highlight': mode==='highlight' }" :style="{ '--text-size': size+'px', '--text-width': width+'ch' }">
    <article class="reader-article" v-if="html" v-html="html"></article>
    <p v-else class="muted">Loading…</p>
  </section>
</template>
<script setup>
import { ref, watch, onMounted } from 'vue'
import { fetchPage } from '../api/dts'

const props = defineProps({
  resource: { type: String, required: true },
  refId: { type: String, required: true },
  mode: { type: String, default: 'normal' },
  size: { type: Number, default: 18 },
  width: { type: Number, default: 70 },
})

const html = ref('')
async function load(){
  html.value = ''
  try{ html.value = await fetchPage(props.resource, props.refId, 'html') }catch(e){ html.value = `<pre>${String(e)}</pre>` }
}

onMounted(load)
watch(() => [props.resource, props.refId], load)
</script>