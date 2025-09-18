<template>
<div class="toolbar" style="justify-content:space-between;margin:8px 0">
<button class="btn" :disabled="index<=0" @click="$emit('goPrev')">← Previous</button>
<div class="muted">{{ index+1 }} / {{ total }}</div>
<button class="btn" :disabled="index>=total-1" @click="$emit('goNext')">Next →</button>
</div>
</template>
<script setup>
const props = defineProps({ index: { type: Number, required: true }, total: { type: Number, required: true } })
</script>