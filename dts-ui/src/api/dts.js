// Base URL of dts-api
const BASE = import.meta.env.VITE_DTS_BASE_URL || 'http://localhost:5000';

/* ----------------------------- utilities ----------------------------- */

function looksLikeJsonString(s) {
  if (typeof s !== 'string') return false;
  const t = s.trim();
  return (
    (t.startsWith('{') && t.endsWith('}')) ||
    (t.startsWith('[') && t.endsWith(']'))
  );
}

async function fetchText(url, init) {
  const res = await fetch(url, init);
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`${res.status} ${res.statusText} @ ${url}\n${body}`);
  }
  return res.text();
}

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/* ------------------------------- fetchers ---------------------------- */

/**
 * DTS Entry point (optional, not required by UI but handy for debugging)
 * GET /
 */
export async function fetchEntryPoint() {
  const url = `${BASE}/`;
  const text = await fetchText(url);
  if (looksLikeJsonString(text)) {
    const j = safeJsonParse(text);
    if (j) return j;
  }
  return text; // possibly HTML error page
}

/**
 * Root catalog
 * GET /collection
 */
export async function fetchRootCollection() {
  const url = `${BASE}/collection`;
  const text = await fetchText(url);
  if (looksLikeJsonString(text)) {
    const j = safeJsonParse(text);
    if (j) return j;
  }
  return text; // XML or error page
}

/**
 * Collection by id (IRI or slug)
 * GET /collection/?id=...
 */
export async function fetchCollectionRaw(id) {
  const url = `${BASE}/collection/?id=${encodeURIComponent(id)}`;
  const text = await fetchText(url);
  if (looksLikeJsonString(text)) {
    const j = safeJsonParse(text);
    if (j) return j;
  }
  return text; // XML or error page
}

/**
 * Navigation (list of passages / pages)
 * GET /navigation/?resource=...&down=1[&tree=...]
 */
export async function fetchNavigation(resource, tree, signal) {
  const treeParam = tree ? `&tree=${encodeURIComponent(tree)}` : '';
  const url = `${BASE}/navigation/?resource=${encodeURIComponent(resource)}${treeParam}&down=1`;
  const text = await fetchText(url, {
    headers: { Accept: 'application/json' },
    signal,
  });
  const j = safeJsonParse(text);
  return j ?? text;
}

/**
 * Fetch a page (passage) in HTML or XML
 * GET /document/?resource=...&ref=...&mediaType=html|application/xml
 */
export async function fetchPage(resource, ref, media = 'html', signal) {
  const url = `${BASE}/document/?resource=${encodeURIComponent(resource)}&ref=${encodeURIComponent(ref)}&mediaType=${encodeURIComponent(media)}`;
  return fetchText(url, { signal });
}

/* --------------------------- parsing helpers ------------------------- */

/**
 * Extract members from a DTS collection-like response.
 * Returns array of { kind: 'collection'|'resource', id, title }
 */
export function parseMembers(resp) {
  const out = [];
  if (!resp || typeof resp !== 'object') return out;

  // DTS 1-alpha uses "member"
  const items = resp.member || resp.members || [];
  if (!Array.isArray(items)) return out;

  for (const it of items) {
    const type = String(it?.['@type'] || it?.type || '').toLowerCase();
    const id = it?.['@id'] || it?.identifier || it?.id;
    if (!id) continue;

    const title = it?.title || it?.label || id;

    if (type.includes('collection')) {
      out.push({ kind: 'collection', id, title });
    } else {
      // Treat anything else as a resource for browsing purposes
      out.push({ kind: 'resource', id, title });
    }
  }
  return out;
}

/**
 * Extract passage refs from a DTS navigation response.
 * Supports DTS 1-alpha "member": [{ "@type": "CitableUnit", "identifier": "..." }, ...]
 * and a few legacy shapes as fallbacks.
 */
export function extractRefsFromNavigation(nav) {
  if (!nav) return [];

  // DTS 1-alpha primary shape
  if (Array.isArray(nav.member)) {
    return nav.member
      .map(m => m?.identifier || m?.ref || m?.['@id'])
      .filter(Boolean);
  }

  // Legacy fallbacks (kept for compatibility with other servers)
  if (Array.isArray(nav)) return nav;

  if (nav.references) {
    const k = Object.keys(nav.references)[0];
    if (k && Array.isArray(nav.references[k])) {
      return nav.references[k].map(x => x?.identifier ?? x);
    }
  }
  if (nav.paths) {
    const k = Object.keys(nav.paths)[0];
    if (k && Array.isArray(nav.paths[k])) return nav.paths[k];
  }
  if (nav?.data?.passages && Array.isArray(nav.data.passages)) {
    return nav.data.passages;
  }

  return [];
}

/* ----------------------------- search hook --------------------------- */

/**
 * Resource-scoped search (Elasticsearch-backed).
 *   [{ ref: "f9-f-004v-005", snippet?: "<em>hit</em> ..." }, ...]
 */

export async function searchInResource(q, resource, size = 50) {
  const base = import.meta.env.VITE_DTS_BASE_URL || 'http://localhost:5000';
  const url = `${base}/search/?q=${encodeURIComponent(q)}&resource=${encodeURIComponent(resource)}&size=${size}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Search failed');
  return await res.json(); // [{ ref, snippet }]
}
export async function searchAll(q, page = 1, size = 25) {
  const base = import.meta.env.VITE_DTS_BASE_URL || 'http://localhost:5000';
  const url  = `${base}/search/?q=${encodeURIComponent(q)}&page=${page}&size=${size}`;
  const res  = await fetch(url);
  if (!res.ok) throw new Error('Search failed');
  const data = await res.json();
  if (Array.isArray(data)) {
    // backward-compat for old array format
    const DEFAULT_COLLECTION = import.meta.env.VITE_DTS_DEFAULT_COLLECTION || 'testID';
    const items = data.map(d => ({
      collection: d.collection || d.resource || DEFAULT_COLLECTION,
      ref: d.ref,
      snippet: d.snippet || d.content || '',
    })).filter(d => d.ref);
    return { total: items.length, items };
  }
  return {
    total: data.total || 0,
    items: (data.items || []).map(d => ({
      collection: d.collection,
      ref: d.ref,
      snippet: d.snippet || '',
    }))
  };
}
/* ----------------------------- url helpers --------------------------- */

/**
 * Build a document URL (useful for downloads/exports).
 * media can be 'html' or 'application/xml'
 */
export function buildDocumentUrl(resource, ref, media = 'html', tree = '') {
  const qTree = tree ? `&tree=${encodeURIComponent(tree)}` : '';
  return `${BASE}/document/?resource=${encodeURIComponent(resource)}&ref=${encodeURIComponent(ref)}${qTree}&mediaType=${encodeURIComponent(media)}`;
}

export { BASE as DTS_BASE_URL };
