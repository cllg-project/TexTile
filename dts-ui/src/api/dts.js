// Base URL of dts-api
const BASE = (import.meta.env.VITE_DTS_BASE_URL || 'http://localhost:5000').replace(/\/+$/, '');

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
 * Root catalog with pagination support and sorting
 * GET /collection/?nav=children&page=...&sort_by=...&sort_order=...
 */
export async function fetchRootCollection(page = 1, sortBy = 'default', sortOrder = 'asc') {
  const params = new URLSearchParams();
  params.append('nav', 'children');
  if (page > 1) params.append('page', page.toString());
  if (sortBy !== 'default') params.append('sort_by', sortBy);
  if (sortOrder !== 'asc') params.append('sort_order', sortOrder);
  
  const url = `${BASE}/collection/?${params.toString()}`;
  const text = await fetchText(url);
  if (looksLikeJsonString(text)) {
    const j = safeJsonParse(text);
    if (j) return j;
  }
  return text; // XML or error page
}

/**
 * Collection by id with pagination support and sorting
 * GET /collection/?id=...&nav=...&page=...&sort_by=...&sort_order=...
 */
export async function fetchCollectionRaw(id, nav = 'children', page = 1, sortBy = 'default', sortOrder = 'asc') {
  const params = new URLSearchParams();
  if (id) params.append('id', id);
  if (nav) params.append('nav', nav);
  if (page) params.append('page', page.toString());
  if (sortBy !== 'default') params.append('sort_by', sortBy);
  if (sortOrder !== 'asc') params.append('sort_order', sortOrder);
  
  const url = `${BASE}/collection/?${params.toString()}`;
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
  const down = 1
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
 * GET /document/?resource=...&ref=...&mediaType=html|application/xml&tree=...
 * Also supports range retrieval with start/end parameters
 */
export async function fetchPage(resource, ref, media = 'html', signal, tree = '', startRef = null, endRef = null) {
  const params = new URLSearchParams();
  params.append('resource', resource);
  params.append('mediaType', media);
  
  if (tree) params.append('tree', tree);
  
  if (startRef && endRef) {
    // Range retrieval
    params.append('start', startRef);
    params.append('end', endRef);
  } else if (ref) {
    // Single page retrieval
    params.append('ref', ref);
  }
  
  const url = `${BASE}/document/?${params.toString()}`;
  return fetchText(url, { signal });
}

/**
 * Fetch full document as XML for download
 * GET /document/?resource=...&mediaType=application/xml
 */
export async function fetchDocumentXml(resource, signal) {
  const params = new URLSearchParams();
  params.append('resource', resource);
  //params.append('mediaType', 'application/xml');
  
  const url = `${BASE}/document/?${params.toString()}`;
  return fetchText(url, { signal });
}

/* --------------------------- parsing helpers ------------------------- */

/**
 * Extract members from a DTS collection-like response.
 * Returns { members: array, pagination: object }
 */
export function parseMembers(resp) {
  const members = [];
  let pagination = null;

  if (!resp || typeof resp !== 'object') return { members, pagination };

  // Extract pagination info from view property
  if (resp.view && typeof resp.view === 'object') {
    pagination = {
      current: resp.view['@id'],
      first: resp.view.first,
      last: resp.view.last,
      next: resp.view.next,
      previous: resp.view.previous || resp.view.prev,
      hasNext: !!resp.view.next,
      hasPrevious: !!(resp.view.previous || resp.view.prev)
    };
  }

  // DTS uses "member"
  const items = resp.member || resp.members || [];
  if (!Array.isArray(items)) return { members, pagination };

  for (const it of items) {
    const type = String(it?.['@type'] || it?.type || '').toLowerCase();
    const id = it?.['@id'] || it?.identifier || it?.id;
    if (!id) continue;

    const title = it?.title || it?.label || id;
    // Our own child count, in the DTS `extensions` object (whose values are arrays)
    const extCount = it?.extensions?.nb_children;
    const nbChildren = Number(Array.isArray(extCount) ? extCount[0] : (extCount ?? it?.nb_children)) || 0;
    
    // Extract additional metadata for manuscripts/resources from dublinCore
    const dublinCore = it?.dublinCore || {};
    
    // Extract language from dublinCore.language array
    let language = null;
    if (dublinCore.language && Array.isArray(dublinCore.language) && dublinCore.language.length > 0) {
      language = dublinCore.language.join(', ');
    } else if (it?.language) {
      language = Array.isArray(it.language) ? it.language.join(', ') : it.language;
    }
    
    let startYear = null;
    let stopYear = null;
    const created = dublinCore.created || it?.created;
    if (created) {
      const createdStr = Array.isArray(created) ? created[0] : created;
      if (createdStr && typeof createdStr === 'string') {
        if (createdStr.includes('/')) {
          const [start, end] = createdStr.split('/');
          startYear = parseInt(start, 10);
          stopYear = parseInt(end, 10);
        } else {
          startYear = parseInt(createdStr, 10);
          stopYear = startYear;
        }
      }
    }
    
    let tokenCount = null;
    let ocrQuality = null;
    if (dublinCore.extent && Array.isArray(dublinCore.extent)) {
      for (const extentItem of dublinCore.extent) {
        if (typeof extentItem === 'string') {
          const tokenMatch = extentItem.match(/Tokens:\s*(\d+)/i);
          if (tokenMatch) {
            tokenCount = parseInt(tokenMatch[1], 10);
          }
          if (extentItem.includes('OCRed lines')) {
            ocrQuality = extentItem;
          }
        }
      }
    }
    if (!tokenCount) tokenCount = it?.tokens || it?.token_count || null;
    if (!ocrQuality) ocrQuality = it?.ocr_quality || null;
    
    const identifier = it?.identifier || dublinCore.identifier || null;
    const publisher = it?.publisher || dublinCore.publisher || null;
    const issued = it?.issued || dublinCore.issued || null;
    const relation = it?.relation || dublinCore.relation || null;

    if (type.includes('collection')) {
      members.push({ 
        kind: 'collection', 
        id, 
        title, 
        nb_children: nbChildren,
        language,
        start_year: startYear,
        stop_year: stopYear,
        token_count: tokenCount,
        ocr_quality: ocrQuality,
        identifier,
        publisher,
        issued,
        relation
      });
    } else {
      // Treat anything else as a resource for browsing purposes
      members.push({ 
        kind: 'resource', 
        id, 
        title, 
        nb_children: nbChildren,
        language,
        start_year: startYear,
        stop_year: stopYear,
        token_count: tokenCount,
        ocr_quality: ocrQuality,
        identifier,
        publisher,
        issued,
        relation
      });
    }
  }
  return { members, pagination };
}

/**
 * Extract passage refs from a DTS navigation response.
 * Supports DTS "member": [{ "@type": "CitableUnit", "identifier": "..." }, ...]
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

/* ----------------------------- search functions ---------------------- */

/**
 * Text search with mode support (exact, fuzzy, partial) and pagination
 * GET /search/?q=...&resource=...&mode=...&page=...&size=...
 */
export async function searchInResource(q, resource, size = 50, mode = 'exact', page = 1) {
  const params = new URLSearchParams();
  params.append('q', q);
  params.append('mode', mode);
  params.append('page', page.toString());
  params.append('size', size.toString());
  if (resource) params.append('resource', resource);
  
  const url = `${BASE}/search/?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Search failed');
  return await res.json();
}

/**
 * Global text search across all resources
 * Supports both traditional and hybrid search modes
 */
export async function searchAll(q, page = 1, size = 25, searchType = 'traditional', mode = 'exact', resource = null, language = null) {
  const params = new URLSearchParams();
  params.append('q', q);
  params.append('page', page.toString());
  params.append('size', size.toString());
  
  if (resource) params.append('resource', resource);
  if (language) params.append('language', language);
  
  let endpoint;
  if (searchType === 'hybrid') {
    endpoint = '/search/hybrid/';
    // Hybrid search doesn't use mode parameter
  } else {
    endpoint = '/search/';
    params.append('mode', mode); // Mode only applies to traditional search
  }
  
  const url = `${BASE}${endpoint}?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${searchType} search failed`);
  const data = await res.json();
  
  // Ensure consistent response format
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
 * Get total manuscript count from the database
 * GET /manuscripts/count/
 */
export async function fetchManuscriptCount() {
  const url = `${BASE}/manuscripts/count/`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch manuscript count (${res.status})`);
  }
  return await res.json();
}

