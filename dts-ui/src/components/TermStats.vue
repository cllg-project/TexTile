<template>
  <div class="stats">
    <!-- Counting: a loading icon, how far the server is, and a way to stop -->
    <div v-if="computing" class="computing" role="status" aria-live="polite">
      <v-progress-circular indeterminate size="22" width="3" color="primary" />
      <div class="computing-text">
        <strong>{{ $t('search.statsComputing') }}</strong>
        <span v-if="progress.total">
          {{ $t('search.statsProgress', { pages: $n(progress.pages), total: $n(progress.total), occurrences: $n(progress.occurrences) }) }}
        </span>
      </div>
      <v-btn size="small" variant="text" @click="stop">{{ $t('search.statsStop') }}</v-btn>
      <v-progress-linear
        class="computing-bar"
        color="primary"
        height="4"
        :indeterminate="!progress.total"
        :model-value="percent"
      />
    </div>

    <v-alert v-if="busy" type="info" variant="tonal" density="compact" class="my-4">
      {{ $t('search.statsBusy') }}
      <template #append><v-btn size="small" variant="text" @click="start()">{{ $t('search.statsRetry') }}</v-btn></template>
    </v-alert>
    <v-alert v-else-if="error" type="error" variant="tonal" density="compact" class="my-4">{{ error }}</v-alert>

    <template v-if="data">
      <p v-if="!data.occurrences && !computing" class="empty">{{ $t('search.noResults') }}</p>

      <template v-else-if="data.occurrences">
        <v-alert v-if="truncatedMessage" type="warning" variant="tonal" density="compact" class="mb-4">
          {{ truncatedMessage }}
        </v-alert>
        <v-alert v-else-if="stopped" type="info" variant="tonal" density="compact" class="mb-4">
          {{ $t('search.statsStopped') }}
        </v-alert>

        <div :class="['figures', { 'is-preliminary': computing }]">
          <div class="tiles">
            <div class="tile">
              <div class="tile-value">{{ $n(view.occurrences) }}</div>
              <div class="tile-label">{{ $t('search.statsOccurrences') }}</div>
            </div>
            <div class="tile" :title="$t('search.statsPer10kHint')">
              <div class="tile-value">{{ view.per10k == null ? '—' : $n(view.per10k, { maximumFractionDigits: 2 }) }}</div>
              <div class="tile-label">{{ $t('search.statsPer10k') }}</div>
            </div>
            <div class="tile">
              <div class="tile-value">{{ view.manuscripts_with_hits }} <small>/ {{ data.manuscripts_in_scope }}</small></div>
              <div class="tile-label">{{ $t('search.statsManuscripts') }}</div>
            </div>
            <div class="tile">
              <div class="tile-value">{{ $n(data.distinct_forms) }}</div>
              <div class="tile-label">{{ $t('search.statsDistinctForms') }}</div>
            </div>
          </div>

          <!-- A search for several forms (deus,deum / reg*): look at one form at a time -->
          <div v-if="data.forms.length > 1" class="form-picker" role="group" :aria-label="$t('search.statsFormPicker')">
            <v-chip-group v-model="selectedForm" selected-class="text-primary" mandatory>
              <v-chip :value="null" size="small" variant="outlined" filter>{{ $t('search.statsAllForms') }}</v-chip>
              <v-chip v-for="f in data.forms.slice(0, PICKER_SHOWN)" :key="f.form" :value="f.form" size="small" variant="outlined" filter>
                <span class="form-chip">{{ f.form }}</span>&nbsp;<small>{{ $n(f.occurrences) }}</small>
              </v-chip>
            </v-chip-group>
          </div>

          <div class="toolbar">
            <v-btn-toggle v-model="metric" mandatory density="compact" variant="outlined" :aria-label="$t('search.statsMetric')">
              <v-btn value="per10k" size="small" :title="$t('search.statsPer10kHint')">{{ $t('search.statsPer10k') }}</v-btn>
              <v-btn value="occurrences" size="small">{{ $t('search.statsOccurrences') }}</v-btn>
            </v-btn-toggle>
            <span v-if="computing" class="note">{{ $t('search.statsPreliminary') }}</span>
            <span v-else-if="data.cached" class="note" :title="computedExact">{{ $t('search.statsCached', { when: computedWhen }) }}</span>
            <v-spacer />
            <v-btn
              v-if="!computing"
              icon="mdi-refresh"
              size="small"
              variant="text"
              :title="$t('search.statsRecompute')"
              :aria-label="$t('search.statsRecompute')"
              @click="start(true)"
            />
            <v-btn
              v-if="!computing"
              :href="csvHref"
              download
              size="small"
              variant="text"
              color="primary"
              prepend-icon="mdi-file-delimited-outline"
            >{{ $t('search.statsDownload') }}</v-btn>
          </div>

          <div class="panels">
            <section>
              <h3>{{ $t('search.statsForms') }}</h3>
              <BarList :items="formItems" />
              <v-btn v-if="data.forms.length > FORMS_SHOWN" size="small" variant="text" @click="allForms = !allForms">
                {{ allForms ? $t('search.statsLess') : $t('search.statsMore', { count: data.forms.length - FORMS_SHOWN }) }}
              </v-btn>
            </section>

            <section>
              <h3>{{ $t('search.statsByCentury') }}</h3>
              <BarList :items="centuryItems" />
              <p v-if="view.undated_occurrences" class="note">{{ $t('search.statsUndated', { count: view.undated_occurrences }) }}</p>

              <h3 class="mt-6">{{ $t('search.statsByLanguage') }}</h3>
              <BarList :items="languageItems" />
            </section>

            <section class="wide">
              <h3>{{ $t('search.statsByManuscript') }}</h3>
              <BarList :items="manuscriptItems" />
              <v-btn v-if="view.by_manuscript.length > MS_SHOWN" size="small" variant="text" @click="allManuscripts = !allManuscripts">
                {{ allManuscripts ? $t('search.statsLess') : $t('search.statsMore', { count: view.by_manuscript.length - MS_SHOWN }) }}
              </v-btn>
            </section>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { BusyError, streamTermStats, termStatsCsvUrl } from '../api/dts'
