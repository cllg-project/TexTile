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
  const treeParam = tree ? `&tree=${encodeURIComponent(tree)}` : ''
  const down = 100
  const url = `${BASE}/navigation/?resource=${encodeURIComponent(resource)}${treeParam}&down=${down}`
  const text = await fetchText(url, {
    headers: { Accept: 'application/json' },
    signal,
  })
  const j = safeJsonParse(text)
  return j ?? text
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

  const out = [];
  const getId = (m) => m?.identifier || m?.ref || m?.['@id'];

  // Recursively collect leaf identifiers from DTS "member" trees
  function walk(node) {
    if (!node) return;
    const items = node.member || node.members;
    if (!Array.isArray(items)) return;
    for (const m of items) {
      const hasChildren = Array.isArray(m?.member) || Array.isArray(m?.members);
      if (hasChildren) {
        walk(m);
      } else {
        const id = getId(m);
        if (id) out.push(id);
      }
    }
  }

  if (Array.isArray(nav.member) || Array.isArray(nav.members)) {
    walk(nav);
    if (out.length) return Array.from(new Set(out));
  }

  // Legacy fallbacks
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
export async function searchAll(q, page = 1, size = 25, searchType = 'traditional') {
  const base = import.meta.env.VITE_DTS_BASE_URL || 'http://localhost:5000';
  
  // Build URL based on search type
  let endpoint;
  switch (searchType) {
    case 'vector':
      endpoint = '/search/vector/';
      break;
    case 'hybrid':
      endpoint = '/search/hybrid/';
      break;
    case 'traditional':
    default:
      endpoint = '/search/';
      break;
  }
  
  const url = `${base}${endpoint}?q=${encodeURIComponent(q)}&page=${page}&size=${size}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${searchType} search failed`);
  const data = await res.json();
  
  // Backend now handles all highlighting and snippet creation
  // Just return the data as-is for all search types
  if (searchType === 'vector' || searchType === 'hybrid') {
    return data;
  }
  
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
      title: d.title || d.manuscript_title || d.name,
      highlighted_content: d.highlighted_content,
      matched_phrases: d.matched_phrases,
      score: d.score,
      language: d.language
    }))
  };
}



/**
 * Manuscript-level metadata search
 * GET /manuscripts/?q=...&size=...
 * Returns manuscript collections with metadata
 */
export async function searchManuscripts(q, size = 25, searchType = 'general') {
  const base = import.meta.env.VITE_DTS_BASE_URL || 'http://localhost:5000';
  
  let url;
  
  if (searchType === 'date') {
    // Parse date query and build appropriate URL parameters
    const dateParams = parseDateQuery(q);
    const params = new URLSearchParams();
    
    // Add date-specific parameters
    if (dateParams.exact_start) params.append('exact_start', dateParams.exact_start);
    if (dateParams.exact_stop) params.append('exact_stop', dateParams.exact_stop);
    if (dateParams.start_year) params.append('start_year', dateParams.start_year);
    if (dateParams.stop_year) params.append('stop_year', dateParams.stop_year);
    params.append('size', size);
    
    url = `${base}/manuscripts/date/?${params.toString()}`;
  } else {
    // For general and language searches, use the q parameter
    const endpoints = {
      general: '/manuscripts/',
      language: '/manuscripts/language/'
    };
    
    const endpoint = endpoints[searchType] || endpoints.general;
    url = `${base}${endpoint}?q=${encodeURIComponent(q)}&size=${size}`;
  }
  
  const res = await fetch(url);
  if (!res.ok) {
    const errorText = await res.text().catch(() => '');
    throw new Error(`Manuscript search failed (${res.status}): ${errorText}`);
  }
  return await res.json();
}

/**
 * Parse date query string into appropriate API parameters
 * Examples:
 * "1300" -> { exact_start: 1300 }
 * "1300-1400" -> { start_year: 1300, stop_year: 1400 }
 * "after 1200" -> { start_year: 1200 }
 * "before 1500" -> { stop_year: 1500 }
 * "exactly 1300" -> { exact_start: 1300 }
 */
function parseDateQuery(query) {
  const params = {};
  const q = query.trim().toLowerCase();
  
  // Match patterns like "1300-1400" or "1300 to 1400"
  const rangeMatch = q.match(/(\d{4})\s*[-–to]\s*(\d{4})/);
  if (rangeMatch) {
    params.start_year = parseInt(rangeMatch[1]);
    params.stop_year = parseInt(rangeMatch[2]);
    return params;
  }
  
  // Match "after YYYY" or "from YYYY"
  const afterMatch = q.match(/(?:after|from|since)\s+(\d{4})/);
  if (afterMatch) {
    params.start_year = parseInt(afterMatch[1]);
    return params;
  }
  
  // Match "before YYYY" or "until YYYY"
  const beforeMatch = q.match(/(?:before|until|up to)\s+(\d{4})/);
  if (beforeMatch) {
    params.stop_year = parseInt(beforeMatch[1]);
    return params;
  }
  
  // Match "exactly YYYY" or "exact YYYY"
  const exactMatch = q.match(/(?:exactly?|exact)\s+(\d{4})/);
  if (exactMatch) {
    params.exact_start = parseInt(exactMatch[1]);
    return params;
  }
  
  // Match "end in YYYY" or "ended in YYYY"
  const endMatch = q.match(/(?:end(?:ed)?\s+(?:in\s+)?|stop(?:ped)?\s+(?:in\s+)?)(\d{4})/);
  if (endMatch) {
    params.exact_stop = parseInt(endMatch[1]);
    return params;
  }
  
  // Match century patterns like "13th century" or "14th c."
  const centuryMatch = q.match(/(\d{1,2})(?:th|st|nd|rd)\s*c(?:entury|\.)?/);
  if (centuryMatch) {
    const century = parseInt(centuryMatch[1]);
    const startYear = (century - 1) * 100;
    const endYear = century * 100 - 1;
    params.start_year = startYear;
    params.stop_year = endYear;
    return params;
  }
  
  // Simple year match (treat as exact_start)
  const yearMatch = q.match(/\b(\d{4})\b/);
  if (yearMatch) {
    params.exact_start = parseInt(yearMatch[1]);
    return params;
  }
  
  return params;
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