/**
 * Helper function for hybrid search
 */
export async function searchHybrid(q, page = 1, size = 25, resource = null) {
  return searchAll(q, page, size, 'hybrid', 'exact', resource);
}

/**
 * Helper function for fuzzy search
 */
export async function searchFuzzy(q, page = 1, size = 25, resource = null) {
  return searchAll(q, page, size, 'traditional', 'fuzzy', resource);
}

/**
 * Helper function for partial search
 */
export async function searchPartial(q, page = 1, size = 25, resource = null) {
  return searchAll(q, page, size, 'traditional', 'partial', resource);
}

/**
 * Helper function for exact search (default mode)
 */
export async function searchExact(q, page = 1, size = 25, resource = null) {
  return searchAll(q, page, size, 'traditional', 'exact', resource);
}

/* ----------------------------- url helpers --------------------------- */

/**
 * Build a document URL (useful for downloads/exports).
 * Supports both single page and range retrieval
 * media can be 'html', 'application/xml', or 'text/html'
 */
export function buildDocumentUrl(resource, ref, media = 'html', tree = '', startRef = null, endRef = null) {
  const params = new URLSearchParams();
  params.append('resource', resource);
  params.append('mediaType', media);
  
  if (tree) params.append('tree', tree);
  
  if (startRef && endRef) {
    // Range retrieval
    params.append('start', startRef);
    params.append('end', endRef);
  } else if (ref) {
    // Single page retrieval
    params.append('ref', ref);
  }
  
  return `${BASE}/document/?${params.toString()}`;
}

