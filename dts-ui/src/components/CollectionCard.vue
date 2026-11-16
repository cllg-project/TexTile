<template>
  <RouterLink class="coll-card" :to="{ name: 'collection', params: { id: collection.id } }">
    <div class="coll-label"><v-icon size="14" class="mr-1">mdi-folder-outline</v-icon>{{ $t('browse.collection') }}</div>
    <div class="coll-title">{{ collection.title }}</div>
    <p v-if="collection.description" class="coll-desc">{{ collection.description }}</p>
    <div v-if="collection.count != null" class="coll-count">{{ $t('browse.items', { count: $n(collection.count) }, collection.count) }}</div>
  </RouterLink>
</template>

<script setup>
defineProps({
  // { id, title, description?, count? }
  collection: { type: Object, required: true },
})
</script>

<style scoped>
.coll-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px;
  color: inherit;
  text-decoration: none;
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 3px;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.coll-card:hover,
.coll-card:focus-visible {
  border-color: rgb(var(--v-theme-primary));
  box-shadow: 0 0 0 1px rgb(var(--v-theme-primary));
}
.coll-label {
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgb(var(--v-theme-primary));
  display: flex;
  align-items: center;
}
.coll-title { font-weight: 600; font-size: 1.05rem; line-height: 1.3; }
.coll-desc {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.75;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.coll-count { margin-top: auto; font-size: 0.8rem; opacity: 0.65; }
</style>
