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
 * Extract page number from a pagination URL
 */
function extractPageFromUrl(url) {
  if (!url) return null;
  const match = url.match(/[?&]page=(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

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

  // DTS 1-alpha uses "member"
  const items = resp.member || resp.members || [];
  if (!Array.isArray(items)) return { members, pagination };

  for (const it of items) {
    const type = String(it?.['@type'] || it?.type || '').toLowerCase();
    const id = it?.['@id'] || it?.identifier || it?.id;
    if (!id) continue;

    const title = it?.title || it?.label || id;
    const nbChildren = it?.nb_children || 0;
    
    // Extract additional metadata for manuscripts/resources from dublinCore
    const dublinCore = it?.dublinCore || {};
    
    // Extract language from dublinCore.language array
    let language = null;
    if (dublinCore.language && Array.isArray(dublinCore.language) && dublinCore.language.length > 0) {
      // Join multiple languages with comma and space
      language = dublinCore.language.join(', ');
    }
    
    // Extract date information from dublinCore.coverage array
    let startYear = null;
    let stopYear = null;
    if (dublinCore.coverage && Array.isArray(dublinCore.coverage) && dublinCore.coverage.length > 0) {
      const coverage = dublinCore.coverage[0]; // Take first coverage entry
      // Parse coverage like "801–" or "1101–" or "1300–1400"
      if (coverage && typeof coverage === 'string') {
        const yearMatch = coverage.match(/^(\d{3,4})(?:–(\d{3,4})?)?/);
        if (yearMatch) {
          startYear = parseInt(yearMatch[1], 10);
          if (yearMatch[2]) {
            stopYear = parseInt(yearMatch[2], 10);
          }
        }
      }
    }
    
    // Fallback to direct properties if dublinCore not available
    if (!language) language = it?.language;
    if (!startYear) startYear = it?.start_year;
    if (!stopYear) stopYear = it?.stop_year;
    
    const location = it?.location;

    if (type.includes('collection')) {
      members.push({ 
        kind: 'collection', 
        id, 
        title, 
        nb_children: nbChildren,
        language,
        start_year: startYear,
        stop_year: stopYear,
        location
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
        location
      });
    }
  }
  return { members, pagination };
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
export async function searchAll(q, page = 1, size = 25, searchType = 'traditional', mode = 'exact', resource = null) {
  const params = new URLSearchParams();
  params.append('q', q);
  params.append('page', page.toString());
  params.append('size', size.toString());
  
  if (resource) params.append('resource', resource);
  
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
 * Get list of all first-level collections for autocomplete
 * GET /collections/list/?q=...
 */
export async function fetchCollectionsList(query = '') {
  const params = new URLSearchParams();
  if (query.trim()) {
    params.append('q', query.trim());
  }
  
  const url = `${BASE}/collections/list/?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch collections list (${res.status})`);
  }
  return await res.json();
}

/**
 * Manuscript catalog search with pagination support
 * - General: GET /manuscripts/?q=...&page=...&size=...
 * - Language: GET /manuscripts/language/?q=...&page=...&size=...
 * - Date ranges: GET /manuscripts/range/?q=800-1400&size=...
 * - Complex dates: GET /manuscripts/date/?exact_start=800&size=...
 * Returns manuscript collections with metadata
 */
export async function searchManuscripts(q, page = 1, size = 25, searchType = 'general') {
  const params = new URLSearchParams();
  
  let endpoint;
  
  if (searchType === 'date') {
    // Parse date query to determine the best format
    const dateParams = parseDateQuery(q);
    
    // Check if we have at least one valid date parameter
    const hasDateParams = dateParams.exact_start !== undefined || dateParams.exact_stop !== undefined || 
                          dateParams.start_year !== undefined || dateParams.stop_year !== undefined;
    
    if (!hasDateParams) {
      throw new Error('Invalid date query. Please use formats like: "0-1600", "800", "800-1400", "after 1200", "before 1500", "13th century"');
    }
    
    // If it's a simple range (start_year and stop_year), use the simpler /manuscripts/range/ endpoint
    if (dateParams.start_year !== undefined && dateParams.stop_year !== undefined && !dateParams.exact_start && !dateParams.exact_stop) {
      endpoint = '/manuscripts/range/';
      const rangeQuery = `${dateParams.start_year}-${dateParams.stop_year}`;
      params.append('q', rangeQuery);
      params.append('size', size.toString()); // Range endpoint doesn't use pagination
    } else {
      // For complex queries (exact matches, single-sided ranges), use /manuscripts/date/
      endpoint = '/manuscripts/date/';
      
      // Add date-specific parameters
      if (dateParams.exact_start) params.append('exact_start', dateParams.exact_start.toString());
      if (dateParams.exact_stop) params.append('exact_stop', dateParams.exact_stop.toString());
      if (dateParams.start_year) params.append('start_year', dateParams.start_year.toString());
      if (dateParams.stop_year) params.append('stop_year', dateParams.stop_year.toString());
      params.append('size', size.toString()); // Date endpoint doesn't use pagination
    }
  } else {
    // For general and language searches with pagination support
    const endpoints = {
      general: '/manuscripts/',
      language: '/manuscripts/language/'
    };
    
    endpoint = endpoints[searchType] || endpoints.general;
    params.append('q', q);
    params.append('page', page.toString());
    params.append('size', size.toString());
  }
  
  const url = `${BASE}${endpoint}?${params.toString()}`;
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
  
  // Match any range with hyphen (e.g., "0-1600", "10-1500", "800-1400")
  const rangeMatch = q.match(/(\d+)\s*-\s*(\d+)/);
  if (rangeMatch) {
    params.start_year = parseInt(rangeMatch[1]);
    params.stop_year = parseInt(rangeMatch[2]);
    return params;
  }
  
  // Match patterns with "to" (e.g., "800 to 1400")
  const toMatch = q.match(/(\d+)\s+to\s+(\d+)/);
  if (toMatch) {
    params.start_year = parseInt(toMatch[1]);
    params.stop_year = parseInt(toMatch[2]);
    return params;
  }
  
  // Match "after YYYY" or "from YYYY" (English and French)
  const afterMatch = q.match(/(?:after|from|since|après|depuis|dès)\s+(\d+)/);
  if (afterMatch) {
    params.start_year = parseInt(afterMatch[1]);
    return params;
  }
  
  // Match "before YYYY" or "until YYYY" (English and French)
  const beforeMatch = q.match(/(?:before|until|up to|avant|jusqu'à|jusqu'en)\s+(\d+)/);
  if (beforeMatch) {
    params.stop_year = parseInt(beforeMatch[1]);
    return params;
  }
  
  // Match "exactly YYYY" or "exact YYYY" (English and French)
  const exactMatch = q.match(/(?:exactly?|exact|exactement|précisément)\s+(\d+)/);
  if (exactMatch) {
    params.exact_start = parseInt(exactMatch[1]);
    return params;
  }
  
  // Match "end in YYYY" or "ended in YYYY" (English and French)
  const endMatch = q.match(/(?:end(?:ed)?\s+(?:in\s+)?|stop(?:ped)?\s+(?:in\s+)?|fin(?:i)?\s+(?:en\s+)?|terminé\s+(?:en\s+)?)(\d+)/);
  if (endMatch) {
    params.exact_stop = parseInt(endMatch[1]);
    return params;
  }
  
  // Match century patterns (English and French)
  const centuryMatch = q.match(/(\d{1,2})(?:th|st|nd|rd|ème|e)\s*(?:c(?:entury|\.)?|siècle|s\.?)/);
  if (centuryMatch) {
    const century = parseInt(centuryMatch[1]);
    const startYear = (century - 1) * 100 + 1; // e.g. 13th century = 1201-1300
    const endYear = century * 100;
    params.start_year = startYear;
    params.stop_year = endYear;
    return params;
  }
  
  // Match "around YYYY" or "circa YYYY" (English and French)
  const aroundMatch = q.match(/(?:around|circa|about|near|vers|environ|proche de|autour de)\s+(\d+)/);
  if (aroundMatch) {
    const year = parseInt(aroundMatch[1]);
    params.start_year = year - 50;
    params.stop_year = year + 50;
    return params;
  }
  
  // Simple year match (treat as exact_start)
  const yearMatch = q.match(/\b(\d+)\b/);
  if (yearMatch) {
    params.exact_start = parseInt(yearMatch[1]);
    return params;
  }
  
  return params;
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
