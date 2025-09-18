<template>
  <div v-if="open" class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal">
      <header>
        <strong>{{ title }}</strong>
        <button class="btn" @click="$emit('close')">✕</button>
      </header>
      <div>
        <slot />
      </div>
      <footer>
        <slot name="footer" />
      </footer>
    </div>
  </div>
</template>
<script setup>
defineProps({ open: Boolean, title: String })
</script>