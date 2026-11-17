// Helpers shared by the catalog browse/search views.

/** Keep only <mark> tags (search highlights) from a string, escape everything else. */
/** Collections are listed largest first unless the user picks another order. */
export const DEFAULT_SORT = 'nb_children'

export function safeMark(html) {
  const escaped = String(html ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  return escaped
    .replace(/&lt;mark class=(?:'|&#39;|")dts-hit(?:'|&#39;|")&gt;/g, '<mark class="dts-hit">')
    .replace(/&lt;mark class=(?:'|")dts-hit(?:'|")&gt;/g, '<mark class="dts-hit">')
    .replace(/&lt;\/mark&gt;/g, '</mark>')
}

export function stripTags(html) {
  return String(html ?? '').replace(/<[^>]+>/g, '')
}

function toList(v) {
  if (v == null || v === '') return []
  return (Array.isArray(v) ? v : String(v).split(/[,\s]+/)).map(stripTags).filter(Boolean)
}

function yearsFrom(created) {
  const first = Array.isArray(created) ? created[0] : created
  const m = String(first ?? '').match(/\d{3,4}/g)
  if (!m) return { start: null, stop: null }
  return { start: parseInt(m[0], 10), stop: parseInt(m[m.length - 1], 10) }
}

/** Normalize a /manuscripts/ search hit. */
export function fromSearchHit(hit) {
  const { start, stop } = yearsFrom(hit.created)
  return {
    id: hit.collection,
    titleHtml: safeMark(hit.title),
    languages: toList(hit.language),
    start, stop,
    tokens: hit.tokens ?? null,
    pages: hit.page_count ?? null,
    manifest: Array.isArray(hit.manifest_url) ? hit.manifest_url[0] : hit.manifest_url,
  }
}

/** Normalize a DTS collection member of kind 'resource'. */
export function fromMember(m) {
  return {
    id: m.id,
    titleHtml: safeMark(m.title),
    languages: toList(m.language),
    start: m.start_year ?? null,
    stop: m.stop_year ?? null,
    tokens: m.token_count ?? null,
    pages: null,
    manifest: null,
  }
}

export function formatYears(start, stop) {
  if (start == null) return ''
  return stop == null || stop === start ? String(start) : `${start}–${stop}`
}

/**
 * Sanitize a text-search snippet: keep <mark> hits and the "[...]" gap marker our backend
 * inserts between fragments; everything else is escaped.
 */
export function safeSnippet(html) {
  return safeMark(html)
    .replace(/&lt;span class=(?:'|")text-muted(?:'|")&gt;\[\.\.\.\]&lt;\/span&gt;/g, '<span class="snip-gap">…</span>')
}

/** "Collection title, f12r" -> "Collection title" (the backend appends the ref to the title). */
export function manuscriptTitle(title, ref) {
  const t = String(title ?? '')
  const suffix = ref ? `, ${ref}` : ''
  return suffix && t.endsWith(suffix) ? t.slice(0, -suffix.length) : t
}

const ROMAN = [[10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]
function roman(n) {
  let out = ''
  for (const [value, symbol] of ROMAN) while (n >= value) { out += symbol; n -= value }
  return out
}

/** 13 -> "13th c." (English) / "XIIIe s." (French). */
export function centuryLabel(n, locale = 'en') {
  if (locale.startsWith('fr')) return `${roman(n)}${n === 1 ? 'er' : 'e'} s.`
  const tens = n % 100
  const suffix = tens >= 11 && tens <= 13 ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' }[n % 10] || 'th')
  return `${n}${suffix} c.`
}

/** "Paris. BnF, Département des manuscrits, Smith-Lesouëf 19" -> "Smith-Lesouëf 19": the part that tells manuscripts apart. */
export function shelfmark(title) {
  const t = String(title ?? '')
  const i = t.lastIndexOf(', ')
  return i >= 0 ? t.slice(i + 2) : t
}