export { BASE as DTS_BASE_URL };

/* ------------------------- catalog search (form-based) ------------------------- */

async function getJson(path, params) {
  const res = await fetch(`${BASE}${path}?${params.toString()}`);
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Request failed (${res.status}) ${detail.slice(0, 200)}`);
  }
  return res.json();
}

/**
 * Search manuscripts with optional filters.
 * GET /manuscripts/?q=&language=&start_year=&stop_year=&within=&page=&size=
 */
export async function searchCatalogManuscripts({ q = '', language = '', startYear = '', stopYear = '', within = '', page = 1, size = 25 } = {}) {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  if (q.trim()) params.set('q', q.trim());
  if (language) params.set('language', language);
  if (startYear !== '' && startYear != null) params.set('start_year', String(startYear));
  if (stopYear !== '' && stopYear != null) params.set('stop_year', String(stopYear));
  if (within) params.set('within', within);
  return getJson('/manuscripts/', params);
}

/**
 * Search collections (any depth), diacritics-insensitive.
 * GET /collections/search/?q=&page=&size=
 */
export async function searchCatalogCollections({ q = '', within = '', page = 1, size = 20 } = {}) {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  if (q.trim()) params.set('q', q.trim());
  if (within) params.set('within', within);
  return getJson('/collections/search/', params);
}

/** Filter values (languages with counts, date span). GET /manuscripts/facets/ */
export async function fetchCatalogFacets() {
  return getJson('/manuscripts/facets/', new URLSearchParams());
}

function concordanceParams({ q, mode = 'exact', language = '', resource = '', within = '', width = '' } = {}) {
  const params = new URLSearchParams({ q });
  if (mode && mode !== 'exact') params.set('mode', mode);
  if (language) params.set('language', language);
  if (resource) params.set('resource', resource);
  if (within) params.set('within', within);
  if (width) params.set('width', String(width));
  return params;
}

/**
 * URL of the streamed concordance (keyword in context) CSV for a text search.
 * Same parameters as the text search; `within` limits it to a collection, `width` sets the
 * number of characters of context on each side.
 */
export function concordanceUrl(search) {
  return `${BASE}/concordance/?${concordanceParams(search).toString()}`;
}

/** One page of the concordance for a text search: { rows, page, size, total_pages, pages }. */
export async function fetchConcordance(search, { page = 1, size = 20, signal } = {}) {
  const params = concordanceParams(search);
  params.set('format', 'json');
  params.set('page', String(page));
  params.set('size', String(size));
  const res = await fetch(`${BASE}/concordance/?${params.toString()}`, { signal });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || `Concordance failed (${res.status})`);
  return res.json();
}

/** The server refused a heavy request because it is already busy with others (HTTP 503). */
export class BusyError extends Error {
  constructor(retryAfter) {
    super('busy');
    this.name = 'BusyError';
    this.retryAfter = retryAfter;
  }
}

/**
 * Frequency statistics of a text search (occurrences, per 10,000 tokens, forms, and the distribution
 * by manuscript, century and language), streamed while the server counts.
 *
 * `onEvent` receives, in order: `{type: 'start', total_pages}`, then `{type: 'progress', pages,
 * total_pages, occurrences, stats}` about twice a second (`stats` being the figures so far), and
 * finally `{type: 'done', stats}`. A result computed before is answered with `done` alone.
 * Resolves when the stream ends; rejects on an `error` event, a refused request, or a network error.
 * Aborting `signal` stops the server's scan too.
 */
export async function streamTermStats(search, { onEvent, signal, refresh = false } = {}) {
  const params = concordanceParams(search);
  params.set('format', 'ndjson');
  if (refresh) params.set('refresh', '1');
  const res = await fetch(`${BASE}/concordance/stats/?${params.toString()}`, { signal });
  if (res.status === 503) throw new BusyError(Number(res.headers.get('Retry-After')) || 5);
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || `Statistics failed (${res.status})`);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  const handle = (line) => {
    if (!line.trim()) return;
    const event = JSON.parse(line);
    if (event.type === 'error') throw new Error(event.message || 'Statistics failed');
    onEvent(event);
  };
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop(); // the last piece may be a line still being written
    lines.forEach(handle);
  }
  handle(buffer + decoder.decode());
}

/** The same statistics as a CSV file. */
export function termStatsCsvUrl(search) {
  const params = concordanceParams(search);
  params.set('format', 'csv');
  return `${BASE}/concordance/stats/?${params.toString()}`;
}

/** Last page number of a DTS pagination view (`pagination.last` URL), 1 when unknown. */
export function lastPageOf(pagination) {
  const last = pagination?.last;
  if (!last || typeof last !== 'string') return 1;
  const n = parseInt(new URLSearchParams(last.split('?')[1] || '').get('page'), 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}
