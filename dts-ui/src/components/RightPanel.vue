<template>
  <div>
    <details class="panel" open>
      <summary>Attributions</summary>
      <div>
        <div class="muted">Primary resource</div>
        <div class="code" style="word-break:break-all">{{ resource }}</div>
        <div class="muted" style="margin-top:6px">Current passage</div>
        <div class="code">{{ refId }}</div>
      </div>
    </details>

    <details class="panel" open>
      <summary>Text Mode</summary>
      <div class="mode-pill">
        <button :class="{active: mode==='normal'}" @click="$emit('update:mode','normal')">Normal</button>
        <button :class="{active: mode==='highlight'}" @click="$emit('update:mode','highlight')">Highlight</button>
      </div>
    </details>

    <details class="panel" open>
      <summary>Text Size</summary>
      <div>
        <input type="range" min="14" max="28" step="1" class="range" :value="size" @input="$emit('update:size', Number($event.target.value))" />
        <div class="muted">{{ size }} px</div>
      </div>
    </details>

    <details class="panel" open>
      <summary>Text Width</summary>
      <div>
        <input type="range" min="50" max="100" step="1" class="range" :value="width" @input="$emit('update:width', Number($event.target.value))" />
        <div class="muted">{{ width }} ch</div>
      </div>
    </details>

    <details class="panel" open>
      <summary>Parallel Text</summary>
      <div>
        <label class="muted">Right resource IRI</label>
        <input class="input" :value="rightValue" @input="onRightInput" placeholder="Paste a resource IRI" />
        <div class="toolbar" style="margin-top:8px">
          <button class="btn" @click="applyRight">Apply</button>
          <button class="btn" @click="clearRight" :disabled="!rightValue">Clear</button>
        </div>
      </div>
    </details>

    <details class="panel">
      <summary>Export Passage</summary>
      <div class="toolbar">
        <a class="btn" :href="teiUrl" target="_blank" rel="noopener">TEI XML</a>
        <a class="btn" :href="htmlUrl" target="_blank" rel="noopener">HTML</a>
      </div>
    </details>
  </div>
</template>
<script setup>
import { computed, ref, watch } from 'vue'
const props = defineProps({
  resource: { type: String, required: true },
  refId: { type: String, required: true },
  mode: { type: String, default: 'normal' },
  size: { type: Number, default: 18 },
  width: { type: Number, default: 70 },
  baseUrl: { type: String, required: true },
  rightResource: { type: String, default: '' },
  tree: { type: String, default: '' }, // <-- NEW
})
const emit = defineEmits(['update:mode','update:size','update:width','set:right'])

const qTree = computed(() => props.tree ? `&tree=${encodeURIComponent(props.tree)}` : '')
const teiUrl = computed(() =>
  `${props.baseUrl}/document/?resource=${encodeURIComponent(props.resource)}&ref=${encodeURIComponent(props.refId)}${qTree.value}&mediaType=application/xml`
)
const htmlUrl = computed(() =>
  `${props.baseUrl}/document/?resource=${encodeURIComponent(props.resource)}&ref=${encodeURIComponent(props.refId)}${qTree.value}&mediaType=html`
)

const rightValue = ref(props.rightResource)
watch(() => props.rightResource, (n) => { rightValue.value = n || '' })
function onRightInput(e){ rightValue.value = e.target.value }
function applyRight(){ emit('set:right', rightValue.value || '') }
function clearRight(){ rightValue.value=''; emit('set:right','') }
</script>