import { centuryLabel, shelfmark } from '../lib/catalog'
import { formatLanguage } from '../lib/language-utils'
import BarList from './BarList.vue'

const FORMS_SHOWN = 15
const PICKER_SHOWN = 12
const MS_SHOWN = 10

const props = defineProps({
  params: { type: Object, default: null },
  active: { type: Boolean, default: false },
})

const { t, n, locale } = useI18n()
const metric = ref('per10k')
const computing = ref(false)
const stopped = ref(false)
const busy = ref(false)
const error = ref('')
const data = ref(null) // the figures so far while counting, the final ones afterwards
const progress = ref({ pages: 0, total: 0, occurrences: 0 })
const allForms = ref(false)
const selectedForm = ref(null) // null: every form together
const allManuscripts = ref(false)
let loadedKey = ''
let controller = null

// The figures on screen: the whole search, or the chosen form (which has the same shape).
// A form that is no longer in the figures (a new search) falls back to the whole.
const view = computed(() => {
  const d = data.value
  const form = selectedForm.value == null ? null : d?.forms?.find((f) => f.form === selectedForm.value)
  return form ? { ...d, ...form } : d
})

const csvHref = computed(() => (props.params ? termStatsCsvUrl(props.params) : ''))
const percent = computed(() => (progress.value.total ? Math.min(100, (progress.value.pages / progress.value.total) * 100) : 0))
const computedAt = computed(() => (data.value?.computed_at ? new Date(data.value.computed_at * 1000) : null))
// The date is enough in the toolbar; the exact time is in the tooltip
const computedWhen = computed(() => (computedAt.value ? computedAt.value.toLocaleDateString(locale.value, { dateStyle: 'medium' }) : ''))
const computedExact = computed(() => (computedAt.value ? computedAt.value.toLocaleString(locale.value) : ''))

const truncatedMessage = computed(() => {
  const d = data.value
  if (computing.value || !d?.truncated) return ''
  return d.truncated_reason === 'time'
    ? t('search.statsTruncatedTime', { seconds: d.max_seconds })
    : t('search.statsTruncatedOccurrences', { count: n(d.limit) })
})

const fmt = (v) => n(v, { maximumFractionDigits: 2 })

// One row of a bar list: the bar follows the chosen metric, the number shows both when it helps.
// Relative frequency is unknown (not zero) for a manuscript whose size we do not know.
function item(label, row, extra = {}) {
  const relative = metric.value === 'per10k'
  const value = relative ? row.per10k : row.occurrences
  return {
    label,
    value,
    display: relative ? (row.per10k == null ? '—' : fmt(row.per10k)) : n(row.occurrences),
    title: `${label} — ${n(row.occurrences)} ${t('search.statsOccurrences').toLowerCase()}` +
      (row.per10k == null ? '' : `, ${fmt(row.per10k)} ${t('search.statsPer10k').toLowerCase()}`),
    ...extra,
  }
}

// Forms have no token count of their own: they always rank by occurrences
const formItems = computed(() => (data.value?.forms || [])
  .slice(0, allForms.value ? undefined : FORMS_SHOWN)
  .map((f) => ({
    key: f.form,
    label: f.form,
    value: f.occurrences,
    display: `${n(f.occurrences)} · ${f.share}%`,
  })))

const centuryItems = computed(() => (view.value?.by_century || []).map((c) =>
  item(centuryLabel(c.century, locale.value), c, { key: c.century })))

const languageItems = computed(() => (view.value?.by_language || []).map((l) =>
  item(formatLanguage(l.language, t), l, { key: l.language })))

const manuscriptItems = computed(() => (view.value?.by_manuscript || [])
  .slice(0, allManuscripts.value ? undefined : MS_SHOWN)
  .map((m) => item(shelfmark(m.title), m, {
    key: m.collection,
    // the tooltip carries the full title, which the short label drops
    title: `${m.title} — ${n(m.occurrences)} ${t('search.statsOccurrences').toLowerCase()}`,
    // open the manuscript on a search for the term (the chosen form, if one is picked) instead of its first page
    to: {
      name: 'document',
      params: { resource: encodeURIComponent(m.collection) },
      query: { highlight: selectedForm.value ?? props.params?.q, mode: props.params?.mode },
    },
  })))

const key = () => JSON.stringify(props.params)

// Count on the server, showing the figures as they come. `refresh` ignores a saved result.
async function start(refresh = false) {
  if (!props.params) return
  controller?.abort()
  controller = new AbortController()
  const mine = controller
  computing.value = true
  stopped.value = false
  busy.value = false
  error.value = ''
  data.value = null
  selectedForm.value = null
  progress.value = { pages: 0, total: 0, occurrences: 0 }
  loadedKey = key()
  try {
    await streamTermStats(props.params, {
      refresh,
      signal: mine.signal,
      onEvent(event) {
        if (mine.signal.aborted) return
        if (event.type === 'start') progress.value = { ...progress.value, total: event.total_pages }
        else if (event.type === 'progress') {
          progress.value = { pages: event.pages, total: event.total_pages, occurrences: event.occurrences }
          data.value = event.stats
        } else if (event.type === 'done') data.value = event.stats
      },
    })
  } catch (e) {
    if (e.name === 'AbortError') return
    if (e instanceof BusyError) busy.value = true
    else error.value = e?.message || String(e)
    loadedKey = '' // try again when the tab is next opened
  } finally {
    if (controller === mine) computing.value = false
  }
}

// Leave the figures counted so far on screen, and tell the server to stop scanning
function stop() {
  stopped.value = true
  controller?.abort()
  computing.value = false
  loadedKey = '' // a stopped count is not a result: counting restarts if the search is opened again
}

// Counting starts when the tab opens (it scans every matching page), and again only if the search changed
watch([() => props.active, () => props.params], () => {
  if (props.active && key() !== loadedKey) start()
}, { immediate: true })

onBeforeUnmount(() => controller?.abort())
</script>

<style scoped>
.stats { max-width: 1100px; }
.empty { text-align: center; padding: 48px 0; opacity: 0.7; }

.computing {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 4px 14px;
  padding: 12px 16px 0;
  margin-bottom: 16px;
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 3px;
  overflow: hidden;
}
.computing-text { display: flex; flex-direction: column; font-size: 0.9rem; }
.computing-text span { opacity: 0.7; font-variant-numeric: tabular-nums; }
.computing-bar { grid-column: 1 / -1; margin: 8px -16px 0; width: auto; }

.figures { transition: opacity 0.2s; }
.figures.is-preliminary { opacity: 0.75; }

.tiles { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 12px; margin-bottom: 20px; }
.tile {
  padding: 14px 16px;
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 3px;
}
.tile-value { font-size: 1.7rem; font-weight: 600; line-height: 1.2; font-variant-numeric: tabular-nums; }
.tile-value small { font-size: 0.9rem; font-weight: 400; opacity: 0.6; }
.tile-label { font-size: 0.8rem; opacity: 0.65; margin-top: 2px; }
.form-picker { margin-bottom: 12px; }
.form-chip { font-family: 'Junicode', ui-serif, serif; }
.toolbar { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; flex-wrap: wrap; }
.panels { display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 8px 40px; }
.panels .wide { grid-column: 1 / -1; }
h3 {
  font-size: 0.8rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  opacity: 0.7;
  font-weight: 600;
  padding-bottom: 6px;
  margin: 12px 0 8px;
  border-bottom: 2px solid rgb(var(--v-theme-primary));
  display: inline-block;
}
.note { font-size: 0.8rem; opacity: 0.6; margin: 6px 0 0; }
.toolbar .note { margin: 0; }
</style>
